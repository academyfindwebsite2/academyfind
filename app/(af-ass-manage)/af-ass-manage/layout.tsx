import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
    LayoutDashboard, 
    Building2, 
    Users, 
    FolderTree, 
    FileText, 
    ArrowLeft,
    MapPin,
    FileType2,
    Contact,
    Pyramid,
    Briefcase,
    LifeBuoy,
    PhoneCall,
    IdCard,
    BellIcon,
    Star,
    BookOpen
} from "lucide-react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin Control Panel | AcademyFind",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Strict Security Check: Sirf Admin allow hoga
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect('/login');
    }

    if (session.user.role !== "ADMIN") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🛑</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-800">Access Denied</h1>
                <p className="text-slate-500">You do not have administrator privileges to view this page.</p>
                <Link href="/" className="text-blue-600 hover:underline">Return to Homepage</Link>
            </div>
        );
    }

    // 2. Fetch all counts (Added Life Coach, Payments, and Job Applications)
    const [
        claimCount,
        reviewCount,
        notificationCount,
        contactCount,
        instituteReqCount,
        lifeCoachCount,
        paymentCount,
        jobAppCount,
        enquiryCount
    ] = await Promise.all([
        prisma.instituteClaim.count({ where: { status: "PENDING" } }),
        prisma.review.count({ where: { status: "PENDING" } }),
        prisma.adminNotification.count({ where: { isRead: false } }),
        prisma.contactMessage.count({ where: { isRead: false } }),
        prisma.instituteRequest.count({ where: { status: "PENDING" } }),
        prisma.lifeCoachRequest.count({ where: { status: "PENDING" } }),
        prisma.subscriptionPayment.count({ where: { status: "PENDING" } }),
        prisma.jobApplication.count({ where: { status: "NEW" } }),
        prisma.instituteEnquiry.count({ where: { status: "NEW" } }), // Job postings ke new applications
    ]);

    return (
        <div className="bg-slate-50 min-h-screen pb-12">
            <div className="container mx-auto max-w-350 pt-8 px-4 flex flex-col md:flex-row gap-8">
                
                {/* --- ADMIN SIDEBAR --- */}
                <aside className="w-full md:w-64 shrink-0 space-y-6">
                    <div>
                        <Link href="/" className="inline-flex items-center text-xs text-slate-500 hover:text-slate-800 mb-4 transition-colors">
                            <ArrowLeft className="w-3 h-3 mr-1" /> Back to Main Site
                        </Link>
                        <h2 className="font-extrabold text-2xl text-slate-900 leading-tight">
                            Admin Center
                        </h2>
                        <span className="inline-block mt-2 text-[10px] uppercase tracking-wider font-bold bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full">
                            Superuser Mode
                        </span>
                    </div>

                    <nav className="flex flex-col gap-1.5">
                        <SidebarLink href="/af-ass-manage" icon={<LayoutDashboard />} label="Overview" />
                        <SidebarLink href="/af-ass-manage/notifications" icon={<BellIcon />} label="Notifications" count={notificationCount}/>
                        
                        {/* 👇 Yahan naye counts pass kiye hain */}
                        <SidebarLink href="/af-ass-manage/life-coach" icon={<LifeBuoy />} label="Life Coach" count={lifeCoachCount} />
                        <SidebarLink href="/af-ass-manage/claims" icon={<FileText />} label="Claim Requests" count={claimCount}/>
                        <SidebarLink href="/af-ass-manage/reviews" icon={<Star />} label="Review Requests" count={reviewCount}/>
                        <SidebarLink href="/af-ass-manage/instituteRequests" icon={<FileType2 />} label="Institute Requests" count={instituteReqCount}/>
                        <SidebarLink href="/af-ass-manage/instituteCallbacks" icon={<PhoneCall />} label="Institute Callbacks" count={enquiryCount}/>                        
                        <SidebarLink href="/af-ass-manage/contactmessages" icon={<Contact />} label="Contact Messages" count={contactCount}/>
                        <SidebarLink href="/af-ass-manage/payments" icon={<Pyramid />} label="Payment Approvals" count={paymentCount} />
                        
                        <SidebarLink href="/af-ass-manage/institutes" icon={<Building2 />} label="All Institutes" />
                        <SidebarLink href="/af-ass-manage/users" icon={<Users />} label="User Management" />
                        <SidebarLink href="/af-ass-manage/sales_manager" icon={<Briefcase />} label="Sales Managers" />
                        
                        {/* 👇 Careers me jobAppCount pass kiya hai */}
                        <SidebarLink href="/af-ass-manage/careers" icon={<IdCard />} label="Careers" count={jobAppCount} />
                        <SidebarLink href="/af-ass-manage/blog" icon={<BookOpen />} label="Blog Management" />
                        
                        <div className="my-2 border-t border-slate-200"></div>
                        <SidebarLink href="/af-ass-manage/categories" icon={<FolderTree />} label="Categories" />
                        <SidebarLink href="/af-ass-manage/cities" icon={<MapPin />} label="Cities & Regions" />
                    </nav>
                </aside>

                {/* --- MAIN ADMIN CONTENT AREA --- */}
                <main className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 min-h-175">
                    {children}
                </main>

            </div>
        </div>
    );
}

// 👇 UPDATED: Sidebar Link Helper Component with Badge UI
function SidebarLink({
    href,
    icon,
    label,
    count,
}: {
    href: string;
    icon: ReactNode;
    label: string;
    count?: number;
}) {
    return (
        <Link 
            href={href} 
            prefetch={false}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all
            hover:bg-purple-50 hover:text-purple-700 text-slate-600`}
        >
            <div className="flex items-center gap-3">
                <span className="[&>svg]:w-4 [&>svg]:h-4">{icon}</span>
                {label}
            </div>
            
            {/* 🔥 Agar count pass hua hai aur > 0 hai, toh badge dikhao */}
            {(count ?? 0) > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {count}
                </span>
            )}
        </Link>
    );
}
