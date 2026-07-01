"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CLAIM_APPROVED_STATUS, CLAIM_PENDING_STATUS } from "@/lib/institutes/institute-workflow";
import { syncSingleInstituteToMeili } from '@/scripts/SyncInstitute';
import { meili } from "@/lib/meilisearch";

// 1. 🚀 SMART COMBO APPROVE ACTION
export async function approveInstituteRequest(requestId: string) {
    try {
        const request = await prisma.instituteRequest.findUnique({
            where: { id: requestId },
            include: { institute: true }
        });

        if (!request) return { success: false, error: "Request record not found." };
        if (request.status !== "PENDING") {
            return { success: false, error: `Request already ${request.status.toLowerCase()}.` };
        }

        const pendingClaim = await prisma.instituteClaim.findFirst({
            where: {
                instituteId: request.instituteId,
                status: CLAIM_PENDING_STATUS
            },
            orderBy: { createdAt: "asc" }
        });

        const transactionOperations: any[] = [
            // 1. Institute ko public active karo
            prisma.institute.update({
                where: { id: request.instituteId },
                data: { isActive: true, isPublished: true }
            }),
            // 2. 🛠️ FIX: Update status instead of deleting the request
            prisma.instituteRequest.update({
                where: { id: requestId },
                data: { status: "APPROVED" } 
            }),
            // 3. Approval ke baad user ko next listing ke liye pass wapas do
            prisma.user.update({
                where: { id: request.userId },
                data: { canAddInstitute: true }
            })
        ];

        // 4. Manager Assignment Logic remains the same...
        if (pendingClaim) {
            transactionOperations.push(
                prisma.instituteClaim.update({
                    where: { id: pendingClaim.id },
                    data: { status: CLAIM_APPROVED_STATUS }
                }),
                prisma.instituteManager.upsert({
                    where: {
                        userId_instituteId: {
                            userId: pendingClaim.userId,
                            instituteId: pendingClaim.instituteId
                        }
                    },
                    update: {},
                    create: {
                        userId: pendingClaim.userId,
                        instituteId: pendingClaim.instituteId
                    }
                })
            );
        }

        await prisma.$transaction(transactionOperations);

        console.log(`Institute ${request.instituteId} approved, Syncing to Meilisearch...`);
        const syncresult = await syncSingleInstituteToMeili(request.instituteId);
        if (!syncresult.success) {
            console.error("Database updated but MeiliSync Error:", syncresult.error);
        }

        revalidatePath("/af-ass-manage/instituteRequests");
        revalidatePath("/af-ass-manage");
        return { success: true, message: "Institute Approved & Manager Assigned!" };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Approval pipeline failed." };
    }
}

// 2. ❌ REJECT REQUEST ACTION
export async function rejectInstituteRequest(requestId: string) {
    try {
        const request = await prisma.instituteRequest.findUnique({
            where: { id: requestId }
        });

        if (!request) return { success: false, error: "Request not found." };
        if (request.status !== "PENDING") {
            return { success: false, error: `Request already ${request.status.toLowerCase()}.` };
        }
        await prisma.$transaction([
            prisma.instituteRequest.update({
                where: { id: requestId },
                data: { status: "REJECTED" }
            }),
            prisma.user.update({
                where: { id: request.userId },
                data: { canAddInstitute: true }
            })
        ]);

        try {
            const index = meili.index("global_search");
            const documentId = `inst-${request.instituteId}`;
            const response = await index.deleteDocument(documentId);
            await meili.tasks.waitForTask(response.taskUid, { timeout: 10000 });
            console.log(`🗑️ Successfully removed unapproved institute ${documentId} from Meilisearch.`);
        } catch (meiliError) {
            console.error("Failed to delete rejected institute from Meilisearch:", meiliError);
        }
        
        revalidatePath("/af-ass-manage/instituteRequests");
        revalidatePath("/af-ass-manage");
        return { success: true, message: "Request rejected successfully." };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Rejection pipeline failed." };
    }
}