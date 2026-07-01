"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CLAIM_APPROVED_STATUS, CLAIM_PENDING_STATUS } from "@/lib/institutes/institute-workflow";
import {syncSingleInstituteToMeili} from '@/scripts/SyncInstitute'
import { meili } from "@/lib/meilisearch";

// 1. 🚀 SMART COMBO APPROVE ACTION
export async function approveInstituteRequest(requestId: string) {
    try {
        // Fetch request along with any pending claims for this institute
        const request = await prisma.instituteRequest.findUnique({
            where: { id: requestId },
            include: {
                institute: true
            }
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

        // Hum Prisma Transaction banayenge jisme saare kaam ek sath honge
        const transactionOperations: any[] = [
            // 1. Institute ko public active karo
            prisma.institute.update({
                where: { id: request.instituteId },
                data: { isActive: true, isPublished: true }
            }),
            // 2. Request queue se delete karo
            prisma.instituteRequest.delete({
                where: { id: requestId }
            })
        ];

        // 3. Agar us bande ne Claim bhi kiya tha, toh usko Manager bana do
        if (pendingClaim) {
            transactionOperations.push(
                prisma.instituteClaim.update({
                    where: { id: pendingClaim.id },
                    data: { status: CLAIM_APPROVED_STATUS }
                })
            );
            transactionOperations.push(
                prisma.instituteManager.upsert({
                    where: {
                        userId_instituteId: {
                            userId: pendingClaim.userId,
                            instituteId: pendingClaim.instituteId
                        }
                    }
                    ,
                    update: {},
                    create: {
                        userId: pendingClaim.userId,
                        instituteId: pendingClaim.instituteId
                    }
                })
            );
        }

        // Saare actions ek sath DB mein daal do
        await prisma.$transaction(transactionOperations);

        console.log(`Institute ${request.instituteId} approved, Syncing to Meilisearch and Pending claim processed: ${!!pendingClaim}`);
        const syncresult = await syncSingleInstituteToMeili(request.instituteId);
        if (!syncresult.success) {
            console.error("Database updated but MeiliSync Error:", syncresult.error);
        }
        revalidatePath("/af-ass-manage/instituteRequests");
        revalidatePath("/af-ass-manage");
        revalidatePath("/institute/[idSlug]");
        return { success: true, message: "Institute Approved & Manager Assigned!" };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Approval pipeline failed." };
    }
}

// ... Reject wali action waisi hi rahegi jaisi aapki thi ...

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
            // Institute draft table se cascade clear karo
            prisma.institute.delete({
                where: { id: request.instituteId }
            }),
            // Request clear karo
            prisma.instituteRequest.delete({
                where: { id: requestId }
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
        return { success: true, message: "Request rejected and data safely cleared." };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Rejection pipeline failed." };
    }
}