"use client";

import { useState } from "react";
import { CheckCircle2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SubscriptionClientProps {
    currentPlan: string;
    instituteId: string;
}

export default function SubscriptionClient({ currentPlan,instituteId }: SubscriptionClientProps) {
    const [isAnnual, setIsAnnual] = useState(false);
    const [plan,setPlan] = useState();

    const planPriority: Record<string, number> = {
        BASIC: 0,
        VERIFIED: 1,
        PREMIUM: 2,
        ULTRA: 3,
    };
    const currentPlanRank = planPriority[currentPlan] ?? 0;

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
                "Edit Your Profile", 
                "Verified Badge", 
                "Direct Lead Generation"
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
                "Add Social Media Links",
                "Visit & Save Analytics", 
                "Teacher Profiles (Up to 4)", 
                "Videos Links (Up to 4)",
                "Result Pics (Up to 4)",
                "Classroom Pics (Up to 4)"
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
                "Top Priority Search Ranking", 
                "Area-Specific Visibility", 
                "Category-Specific Visibility"
            ] 
        },
    ];

    const router = useRouter();
    const handleCheckout = (planId: string) => {
    router.push(
        `/manager/${instituteId}/subscription/checkout/${planId}?billingCycle=${isAnnual ? "ANNUAL" : "MONTHLY"}`
    );
    };
   

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

            {/* 🚀 TOGGLE BUTTON: Monthly vs Annually */}
            <div className="flex justify-center mt-6 mb-10">
                <div className="bg-slate-100 p-1 rounded-full inline-flex relative shadow-inner border border-slate-200">
                    <button 
                        onClick={() => setIsAnnual(false)} 
                        className={`relative w-32 py-2 text-sm font-bold rounded-full transition-colors z-10 ${!isAnnual ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Monthly
                    </button>
                    <button 
                        onClick={() => setIsAnnual(true)} 
                        className={`relative w-32 py-2 text-sm font-bold rounded-full transition-colors z-10 ${isAnnual ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Annually
                    </button>
                    {/* Animated Pill Background */}
                    <div className={`absolute top-1 left-1 bottom-1 w-32 bg-white rounded-full shadow-sm border border-slate-200 transition-transform duration-300 ease-in-out ${isAnnual ? 'translate-x-32' : 'translate-x-0'}`}></div>
                </div>
            </div>

            {/* 🚀 Changed to 3 columns since Free is removed */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 max-w-5xl mx-auto">
                {plans.map((plan: any) => {
                    const priceData = isAnnual ? plan.pricing.annual : plan.pricing.monthly;

                    return (
                        <div key={plan.id} className={`relative p-6 rounded-3xl border-2 flex flex-col transition-all duration-300 ${
                            currentPlan === plan.id ? "border-amber-400 bg-amber-50/20 shadow-md scale-[1.02]" : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm"
                        }`}>
                            {currentPlan === plan.id && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 text-amber-950 px-4 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase shadow-sm">
                                    Current Plan
                                </div>
                            )}
                            
                            <h3 className="text-xl font-extrabold text-slate-800">{plan.name}</h3>
                            
                            {/* 🚀 PRICING DISPLAY (Original Strikethrough + Offer) */}
                            <div className="mt-3 mb-1">
                                <span className="text-lg text-slate-400 line-through font-semibold mr-2">
                                    ₹{priceData.original.toLocaleString('en-IN')}
                                </span>
                                <span className="text-3xl font-black text-blue-600">
                                    ₹{priceData.offer.toLocaleString('en-IN')}
                                </span>
                                <span className="text-sm text-slate-500 font-medium ml-1">
                                    /{isAnnual ? 'yr' : 'mo'}
                                </span>
                            </div>
                            
                            <p className="text-xs text-slate-500 mt-2 mb-6 h-8 leading-relaxed font-medium">{plan.desc}</p>
                            
                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((feature: any, i: any) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> 
                                        <span className="leading-tight">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button onClick={() => handleCheckout(plan.id)} className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                                currentPlan === plan.id || currentPlanRank > (planPriority[plan.id] ?? 0)
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200" 
                                    : "bg-slate-900 text-white hover:bg-blue-600 shadow-sm hover:shadow-md hover:-translate-y-1"
                            }`}>
                                {currentPlan === plan.id
                                    ? "Active"
                                    : currentPlanRank > (planPriority[plan.id] ?? 0)
                                        ? "Included in current plan"
                                        : "Upgrade Now"}
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}