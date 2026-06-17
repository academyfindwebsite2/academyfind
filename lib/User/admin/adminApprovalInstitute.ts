"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. 🚀 SMART COMBO APPROVE ACTION
export async function approveInstituteRequest(requestId: string) {
    try {
        // Fetch request along with any pending claims for this institute
        const request = await prisma.instituteRequest.findUnique({
            where: { id: requestId },
            include: {
                institute: {
                    include: {
                        claims: { where: { status: "PENDING" } } // Naye claim request ko fetch karo
                    }
                }
            }
        });

        if (!request) return { success: false, error: "Request record not found." };

        const pendingClaim = request.institute.claims[0]; // Peli claim request

        // Hum Prisma Transaction banayenge jisme saare kaam ek sath honge
        const transactionOperations: any[] = [
            // 1. Institute ko public active karo
            prisma.institute.update({
                where: { id: request.instituteId },
                data: { isActive: true }
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
                    data: { status: "APPROVED" }
                })
            );
            transactionOperations.push(
                prisma.instituteManager.create({
                    data: {
                        userId: pendingClaim.userId,
                        instituteId: pendingClaim.instituteId
                    }
                })
            );
        }

        // Saare actions ek sath DB mein daal do
        await prisma.$transaction(transactionOperations);

        revalidatePath("/af-ass-manage/approvals");
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

        revalidatePath("/af-ass-manage/approvals");
        return { success: true, message: "Request rejected and data safely cleared." };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Rejection pipeline failed." };
    }
}