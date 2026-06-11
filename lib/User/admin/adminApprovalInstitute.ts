"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. 🚀 APPROVE REQUEST ACTION
export async function approveInstituteRequest(requestId: string) {
    try {
        const request = await prisma.instituteRequest.findUnique({
            where: { id: requestId }
        });

        if (!request) return { success: false, error: "Request record not found." };

        await prisma.$transaction([
            // Institute ko public active karo
            prisma.institute.update({
                where: { id: request.instituteId },
                data: { isActive: true }
            }),
            // Request queue se complete delete/archive status update karo
            prisma.instituteRequest.delete({
                where: { id: requestId }
            })
        ]);

        revalidatePath("/admin/approvals");
        return { success: true, message: "Institute is now live on AcademyFind!" };
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

        revalidatePath("/admin/approvals");
        return { success: true, message: "Request rejected and data safely cleared." };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Rejection pipeline failed." };
    }
}