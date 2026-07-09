import CheckoutForm from "@/components/manager/CheckOutForm";

export default async function CheckoutPage({ params,searchParams }: { params: Promise<{ instituteId: string, planId: string }>;searchParams: Promise<{ billingCycle?: string }>; }) {
    const { instituteId, planId } = await params;
    const resolvedSearchParams = await searchParams;
    const billingCycle = resolvedSearchParams.billingCycle === "ANNUAL" ? "ANNUAL" : "MONTHLY";
    const plans = [
        { 
            id: "VERIFIED", 
            name: "Verified", 
            pricing: {
                monthly: { original: 499, offer: 199 },
                annual: { original: 4999, offer: 1999 }
            },
            desc: "Build trust and start capturing student leads.", 
            features: [
                "Claim Profile", 
                "Student Reviews", 
                "Verified Badge",
                "Teacher Profiles"
            ] 
        },
        { 
            id: "PREMIUM", 
            name: "Premium", 
            pricing: {
                monthly: { original: 999, offer: 499 },
                annual: { original: 9999, offer: 4999 }
            },
            desc: "Showcase faculty, results, and track analytics.", 
            features: [
                "Everything in Verified", 
                "Rich Media (photos/videos)",
                "Student Community", 
                "Institute Forum", 
                "Blog Publishing",
                "Reply to Reviews",
                "Verified Student Display",
                "AI Visibility Insights"
            ] 
        },
        { 
            id: "ULTRA",
            name: "Elite", 
            pricing: {
                monthly: { original: 2999, offer: 999 },
                annual: { original: 29999, offer: 9999 }
            },
            desc: "Maximum visibility and top search rankings.", 
            features: [
                "Everything in Premium", 
                "Priority Search Ranking", 
                "Featured Homepage Placement", 
                "AI Recommended Institute",
                "AFC Campaign Creation",
                "Community Analytics"
            ] 
        },
    ];
    
    const selectedPlan = plans.find((p: any) => p.id === planId); 

    if (!selectedPlan) return <div>Invalid Plan</div>;
    const upiId = process.env.PAYMENT_UPI_ID || "";

    return <CheckoutForm instituteId={instituteId} plan={selectedPlan} BillingCycle={billingCycle} upiId={upiId}/>;
}