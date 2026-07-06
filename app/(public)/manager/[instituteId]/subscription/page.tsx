import { prisma } from "@/lib/prisma";
import SubscriptionClient from "./Subscription"; 

export default async function SubscriptionPage({ params }: { params: Promise<{ instituteId: string }> }) {
    const { instituteId } = await params;
    
    // Server par data fetch karein
    const institute = await prisma.institute.findUnique({ 
        where: { id: instituteId } 
    });
    if (!institute) return null;
    
    // Server par data fetch karein
    const latestPayment = await prisma.subscriptionPayment.findFirst({
        where: { instituteId: institute.id, status: "APPROVED", planRequested: institute.subscriptionPlan },
        orderBy: { createdAt: "desc" }
    });
    const currentBillingCycle = latestPayment?.billingCycle === "ANNUAL" ? "ANNUAL" : "MONTHLY";

    const currentPlan = institute.subscriptionPlan;

    return (
        <SubscriptionClient currentPlan={currentPlan} currentBillingCycle={currentBillingCycle} instituteId={institute.id}/>
    );
}