import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EditProfileForm from "./edit/EditProfileForm";
import { Lock } from "lucide-react";
import Link from "next/link";

export default async function ManagerProfilePage({
    params
}: {
    params: Promise<{ instituteId: string }>
}) {
    // 🚀 Await params properly to avoid type errors
    const { instituteId } = await params;

    // Fetch Institute Data
    const institute = await prisma.institute.findUnique({
        where: { id: instituteId },
        include:{
            teachers: true,
            categories: true
        }
    });

    const allCategories = await prisma.category.findMany({
        where: { isActive: true },
        select: { id: true, name: true }
    })

    if (!institute) return redirect("/manager");
    if (institute.subscriptionPlan === "BASIC") {
        return (
            <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                    <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Student Leads Locked</h2>
                <p className="text-slate-500 max-w-md mb-6">
                    Unlock direct student enquiries and lead generation. Upgrade to the <b>Verified, Premium  Plan</b> or <b>Featured </b>to see who is trying to contact your academy.
                </p>
                <Link href={`/manager/${instituteId}/subscription`} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition">
                    View Upgrade Plans
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Institute Profile</h2>
                <p className="text-sm text-slate-500 mt-1">
                    Update your academy's public information. This data will be visible to students on your public page.
                </p>
            </div>

            {/* Form Section */}
            <div className="p-6 md:p-8 bg-slate-50 border border-slate-100 rounded-3xl shadow-sm">
                <EditProfileForm institute={institute} allCategories={allCategories}/>
            </div>
        </div>
    );
}