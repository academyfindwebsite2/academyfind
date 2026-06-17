import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, Clock, ShieldAlert, ArrowLeft, History, Star, Building2, FileText } from "lucide-react";
import AdminUserEditForm from "@/components/admin/AdminUserEditForm";
import ManagerControl from "@/components/admin/AdminManagerControls"; 

export default async function UserDetailsPage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;

    // 1. Fetch User with all relations
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            managedInstitutes: { include: { institute: true } },
            instituteRequests: { orderBy: { createdAt: 'desc' } }, // 🚀 Requests fetch (Ordered by latest)
            claims: { orderBy: { createdAt: 'desc' } },
            reviews: { include: { institute: { select: { name: true } } } },
            viewHistory: { 
                include: { institute: { select: { name: true } } },
                orderBy: { viewedAt: 'desc' },
                take: 10
            },
            shortlisted: { include: { institute: { select: { name: true } } } }
        }
    });

    if (!user) notFound();

    // 2. Fetch ALL Institutes for the assignment dropdown (Lightweight fetch)
    const allInstitutes = await prisma.institute.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans">
            
            <Link href="/af-ass-manage/users" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to User Directory
            </Link>

            {/* Header Profile Card */}
            <div className="bg-slate-900 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
                
                <div className="w-24 h-24 rounded-full border-4 border-slate-800 bg-slate-800 overflow-hidden shrink-0">
                    {user.image ? (
                        <Image src={user.image} alt={user.name || "User"} width={96} height={96} className="object-cover w-full h-full" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-400">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                    )}
                </div>

                <div className="flex-1 text-center md:text-left z-10">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white">{user.name || "Unknown User"}</h1>
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold uppercase rounded-lg border border-blue-500/30">
                            {user.role}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-400 font-medium">
                        <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user.email}</span>
                        <span className="flex items-center gap-1.5"><ShieldAlert className="w-4 h-4" /> {user.emailVerified ? "Verified Email" : "Unverified Email"}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT COLUMN: EDIT FORM & REQUESTS */}
                <div className="lg:col-span-2 space-y-6">
                    <AdminUserEditForm user={user} />

                    {/* Summary Boxes */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 border-b pb-2">
                            <ShieldAlert className="w-5 h-5 text-amber-500" /> Requests Summary
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                <div className="text-amber-800 font-bold mb-1">Total Listing Requests</div>
                                <div className="text-2xl font-black text-amber-600">{user.instituteRequests.length}</div>
                            </div>
                            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                <div className="text-amber-800 font-bold mb-1">Total Ownership Claims</div>
                                <div className="text-2xl font-black text-amber-600">{user.claims.length}</div>
                            </div>
                        </div>
                    </div>

                    {/* 🚀 NAYA SECTION: Detailed Institute Requests List */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 border-b pb-2">
                            <FileText className="w-5 h-5 text-indigo-500" /> Institute Listing Requests
                        </h3>
                        
                        {user.instituteRequests.length > 0 ? (
                            <ul className="space-y-3">
                                {user.instituteRequests.map((req) => (
                                    <li key={req.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-slate-100/50 transition-colors">
                                        <div>
                                            <div className="font-bold text-slate-800 text-base">{req.id}</div>
                                            <div className="text-xs text-slate-500 font-medium mt-1">
                                                Institute: <span className="font-mono bg-white px-1.5 py-0.5 rounded border">{req.instituteId}</span>
                                            </div>
                                            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Submitted on {new Date(req.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        
                                        {/* Status Badge with Color Coding */}
                                        <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border shrink-0 ${
                                            req.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                            req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                            'bg-red-100 text-red-700 border-red-200'
                                        }`}>
                                            {req.status}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-400 p-6 text-center bg-slate-50 rounded-xl border border-dashed">
                                This user has not submitted any institute listing requests.
                            </p>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: DATA OVERVIEW & MANAGER CONTROL */}
                <div className="space-y-6">
                    
                    <ManagerControl 
                        userId={user.id} 
                        managedInstitutes={user.managedInstitutes} 
                        allInstitutes={allInstitutes} 
                    />

                    {/* Recent View History */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <History className="w-4 h-4 text-purple-500" /> Recent Browsing
                        </h3>
                        {user.viewHistory.length > 0 ? (
                            <ul className="space-y-2">
                                {user.viewHistory.map((history) => (
                                    <li key={history.id} className="text-xs p-2 bg-slate-50 border rounded-lg flex justify-between">
                                        <span className="truncate flex-1 font-medium text-slate-700">{history.institute.name}</span>
                                        <span className="text-slate-400 shrink-0 ml-2">{new Date(history.viewedAt).toLocaleDateString()}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : <p className="text-xs text-slate-400 p-2 text-center bg-slate-50 rounded-xl border border-dashed">No view history found.</p>}
                    </div>

                    {/* Reviews */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <Star className="w-4 h-4 text-emerald-500" /> Reviews Given ({user.reviews.length})
                        </h3>
                        {user.reviews.length > 0 ? (
                            <ul className="space-y-2">
                                {user.reviews.slice(0, 5).map((review) => (
                                    <li key={review.id} className="text-xs p-2 bg-slate-50 border rounded-lg flex justify-between">
                                        <span className="truncate flex-1 font-medium text-slate-700">{review.institute.name}</span>
                                        <span className="font-bold text-amber-500 shrink-0 ml-2">★ {review.rating}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : <p className="text-xs text-slate-400 p-2 text-center bg-slate-50 rounded-xl border border-dashed">No reviews written.</p>}
                    </div>

                </div>
            </div>
        </div>
    );
}