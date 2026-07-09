import { prisma } from "@/lib/prisma"
import { 
    Users, 
    Building2, 
    FileText, 
    FolderTree, 
    ArrowRight, 
    Clock, 
    ShieldAlert
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns";
import { formatIST } from "@/lib/utils";

export default async function AdminDashboardPage() {
    // 🚀 Performance Optimization: Promise.all se saari queries ek saath parallel me chalengi
    const [
        totalUsers,
        totalInstitutes,
        totalCategories,
        pendingClaimsCount,
        recentClaims,
        recentUsers
    ] = await Promise.all([
        prisma.user.count(),
        prisma.institute.count(),
        prisma.category.count(),
        prisma.instituteClaim.count({ where: { status: "PENDING" } }),
        
        // Latest 5 Pending Claims
        prisma.instituteClaim.findMany({
            where: { status: "PENDING" },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { institute: { select: { name: true } } }
        }),

        // Latest 5 Registered Users
        prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: { id: true, name: true, email: true, role: true, createdAt: true }
        })
    ]);

    

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* 1. Welcome Banner */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-800 rounded-3xl p-8 text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">Platform Overview</h1>
                <p className="text-purple-200 max-w-2xl">
                    Welcome to the Superuser Dashboard. Yahan se aap poore AcademyFind platform ke metrics aur recent activities monitor kar sakte hain.
                </p>
            </div>

            {/* 2. Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Users" 
                    value={totalUsers} 
                    icon={<Users className="w-6 h-6 text-blue-600" />} 
                    bg="bg-blue-50" 
                    link="/af-ass-manage/users" 
                />
                <StatCard 
                    title="Institutes Listed" 
                    value={totalInstitutes} 
                    icon={<Building2 className="w-6 h-6 text-emerald-600" />} 
                    bg="bg-emerald-50" 
                    link="/af-ass-manage/institutes" 
                />
                <StatCard 
                    title="Active Categories" 
                    value={totalCategories} 
                    icon={<FolderTree className="w-6 h-6 text-amber-600" />} 
                    bg="bg-amber-50" 
                    link="/af-ass-manage/categories" 
                />
                <StatCard 
                    title="Pending Claims" 
                    value={pendingClaimsCount} 
                    icon={<ShieldAlert className="w-6 h-6 text-red-600" />} 
                    bg="bg-red-50" 
                    link="/af-ass-manage/claims" 
                    alert={pendingClaimsCount > 0}
                />
            </div>

            {/* 3. Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                
                {/* Left: Pending Claims */}
                <div className="border border-slate-200 bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-5 border-b bg-slate-50 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-red-500" /> Action Required: Claims
                        </h3>
                        <Link href="/af-ass-manage/claims" className="text-xs font-bold text-red-600 hover:underline">View All</Link>
                    </div>
                    <div className="p-5 flex-1 space-y-4">
                        {recentClaims.length === 0 ? (
                            <div className="text-center text-slate-400 py-8 text-sm">No pending claims. All caught up! 🎉</div>
                        ) : (
                            recentClaims.map((claim: any) => (
                                <div key={claim.id} className="flex justify-between items-center p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition">
                                    <div>
                                        <p className="font-bold text-sm text-slate-800 line-clamp-1">{claim.institute.name}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Claimed by: {claim.fullName}</p>
                                    </div>
                                    <Link href="/af-ass-manage/claims" className="shrink-0 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-slate-800">
                                        Review
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Newest Users */}
                <div className="border border-slate-200 bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-5 border-b bg-slate-50 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-500" /> Newest Registrations
                        </h3>
                        <Link href="/af-ass-manage/users" className="text-xs font-bold text-blue-600 hover:underline">Manage Users</Link>
                    </div>
                    <div className="p-5 flex-1 space-y-4">
                        {recentUsers.length === 0 ? (
                            <div className="text-center text-slate-400 py-8 text-sm">No users found.</div>
                        ) : (
                            recentUsers.map((user:any) => (
                                <div key={user.id} className="flex justify-between items-center p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition">
                                    <div>
                                        <p className="font-bold text-sm text-slate-800 line-clamp-1">{user.name || "Anonymous"}</p>
                                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                            {user.email} 
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                                            {user.role}
                                        </span>
                                        <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                                            <Clock className="w-3 h-3" /> {formatIST(user.createdAt, "MMM d")}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

// Helper Component for Stat Cards
function StatCard({ title, value, icon, bg, link, alert }: any) {
    return (
        <Link href={link} className="block group">
            <div className={`relative p-6 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all h-full ${alert ? 'ring-2 ring-red-400' : ''}`}>
                {alert && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                    </span>
                )}
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${bg}`}>
                        {icon}
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-slate-800 group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                    <h3 className="text-3xl font-extrabold text-slate-800">{value}</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1">{title}</p>
                </div>
            </div>
        </Link>
    )
}