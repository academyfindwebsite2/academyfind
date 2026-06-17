"use server";

import { prisma } from "@/lib/prisma";

export async function requestGlobalCallback(formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const phone = formData.get("phone") as string;
        const sourceUrl = formData.get("sourceUrl") as string; 

        if (!name || !phone) {
            return { success: false, error: "Name and Phone are required." };
        }

        await prisma.lifeCoachRequest.create({
            data: {
                fullName: name,
                phone: phone,
                message: `Callback requested from page: ${sourceUrl}`,
                status: "PENDING"
            }
        });

        await prisma.adminNotification.create({
            data: {
                type: "NEW_CALLBACK_REQUEST",
                title: "New Callback Request",
                message: `${name} (${phone}) requested a general callback.`,
                actionUrl: "/af-ass-manage/requests"
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Global Callback Error:", error);
        return { success: false, error: "Something went wrong. Please try again." };
    }
}