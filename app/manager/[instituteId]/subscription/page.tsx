import { prisma } from "@/lib/prisma";
import { CheckCircle2, CreditCard } from "lucide-react";

export default async function SubscriptionPage({ params }: { params: Promise<{ instituteId: string }> }) {
    const { instituteId } = await params;
    const institute = await prisma.institute.findUnique({ where: { id: instituteId } });
    if (!institute) return null;

    const currentPlan = institute.subscriptionPlan; // Backend values: BASIC, VERIFIED, PREMIUM, ULTRA
    const planPriority: Record<string, number> = {
        BASIC: 0,
        VERIFIED: 1,
        PREMIUM: 2,
        ULTRA: 3,
    };
    const currentPlanRank = planPriority[currentPlan] ?? 0;

    // 🚀 Updated to match your exact business logic and limits
    const plans = [
        { 
            id: "BASIC", 
            name: "Listing (Free)", 
            price: "Free", 
            desc: "Basic online presence for your academy.", 
            features: [
                "Institute Information", 
                "Contact Details", 
                "Location & Categories"
            ] 
        },
        { 
            id: "VERIFIED", 
            name: "Verified", 
            price: "₹999/mo", // Update price as needed
            desc: "Build trust and start capturing student leads.", 
            features: [
                "Everything in Free", 
                "Verified Badge", 
                "Direct Lead Generation"
            ] 
        },
        { 
            id: "PREMIUM", 
            name: "Premium", 
            price: "₹2,499/mo", 
            desc: "Showcase faculty, results, and track analytics.", 
            features: [
                "Everything in Verified", 
                "Visit & Save Analytics", 
                "Teacher Profiles (Up to 4)", 
                "Videos & Results (Up to 4)"
            ] 
        },
        { 
            id: "ULTRA", 
            name: "Featured", 
            price: "₹4,999/mo", 
            desc: "Maximum visibility and top search rankings.", 
            features: [
                "Everything in Premium", 
                "Top Priority Search Ranking", 
                "Area-Specific Visibility", 
                "Category-Specific Visibility"
            ] 
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
                    <CreditCard className="w-7 h-7 text-amber-500" /> Subscription Plans
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                    Upgrade your plan to generate more admissions, track performance, and unlock priority ranking.
                </p>
            </div>

            {/* 🚀 Changed to 4 columns for large screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {plans.map((plan) => (
                    <div key={plan.id} className={`relative p-6 rounded-3xl border-2 flex flex-col ${
                        currentPlan === plan.id ? "border-amber-400 bg-amber-50/10 shadow-md" : "border-slate-100 bg-white"
                    }`}>
                        {currentPlan === plan.id && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 text-amber-950 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
                                Current Plan
                            </div>
                        )}
                        
                        <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
                        <div className="text-2xl font-extrabold text-blue-600 mt-2">{plan.price}</div>
                        <p className="text-xs text-slate-500 mt-2 mb-6 h-8 leading-relaxed">{plan.desc}</p>
                        
                        <ul className="space-y-3 mb-8 flex-1">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> 
                                    <span className="leading-tight">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
                            currentPlan === plan.id || currentPlanRank > (planPriority[plan.id] ?? 0)
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                                : "bg-slate-900 text-white hover:bg-blue-600 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        }`}>
                            {currentPlan === plan.id
                                ? "Active"
                                : currentPlanRank > (planPriority[plan.id] ?? 0)
                                    ? "Current plan"
                                    : "Upgrade Now"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}