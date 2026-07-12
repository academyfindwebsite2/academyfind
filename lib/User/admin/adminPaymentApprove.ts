"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
    PAYMENT_APPROVED_STATUS,
    PAYMENT_REJECTED_STATUS,
    validatePaymentTransition,
} from "@/lib/institutes/institute-workflow";

export async function approvePayment(paymentId: string) {
    try{
            const payment = await prisma.subscriptionPayment.findUnique({
            where: { id: paymentId },
            include: { institute: true }
        });

        if (!payment) return { success: false, error: "Payment not found", statusCode: 404 };

        const transition = validatePaymentTransition(payment.status, "APPROVED");
        if (!transition.success) {
            return transition;
        }

        const expiryDate = new Date();
        if (payment.billingCycle === "MONTHLY") {
            expiryDate.setDate(expiryDate.getDate() + 30);
        } else {
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        }

        await prisma.$transaction([
            prisma.subscriptionPayment.update({
                where: { id: paymentId },
                data: { status: PAYMENT_APPROVED_STATUS }
            }),
            prisma.institute.update({
                where: { id: payment.instituteId },
                data: {
                    subscriptionPlan: payment.planRequested as any,
                    planExpiresAt: expiryDate,
                    isVerified: true
                }
            })
        ]);

        revalidatePath("/af-ass-manage/payments");
        revalidatePath(`/af-ass-manage/payments/${paymentId}`);
        revalidatePath("/af-ass-manage");
        revalidatePath(`/manager/${payment.instituteId}/subscription`);
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
        if (!payment) return { success: false, error: "Payment not found", statusCode: 404 };

        const transition = validatePaymentTransition(payment.status, "REJECTED");
        if (!transition.success) {
            return transition;
        }

        await prisma.subscriptionPayment.update({
            where: { id: paymentId },
            data: { status: PAYMENT_REJECTED_STATUS },
        });

        revalidatePath("/af-ass-manage/payments");
        revalidatePath(`/af-ass-manage/payments/${paymentId}`)
        revalidatePath("/af-ass-manage");
        return { success: true, message: "Payment rejected." };
    }catch(err){
        console.error(err);
        return { success: false, error: "Failed to reject payment." };
    }
  
}