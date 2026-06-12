import { prisma } from "@/lib/prisma";
import SubscriptionClient from "./Subscription"; 

export default async function SubscriptionPage({ params }: { params: Promise<{ instituteId: string }> }) {
    const { instituteId } = await params;
    
    // Server par data fetch karein
    const institute = await prisma.institute.findUnique({ 
        where: { id: instituteId } 
    });
    
    if (!institute) return null;

    const currentPlan = institute.subscriptionPlan;

    return (
        <SubscriptionClient currentPlan={currentPlan} instituteId={institute.id}/>
    );
}