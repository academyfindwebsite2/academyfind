import CreateInstituteForm from "@/components/User/CreateInstitute";
import { PricingModal } from "@/components/manager/PricingPopUp";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "List Your Institute | AcademyFind",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function UserCreateInstitutePage() {
    // 1. Session check
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) redirect('/login');

    // 2. Fetch User alongside their InstituteManager relation map
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            managedInstitutes: true 
        }
    });

    if (!user) redirect('/login');

    // Fetch the absolute newest request context
    const latestReq = await prisma.instituteRequest.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
            institute: {
                select: { id: true, name: true }
            }
        }
    }) as any;

    const latestStatus = latestReq?.status;
    const isPendingRequest = latestStatus === "PENDING" && !user.canAddInstitute;


    // ==========================================
    // CASE A: User has NO permission to add (Strict Early Returns)
    // ==========================================
    if (isPendingRequest) {
        return (
            <div className="container mx-auto py-10 px-4 space-y-8 font-sans">
                <div className="flex flex-col items-center justify-center text-center p-8 bg-sky-50 border border-sky-200 rounded-3xl max-w-3xl mx-auto shadow-sm">
                    <h1 className="text-2xl font-bold text-sky-800 mb-2">Your Listing Request Is Under Review</h1>
                    <p className="text-sky-700 max-w-2xl">
                        We have received your institute listing request and owner details. You cannot submit another request until this one is approved or rejected.
                    </p>

                    {latestReq?.institute ? (
                        <div className="mt-6 w-full max-w-xl rounded-2xl border border-sky-100 bg-white p-5 text-left shadow-sm">
                            <div className="text-xs font-bold uppercase tracking-wide text-sky-500 mb-3">Submitted Details</div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <div className="text-slate-400 text-xs uppercase font-semibold">Institute</div>
                                    <div className="font-semibold text-slate-800">{latestReq.institute.name}</div>
                                </div>
                                <div>
                                    <div className="text-slate-400 text-xs uppercase font-semibold">Owner</div>
                                    <div className="font-semibold text-slate-800">{latestReq.ownerName || "N/A"}</div>
                                </div>
                                <div>
                                    <div className="text-slate-400 text-xs uppercase font-semibold">Designation</div>
                                    <div className="font-semibold text-slate-800">{latestReq.ownerDesignation || "N/A"}</div>
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-slate-600">
                                Phone: <span className="font-semibold text-slate-800">{latestReq.ownerPhone || "N/A"}</span>
                            </div>
                        </div>
                    ) : null}
                </div>
                
                {/* Pricing Link - visible even when request is pending */}
                <div className="flex justify-center mt-6">
                    <PricingModal>
                        <button className="inline-flex items-center gap-1 text-sm font-medium text-amber-500 transition-colors hover:text-amber-600 cursor-pointer">
                            View Pricing
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </PricingModal>
                </div>
            </div>
        );
    }

    if (!user.canAddInstitute) {
        if (latestStatus === "REJECTED") {
            return (
                <div className="container mx-auto py-10 px-4 font-sans">
                    <div className="flex flex-col items-center justify-center text-center p-8 bg-red-50 border-2 border-red-200 rounded-3xl max-w-2xl mx-auto shadow-sm">
                        <h1 className="text-2xl font-bold text-red-700 mb-2">Institute Request Rejected</h1>
                        <p className="text-red-600 mb-6 font-medium">
                            Unfortunately, your previous submission did not meet our guidelines and was not approved by the admin team.
                        </p>
                        <p className="text-sm text-slate-500">
                            Please contact support for more details or if you believe this was a mistake.
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div className="container mx-auto py-10 px-4 font-sans">
                <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-50 border rounded-3xl max-w-2xl mx-auto">
                    <h2 className="text-xl font-bold text-slate-800">Action Restricted</h2>
                    <p className="text-slate-500 mt-2">You currently do not have permission to add a new institute.</p>
                </div>
            </div>
        );
    }


    // ==========================================
    // CASE B: User CAN add (Form renders, Banner shows logic)
    // ==========================================
    const allCities = await prisma.city.findMany({ orderBy: { name: 'asc' } });
    const allCategories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

    // Determine conditional banner states
    let bannerComponent = null;

    if (latestStatus === "REJECTED") {
        bannerComponent = (
            <div className="flex flex-col items-center justify-center text-center p-6 bg-amber-50 border border-amber-200 rounded-2xl max-w-4xl mx-auto mb-8 shadow-sm">
                <h2 className="text-lg font-bold text-amber-800 mb-1">Your Last Request Was Rejected</h2>
                <p className="text-sm text-amber-700 font-medium">
                    Your previous submission did not meet our guidelines. However, you can use the form below to submit a clean new institute listing request.
                </p>
            </div>
        );
    } 
    
    else if (latestStatus === "APPROVED") {
        const isAlreadyManager = latestReq
            ? user.managedInstitutes.some(
                (manager: { instituteId: string }) => manager.instituteId === latestReq.instituteId
            )
            : false;

        bannerComponent = (
            <div className="flex flex-col items-center justify-center text-center p-6 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-4xl mx-auto mb-8 shadow-sm">
                <h2 className="text-lg font-bold text-emerald-800 mb-1">Your Last Request Was Approved!</h2>
                <p className="text-sm text-emerald-700 font-medium mb-3">
                    {isAlreadyManager
                        ? "Your institute listing is live and you are recognized as a manager for it. You can access your management zone now."
                        : "Your request was approved and ownership sync is being completed."}
                </p>
                <Link href="/manager" passHref legacyBehavior>
                    <Button className="bg-emerald-600 text-white hover:bg-emerald-700 transition size-sm">
                        Go to Dashboard
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4">
            {/* Conditional Notification Banner if history rules match */}
            {bannerComponent}

            {/* Always Available Creation Interface for Authorized Users */}
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-slate-800">List Your Institute</h1>
                        <p className="text-slate-500 mb-8">Fill up the form parameters below to propose a new corporate institute request listing.</p>
                    </div>
                    <PricingModal>
                        <button className="inline-flex items-center gap-1 text-sm font-medium text-amber-500 transition-colors hover:text-amber-600 cursor-pointer">
                            View Pricing
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </PricingModal>
                </div>
                
                {latestStatus !== "PENDING" && (
                    <CreateInstituteForm 
                        userId={user.id} 
                        allCities={allCities} 
                        allCategories={allCategories} 
                    />
                )}
            </div>
        </div>
    );
}
