"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateAdminUser(userId: string, formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const phone = formData.get("phone") as string;
        const role = formData.get("role") as any;
        const isActive = formData.get("isActive") === "true";
        const canAddInstitute = formData.get("canAddInstitute") === "true";

        await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                phone,
                role,
                isActive,
                canAddInstitute
            }
        });

        revalidatePath(`/af-ass-manage/users/${userId}`);
        revalidatePath(`/af-ass-manage/users`);

        return { success: true, message: "User profile updated successfully!" };
    } catch (error) {
        console.error("Update User Error:", error);
        return { success: false, error: "Failed to update user details." };
    }
}

// app/actions/adminUsers.ts ke andar add karein:

export async function addManagerRelation(userId: string, instituteId: string) {
    try {
        // 1. Relation Create Karo
        await prisma.instituteManager.create({
            data: { userId, instituteId }
        });

        // 2. Agar user normal 'USER' hai, toh usko auto-upgrade karke 'INSTITUTE_MANAGER' bana do
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user && user.role === 'USER') {
            await prisma.user.update({
                where: { id: userId },
                data: { role: 'INSTITUTE_MANAGER' }
            });
        }

        revalidatePath(`/af-ass-manage/users/${userId}`);
        return { success: true, message: "Institute assigned successfully!" };
    } catch (error) {
        return { success: false, error: "Relation already exists or failed to assign." };
    }
}

export async function removeManagerRelation(userId: string, instituteId: string) {
    try {
        await prisma.instituteManager.delete({
            where: {
                userId_instituteId: { userId, instituteId }
            }
        });

        revalidatePath(`/af-ass-manage/users/${userId}`);
        return { success: true, message: "Manager access removed." };
    } catch (error) {
        return { success: false, error: "Failed to remove access." };
    }
}