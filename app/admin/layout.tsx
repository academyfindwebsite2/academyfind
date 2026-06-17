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
    BellIcon
} from "lucide-react";

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
                        <SidebarLink href="/admin" icon={<LayoutDashboard />} label="Overview" exact />
                        <SidebarLink href="/admin/notifications" icon={<BellIcon />} label="Notifications" />
                        <SidebarLink href="/admin/life-coach" icon={<LifeBuoy />} label="Life Coach" />
                        <SidebarLink href="/admin/claims" icon={<FileText />} label="Claim Requests" />
                        <SidebarLink href="/admin/instituteRequests" icon={<FileType2 />} label="Institute Requests" />
                        <SidebarLink href="/admin/instituteCallbacks" icon={<PhoneCall />} label="Institute Callbacks" />                        
                        <SidebarLink href="/admin/contactmessages" icon={<Contact />} label="Contact Messages" />
                        <SidebarLink href="/admin/payments" icon={<Pyramid />} label="Payment Approvals" />
                        <SidebarLink href="/admin/institutes" icon={<Building2 />} label="All Institutes" />
                        <SidebarLink href="/admin/users" icon={<Users />} label="User Management" />
                        <SidebarLink href="/admin/sales_manager" icon={<Briefcase />} label="Sales Managers" />
                        <SidebarLink href="/admin/careers" icon={<IdCard />} label="Careers" />
                        <div className="my-2 border-t border-slate-200"></div>
                        <SidebarLink href="/admin/categories" icon={<FolderTree />} label="Categories" />
                        <SidebarLink href="/admin/cities" icon={<MapPin />} label="Cities & Regions" />
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

// Sidebar Link Helper Component
function SidebarLink({ href, icon, label, exact = false }: any) {
    // Note: Agar aap active route highlight karna chahte hain, toh yahan 'usePathname' client hook 
    // ka use karke active class laga sakte hain (jaisa humne manager panel me sikhaya tha).
    // Abhi ke liye ye simple and clean hai.
    
    return (
        <Link 
            href={href} 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
            hover:bg-purple-50 hover:text-purple-700 text-slate-600`}
        >
            <span className="[&>svg]:w-4 [&>svg]:h-4">{icon}</span>
            {label}
        </Link>
    );
}