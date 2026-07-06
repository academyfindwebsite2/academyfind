import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Building2,
    MessageSquare,
    Star,
    Bookmark,
    ArrowRight,
    Sparkles
} from "lucide-react";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Manager Control Panel | AcademyFind",
    robots: {
        index: false,
        follow: false,
    },
};
export default async function InstituteDashboardOverview({
    params
}: {
    params: Promise<{ instituteId: string }>
}) {
    // 🚀 Next.js 15 Async Params Fix
    const { instituteId } = await params;

    // Fetch Institute with related aggregate counts
    const institute = await prisma.institute.findUnique({
        where: { id: instituteId },
        include: {
            _count: {
                select: {
                    reviews: true,
                    shortlistedBy: true,
                    enquiries: true
                }
            },
        }
    });

    if (!institute) redirect("/manager");

    const plan = institute.subscriptionPlan; // BASIC, PREMIUM, ULTRA

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Welcome Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 md:p-8 bg-gradient-to-r from-blue-500 to-slate-700 text-white rounded-3xl shadow-md relative overflow-hidden">
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-amber-500 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

                <div className="space-y-2 relative z-10">
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                        Welcome back, Manager! 👋
                    </h1>
                    <p className="text-slate-300 text-sm max-w-xl">
                        You can manage your institute's profile, leads, and more from here.
                    </p>
                </div>

                <div className="shrink-0 relative z-10 flex flex-col items-end gap-1">
                    <Badge className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-4 py-1.5 rounded-xl uppercase tracking-wider text-xs">
                    </Badge>
                    {plan !== "BASIC" && institute.planExpiresAt && (
                        <span className="text-[10px] text-amber-100 font-medium tracking-wide">
                            Expires {new Date(institute.planExpiresAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                    )}
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Stat 1: Rating & Reviews */}
                <Card className="rounded-2xl border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-slate-500">Public Rating</CardTitle>
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">
                            {/* {institute.averageRating?.toFixed(1) || "0.0"} / 5.0 */}
                            {institute.googleRating} Google Rating
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                            Based on {institute.googleReviewCount} google reviews
                        </p>
                    </CardContent>
                </Card>

                {/* Stat 2: Student Enquiries (Conditional UI) */}
                <Card className="rounded-2xl border-slate-100 shadow-sm relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-slate-500">Student Leads</CardTitle>
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        {plan === "BASIC" ? (
                            <div>
                                <div className="text-xl font-bold text-slate-400 flex items-center gap-1.5">
                                    Locked <span>🔒</span>
                                </div>
                                <p className="text-xs text-blue-600 font-medium mt-1 hover:underline">
                                    <Link href={`/manager/${instituteId}/subscription`}>Upgrade to unlock leads &rarr;</Link>
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div className="text-2xl font-bold text-slate-800">
                                    Active Leads
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    Check your dynamic enquiries tab
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Stat 3: Saves / Shortlists (Conditional UI) */}
                <Card className="rounded-2xl border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-slate-500">Saves Count</CardTitle>
                        <Bookmark className="w-4 h-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        {plan !== "ULTRA" && plan !== "PREMIUM" ? (
                            <div>
                                <div className="text-xl font-bold text-slate-400 flex items-center gap-1.5">
                                    Premium/Elite Only <span>🔒</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    Audience analysis needs Premium or Elite Plan
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div className="text-2xl font-bold text-slate-800">
                                    {institute._count.shortlistedBy} Students
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    Students who have saved your academy
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Action Cards / Next Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Profile Completion Prompt */}
                <Card className="rounded-2xl border-slate-100 p-6 flex flex-col justify-between space-y-4 shadow-sm bg-slate-50/50">
                    <div className="space-y-2">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-800">Update Profile Details</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Update your coaching center's name, description, fee structure, and accurate address to ensure a smooth onboarding experience for students.
                        </p>
                    </div>
                    <Button asChild className="w-full justify-between bg-white text-slate-800 border hover:bg-slate-100 rounded-xl">
                        <Link href={`/manager/${instituteId}/profile`}>
                            Go to Profile Editor <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </Card>

                {/* Plan Promotion Prompt */}
                <Card className="rounded-2xl border-amber-100 p-6 flex flex-col justify-between space-y-4 shadow-sm bg-gradient-to-br from-amber-50/30 to-white">
                    <div className="space-y-2">
                        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-800">Premium Utilities</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            If you want to unlock advanced features like lead tracking, audience insights, and more, consider upgrading your subscription plan.
                        </p>
                    </div>
                    <Button asChild className="w-full justify-between bg-amber-500 hover:bg-amber-600 text-white rounded-xl">
                        <Link href={`/manager/${instituteId}/subscription`}>
                            View Plans & Pricing <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </Card>
            </div>
        </div>
    );
}