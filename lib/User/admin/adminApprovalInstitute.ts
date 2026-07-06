"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { syncSingleInstituteToMeili } from '@/scripts/SyncInstitute';
import { meili } from "@/lib/meilisearch";

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

        const transactionOperations: any[] = [
            prisma.institute.update({
                where: { id: request.instituteId },
                data: { 
                    isActive: true, 
                    isPublished: true,
                    subscriptionPlan: "BASIC" 
                }
            }),
            prisma.instituteRequest.update({
                where: { id: requestId },
                data: { status: "APPROVED" } 
            }),
            prisma.user.update({
                where: { id: request.userId },
                data: { 
                    canAddInstitute: true,
                    role: "INSTITUTE_MANAGER" 
                }
            }),
            prisma.instituteManager.upsert({
                where: {
                    userId_instituteId: {
                        userId: request.userId,
                        instituteId: request.instituteId
                    }
                },
                update: {},
                create: {
                    userId: request.userId,
                    instituteId: request.instituteId
                }
            }),
            prisma.instituteMembership.upsert({
                where: {
                    userId_instituteId_role: {
                        userId: request.userId,
                        instituteId: request.instituteId,
                        role: 'MANAGER'
                    }
                },
                create: {
                    userId: request.userId,
                    instituteId: request.instituteId,
                    role: 'MANAGER',
                    status: 'ACTIVE',
                    joinedAt: new Date(),
                    isActive: true
                },
                update: {
                    status: 'ACTIVE',
                    joinedAt: new Date(),
                    isActive: true
                }
            })
        ];

        // DB Transaction execute karein
        await prisma.$transaction(transactionOperations);

        // Also ensure institute channels exist and add manager
        const { addMemberToInstituteChannels } = await import("@/lib/chat/ensureInstituteChannels");
        await addMemberToInstituteChannels(request.userId, request.instituteId, "MANAGER");

        console.log(`Institute ${request.instituteId} approved, Syncing to Meilisearch...`);
        
        // Fix: Meilisearch task wait ko non-blocking banaya taaki server action pipeline fast respond kare
        const syncresult = await syncSingleInstituteToMeili(request.instituteId);
        if (!syncresult.success) {
            console.error("Database updated but MeiliSync Error:", syncresult.error);
        }

        revalidatePath("/af-ass-manage/instituteRequests");
        revalidatePath("/af-ass-manage");
        
        return { success: true, message: "Institute Approved & Assigned to Manager (Basic Plan)!" };
    } catch (error) {
        console.error("Approval action error:", error);
        return { success: false, error: "Approval pipeline failed." };
    }
}

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
            // Background cleanup bina product blocking ke
            await index.deleteDocument(documentId);
            console.log(`🗑️ Sent remove request for unapproved institute ${documentId} to Meilisearch.`);
        } catch (meiliError) {
            console.error("Failed to delete rejected institute from Meilisearch:", meiliError);
        }
        
        revalidatePath("/af-ass-manage/instituteRequests");
        revalidatePath("/af-ass-manage");
        return { success: true, message: "Request rejected successfully." };
    } catch (error) {
        console.error("Rejection action error:", error);
        return { success: false, error: "Rejection pipeline failed." };
    }
}
