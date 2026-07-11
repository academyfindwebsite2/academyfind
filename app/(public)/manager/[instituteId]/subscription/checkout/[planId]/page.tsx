import CheckoutForm from "@/components/manager/CheckOutForm";

export default async function CheckoutPage({ params, searchParams }: { params: Promise<{ instituteId: string, planId: string }>; searchParams: Promise<{ billingCycle?: string }>; }) {
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
                "Institute and Batch Chats",
                "Blog Publishing",
                "Reply to Reviews",
                "Verified Student Display"
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
            ]
        },
    ];

    const selectedPlan = plans.find((p: any) => p.id === planId);

    if (!selectedPlan) return <div>Invalid Plan</div>;
    const upiId = process.env.PAYMENT_UPI_ID || "";
    const bankDetails = {
        bankName: process.env.PAYMENT_BANK_NAME || "",
        accountName: process.env.PAYMENT_ACCOUNT_NAME || "",
        accountNumber: process.env.PAYMENT_ACCOUNT_NUMBER || "",
        ifscCode: process.env.PAYMENT_IFSC_CODE || ""
    };

    return <CheckoutForm instituteId={instituteId} plan={selectedPlan} BillingCycle={billingCycle} upiId={upiId} bankDetails={bankDetails} />;
}