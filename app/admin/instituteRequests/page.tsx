import { prisma } from "@/lib/prisma";
import { Check, X, ShieldAlert, MapPin, BadgeIndianRupee, UserCheck } from "lucide-react";
import Image from "next/image";
import ApprovalButtons from "@/components/admin/ApprovalButtons";

export default async function AdminApprovalsPage() {
    const pendingRequests = await prisma.instituteRequest.findMany({
        where: { status: "PENDING" },
        include: {
            user: true,
            institute: {
                include: {
                    city: true,
                    categories: { include: { category: true } },
                    // 🚀 Fetch Pending claims to display in the card
                    claims: { where: { status: "PENDING" } } 
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 font-sans">
            <div className="flex items-center gap-3 border-b pb-4">
                <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl"><ShieldAlert className="w-6 h-6" /></div>
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Pending Listing Approvals</h1>
                    <p className="text-sm text-slate-500">Review user-submitted setups and their claim requests.</p>
                </div>
            </div>

            {pendingRequests.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed rounded-3xl text-slate-400 font-medium">
                    Great job! No pending verification requests in the queue.
                </div>
            ) : (
                <div className="space-y-6">
                    {pendingRequests.map((req: any) => {
                        const claim = req.institute.claims[0]; // Get the attached claim

                        return (
                        <div key={req.id} className="bg-white border rounded-3xl shadow-xs overflow-hidden border-slate-200">
                            
                            <div className="p-4 bg-slate-50 border-b flex flex-wrap justify-between items-center gap-2 text-xs text-slate-500">
                                <div>Submitted by: <span className="font-bold text-slate-800">{req.user.name}</span> ({req.user.email})</div>
                                <div className="font-mono">{new Date(req.createdAt).toLocaleString()}</div>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6">
                                {/* Banner Preview */}
                                <div className="w-full h-32 md:h-full rounded-2xl bg-slate-100 relative overflow-hidden border">
                                    {req.institute.imageUrl ? (
                                        <Image src={req.institute.imageUrl} alt="preview" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">No Cover</div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">{req.institute.name}</h2>
                                        <p className="text-xs text-slate-400 font-mono mt-0.5">slug: {req.institute.slug}</p>
                                    </div>

                                    {/* Categories */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {req.institute.categories.map((c: any) => (
                                            <span key={c.category.id} className="text-[10px] uppercase tracking-wide bg-purple-50 text-purple-700 font-bold px-2.5 py-1 rounded-md border border-purple-100">
                                                {c.category.name}
                                            </span>
                                        ))}
                                    </div>

                                    <p className="text-sm text-slate-600 bg-slate-50/80 p-3 rounded-xl border leading-relaxed line-clamp-2">
                                        {req.institute.description || "No description provided."}
                                    </p>

                                    {/* 🚀 SMART UI: Show Claim Info if it exists */}
                                    {claim && (
                                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-3">
                                            <UserCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-xs font-bold text-amber-900 uppercase">Attached Claim Request</h4>
                                                <div className="text-xs text-amber-800 mt-1 grid grid-cols-2 gap-x-4 gap-y-1">
                                                    <p>Role: <span className="font-semibold">{claim.role}</span></p>
                                                    <p>Phone: <span className="font-semibold">{claim.phone}</span></p>
                                                    <p>Name: <span className="font-semibold">{claim.fullName}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-700">
                                        <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-500" /> {req.institute.city.name}</div>
                                        <div className="flex items-center gap-1.5"><BadgeIndianRupee className="w-4 h-4 text-amber-500" /> Fees: {req.institute.feeInfo || "N/A"}</div>
                                    </div>

                                    <div className="pt-2 flex justify-end">
                                        <ApprovalButtons requestId={req.id} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
            )}
        </div>
    );
}