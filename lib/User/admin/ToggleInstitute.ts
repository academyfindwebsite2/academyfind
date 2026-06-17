"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleInstituteStatus(instituteId: string, currentStatus: boolean) {
    try {
        await prisma.institute.update({
            where: { id: instituteId },
            data: { isActive: !currentStatus } // True hai toh False kar dega, False hai toh True
        });

        // Admin page aur Public page dono ko revalidate karenge
        revalidatePath("/af-ass-manage/institutes");
        
        return { success: true, message: `Institute ${!currentStatus ? 'Published' : 'Hidden'} successfully!` };
    } catch (error) {
        console.error("Status Toggle Error:", error);
        return { success: false, error: "Failed to update status." };
    }
}