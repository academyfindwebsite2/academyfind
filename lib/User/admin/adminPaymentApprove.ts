"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approvePayment(paymentId: string) {
    try{
            const payment = await prisma.subscriptionPayment.findUnique({
            where: { id: paymentId },
            include: { institute: true }
        });

        if (!payment || payment.status !== "PENDING") return { success: false, error: "Payment not found" };

        const expiryDate = new Date();
        if (payment.billingCycle === "MONTHLY") {
            expiryDate.setDate(expiryDate.getDate() + 30);
        } else {
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        }

        await prisma.$transaction([
            prisma.subscriptionPayment.update({
                where: { id: paymentId },
                data: { status: "APPROVED" }
            }),
            prisma.institute.update({
                where: { id: payment.instituteId },
                data: {
                    subscriptionPlan: payment.planRequested as any,
                    planExpiresAt: expiryDate
                }
            })
        ]);

        revalidatePath("/admin/payments");
        revalidatePath(`/admin/payment/${paymentId}`);
        return { success: true, message: "Payment approved and plan activated!" };
    }catch(err){
        console.error(err);
        return { success: false, error: "Failed to approve payment." };
    }
    
}

export async function rejectPayment(paymentId: string) {
    try{
          const payment = await prisma.subscriptionPayment.findUnique({
          where: { id: paymentId },
    });
        if (!payment) return { success: false, error: "Payment not found" };

        await prisma.subscriptionPayment.update({
            where: { id: paymentId },
            data: { status: "REJECTED" },
        });

        revalidatePath("/admin/payments");
        revalidatePath(`/admin/payments/${paymentId}`)
        return { success: true, message: "Payment rejected." };
    }catch(err){
        console.error(err);
        return { success: false, error: "Failed to reject payment." };
    }
  
}