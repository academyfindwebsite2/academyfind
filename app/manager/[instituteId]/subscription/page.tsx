import { prisma } from "@/lib/prisma";
// Naya client component import karein (Path apne hisaab se theek kar lein)
import SubscriptionClient from "./Subscription"; 

export default async function SubscriptionPage({ params }: { params: Promise<{ instituteId: string }> }) {
    const { instituteId } = await params;
    
    // Server par data fetch karein
    const institute = await prisma.institute.findUnique({ 
        where: { id: instituteId } 
    });
    
    if (!institute) return null;

    const currentPlan = institute.subscriptionPlan; // Backend values: BASIC, VERIFIED, PREMIUM, ULTRA

    return (
        // Client Component ko current plan bhej dein
        <SubscriptionClient currentPlan={currentPlan} />
    );
}