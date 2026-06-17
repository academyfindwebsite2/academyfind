"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Notification ko Read mark karne ka function
export async function markNotificationAsRead(notificationId: string) {
    try {
        await prisma.adminNotification.update({
            where: { id: notificationId },
            data: { isRead: true }
        });
        
        // Page ko refresh karne ke liye taaki UI turant update ho jaye
        revalidatePath("/admin/notifications");
        return { success: true };
    } catch (error) {
        console.error("Failed to mark notification as read:", error);
        return { success: false, error: "Something went wrong" };
    }
}

// Saari notifications ko ek sath Read mark karne ka function
export async function markAllAsRead(formData?: FormData) {
    try {
        await prisma.adminNotification.updateMany({
            where: { isRead: false },
            data: { isRead: true }
        });
        
        revalidatePath("/admin/notifications");
    } catch (error) {
        console.error("Failed to mark all as read:", error);
    }
}