"use server"

import { prisma } from "@/lib/prisma";

export async function submitLifeCoachRequest(formData: FormData) {
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string || "";
    const message = formData.get("message") as string;

    if (!fullName || !phone) {
        return { success: false, error: "Name, Phone, and Email are strictly required." };
    }

    try {
        await prisma.lifeCoachRequest.create({
            data: {
                fullName,
                phone,
                email,
                message: message || null
            }
        });

        return { success: true, message: "Request logged inside admin queue!" };
    } catch (error) {
        console.error("Life Coach Submit Error:", error);
        return { success: false, error: "Failed to submit request due to pipeline error." };
    }
}