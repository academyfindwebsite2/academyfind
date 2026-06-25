import { prisma } from "@/lib/prisma";
import { Lock, MessageSquare, Phone, Calendar, ArrowRight, Repeat, Info } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { PLAN_LIMITS, PlanType } from "@/lib/plan_limits";

export default async function EnquiriesPage({ params }: { params: Promise<{ instituteId: string }> }) {
    const { instituteId } = await params;

    const institute = await prisma.institute.findUnique({
        where: { id: instituteId },
        include: { enquiries: { orderBy: { createdAt: 'desc' } } }
    });

    if (!institute) return <div>Institute not found</div>;

    const limits = PLAN_LIMITS[institute.subscriptionPlan as PlanType];

    if (!limits.hasLeads) {
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
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-blue-600" /> Student Enquiries
                </h2>
                <p className="text-sm text-slate-500 mt-1">Manage all the direct contact requests from students.</p>
            </div>

            {institute.enquiries.length === 0 ? (
                <div className="p-12 text-center border rounded-3xl bg-slate-50">
                    <p className="text-slate-500">No enquiries yet. Keep your profile updated to attract more students!</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {institute.enquiries.map((enquiry: any) => (
                        <div key={enquiry.id} className={`p-5 border rounded-2xl shadow-sm bg-white transition-colors ${
                            enquiry.parentId ? 'border-amber-200 hover:border-amber-300' : 'border-slate-100 hover:border-blue-100'
                        }`}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-bold text-lg text-slate-800">{enquiry.name}</h3>
                                        {enquiry.parentId && (
                                            <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold tracking-wider">
                                                <Repeat className="w-3 h-3" /> Forwarded Lead
                                            </span>
                                        )}
                                    </div>
                                    <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold tracking-wider">
                                        {enquiry.status}
                                    </span>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <div className="text-xs text-slate-400 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {format(new Date(enquiry.createdAt), "PPp")}
                                    </div>
                                    <Link
                                        href={`/manager/leads/${instituteId}/${enquiry.id}`}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        View Details <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>

                            {enquiry.adminNote && (
                                <div className="mb-3 text-xs bg-amber-50 border border-amber-100 text-amber-800 p-2.5 rounded-lg flex items-start gap-1.5">
                                    <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                    <span><b>Admin note:</b> {enquiry.adminNote}</span>
                                </div>
                            )}

                            <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl mb-4 italic line-clamp-2">
                                "{enquiry.message || "No message provided."}"
                            </p>

                            <div className="flex items-center gap-6 text-sm text-slate-600">
                                <Link href={`tel:${enquiry.phone}`} className="flex items-center gap-1.5 hover:text-blue-600">
                                    <Phone className="w-4 h-4" /> {enquiry.phone}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}