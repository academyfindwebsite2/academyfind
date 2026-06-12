import { prisma } from "@/lib/prisma";
import { Lock, BarChart3, Users, Bookmark, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns"; // Date format karne ke liye

export default async function AnalyticsPage({ params }: { params: Promise<{ instituteId: string }> }) {
    const { instituteId } = await params;

    // 🚀 UPDATE: Database se count ke sath-saath actual users ki list bhi fetch kar rahe hain
    const institute = await prisma.institute.findUnique({
        where: { id: instituteId },
        include: {
            _count: { select: { viewHistory: true, shortlistedBy: true } },
            // Latest 30 students jinhone save/shortlist kiya
            shortlistedBy: {
                include: { user: { select: { name: true, email: true, image: true } } },
                orderBy: { createdAt: 'desc' },
                take: 30 
            },
            // Latest 30 students jinhone profile view ki
            viewHistory: {
                include: { user: { select: { name: true, email: true, image: true } } },
                orderBy: { viewedAt: 'desc' },
                take: 30 
            }
        }
    });

    if (!institute) return <div>Institute not found</div>;

    // 🔒 LOCK SCREEN FOR BASIC & PREMIUM
    if (institute.subscriptionPlan === "BASIC" || institute.subscriptionPlan === "VERIFIED") {
        return (
            <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                    <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Audience Analytics Locked</h2>
                <p className="text-slate-500 max-w-md mb-6">
                    Want to see exactly how many students view and save your academy profile? Upgrade to the <b>Ultra Plan</b> for deep insights.
                </p>
                <Link href={`/manager/${instituteId}/subscription`} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition">
                    Get Ultra Plan
                </Link>
            </div>
        );
    }

    // 🔓 UNLOCKED VIEW FOR ULTRA
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-indigo-600" /> Performance Analytics
                </h2>
                <p className="text-sm text-slate-500 mt-1">Track your academy's visibility and see which students are interested.</p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Views Card */}
                <div className="p-6 border border-slate-100 bg-white shadow-sm rounded-2xl flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Users className="w-8 h-8" /></div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Profile Views</p>
                        <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{institute._count.viewHistory}</h3>
                    </div>
                </div>

                {/* Shortlists Card */}
                <div className="p-6 border border-slate-100 bg-white shadow-sm rounded-2xl flex items-center gap-4">
                    <div className="p-4 bg-red-50 text-red-500 rounded-2xl"><Bookmark className="w-8 h-8" /></div>
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Students Shortlisted</p>
                        <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{institute._count.shortlistedBy}</h3>
                    </div>
                </div>
            </div>
            
            {/* 🚀 NEW: Detailed Lists of Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                
                {/* Shortlisted Users List */}
                <div className="border border-slate-100 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-[500px]">
                    <div className="p-5 border-b bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bookmark className="w-5 h-5 text-red-500" />
                            <h3 className="font-bold text-slate-800">Recently Shortlisted By</h3>
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-200/50 px-2 py-1 rounded-md">Latest 30</span>
                    </div>
                    <div className="p-4 overflow-y-auto flex-1 space-y-2">
                        {institute.shortlistedBy.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
                                No students have saved your profile yet.
                            </div>
                        ) : (
                            institute.shortlistedBy.map((item) => (
                                <UserListItem 
                                    key={item.userId} 
                                    user={item.user} 
                                    date={item.createdAt} 
                                    actionType="Saved" 
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Profile Viewers List */}
                <div className="border border-slate-100 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-[500px]">
                    <div className="p-5 border-b bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            <h3 className="font-bold text-slate-800">Recent Profile Viewers</h3>
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-slate-200/50 px-2 py-1 rounded-md">Latest 30</span>
                    </div>
                    <div className="p-4 overflow-y-auto flex-1 space-y-2">
                        {institute.viewHistory.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
                                No recent views found.
                            </div>
                        ) : (
                            institute.viewHistory.map((item) => (
                                <UserListItem 
                                    key={item.id} 
                                    user={item.user} 
                                    date={item.viewedAt} 
                                    actionType="Viewed" 
                                />
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

// 🚀 HELPER COMPONENT: User ki details dikhane ke liye (Isi file me sabse niche rakhein)
function UserListItem({ user, date, actionType }: { user: any, date: Date, actionType: string }) {
    return (
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 overflow-hidden shrink-0 border shadow-sm">
                    {user?.image ? (
                        <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
                    ) : (
                        user?.name?.charAt(0).toUpperCase() || "U"
                    )}
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-800">{user?.name || "Anonymous Student"}</p>
                    <p className="text-xs text-slate-500">{user?.email || "Email hidden"}</p>
                </div>
            </div>
            <div className="text-right shrink-0">
                <p className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" /> {actionType}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                    {format(new Date(date), "MMM d, h:mm a")}
                </p>
            </div>
        </div>
    );
}