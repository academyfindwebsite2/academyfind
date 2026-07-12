import { PremiumLock } from "@/components/manager/PremiumLock";
import { ManagerSidebarWrapper } from "@/components/manager/ManagerSidebarWrapper";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, BarChart2, BarChart3, CreditCard, LayoutDashboardIcon, MessageSquare, User, UserRound, Users, PackageOpen, MessageCircle, FileText, Zap } from "lucide-react";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

export const metadata: Metadata = {
    title: "Manager Control Panel | AcademyFind",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function ManagerDashBoardLayout({
    children, params
}: {
    children: React.ReactNode;
    params: any;
}) {
    const { instituteId } = await params;
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        toast.error("You are not logged In")
        redirect('/login')
    }

    const isAuthorized = await prisma.instituteManager.findUnique({
        where: {
            userId_instituteId: {
                userId: session.user.id,
                instituteId: instituteId
            },
        }
    })

    if (session.user.role !== "ADMIN" && !isAuthorized) {
        return (
            <div className="p-12 text-center text-red-500 font-bold text-xl">Unauthorized Access!</div>
        )
    }

    // BACKFILL: Ensure manager has an active InstituteMembership
    if (isAuthorized) {
        const membership = await prisma.instituteMembership.findFirst({
            where: { userId: session.user.id, instituteId, role: 'MANAGER' }
        });
        if (!membership) {
            await prisma.instituteMembership.create({
                data: {
                    userId: session.user.id,
                    instituteId,
                    role: 'MANAGER',
                    status: 'ACTIVE',
                    joinedAt: new Date(),
                    isActive: true
                }
            });
            // Also ensure channel membership
            const { ensureInstituteChannels } = await import("@/lib/chat/ensureInstituteChannels");
            await ensureInstituteChannels(instituteId);
            const channels = await prisma.conversation.findMany({
                where: { instituteId: instituteId, type: 'INSTITUTE' }
            });
            if (channels.length > 0) {
                await prisma.conversationParticipant.createMany({
                    data: channels.map((ch: { id: string }) => ({
                        conversationId: ch.id,
                        userId: session.user.id,
                        role: 'MANAGER' // 
                    })),
                    skipDuplicates: true
                });
            }
        }
    }

    const institute = await prisma.institute.findUnique({
        where: { id: instituteId },
        select: { name: true, subscriptionPlan: true, planExpiresAt: true }
    });

    if (!institute) return <div>Institute not found.</div>;

    // Count pending membership requests
    const pendingCount = await prisma.instituteMembership.count({
        where: { instituteId, status: "PENDING" },
    });

    const plan = institute.subscriptionPlan; // BASIC, PREMIUM, ULTRA

    // Automatic Expiry Notification Check
    if (plan !== "BASIC" && institute.planExpiresAt) {
        const expiresAt = new Date(institute.planExpiresAt);
        const now = new Date();
        const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // If plan expires in 7 days or less, and it hasn't expired yet
        if (daysUntilExpiry <= 7 && daysUntilExpiry >= 0) {
            // Check if we already notified them recently (within the last 7 days)
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const existingNotification = await prisma.userNotification.findFirst({
                where: {
                    userId: session.user.id,
                    entityId: instituteId,
                    type: "SYSTEM",
                    createdAt: { gte: sevenDaysAgo }
                }
            });

            if (!existingNotification) {
                await prisma.userNotification.create({
                    data: {
                        userId: session.user.id,
                        entityId: instituteId,
                        type: "SYSTEM",
                        title: "Plan Expiring Soon",
                        body: `Your ${plan} plan for ${institute.name} expires in ${daysUntilExpiry} days. Please renew to keep your premium features active!`,
                        isRead: false
                    }
                });
            }
        }
    }

    return (
        <div className="bg-slate-50/50 min-h-screen pb-12">
            <div className="container mx-auto max-w-7xl pt-8 px-4 flex flex-col md:flex-row gap-8">

                {/* --- SIDEBAR --- */}
                <ManagerSidebarWrapper>
                    {/* Header */}
                    <div>
                        <Link href="/manager" className="inline-flex items-center text-xs text-slate-500 hover:text-slate-800 mb-4 transition-colors">
                            <ArrowLeft className="w-3 h-3 mr-1" /> Switch Workspace
                        </Link>
                        <h2 className="font-extrabold text-xl text-slate-900 leading-tight">
                            {institute.name}
                        </h2>
                        <div className="mt-2 flex flex-col gap-1 items-start">
                            <span className="inline-block text-[10px] uppercase tracking-wider font-bold bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">
                                {plan} PLAN
                            </span>
                            {plan !== "BASIC" && institute.planExpiresAt && (
                                <span className="text-[10px] text-slate-500 font-semibold tracking-wide">
                                    Expires {new Date(institute.planExpiresAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-1.5">
                        <SidebarLink
                            href={`/manager/${instituteId}`}
                            icon={<LayoutDashboardIcon />}
                            label="Dashboard"
                        />
                        <SidebarLink
                            href={`/manager/${instituteId}/profile`}
                            icon={<User />}
                            label="Profile Data"
                            locked={plan == "BASIC"}
                        />
                        <SidebarLink
                            href={`/manager/${instituteId}/team`}
                            icon={<UserRound />}
                            label="Add a team Member"
                        />
                        <SidebarLink
                            href={`/manager/${instituteId}/members`}
                            icon={<Users />}
                            label="Members"
                            badge={pendingCount > 0 ? pendingCount : undefined}
                            locked={plan === "BASIC" || plan == "VERIFIED"}
                        />
                        <SidebarLink
                            href={`/manager/${instituteId}/batches`}
                            icon={<PackageOpen />}
                            label="Batches"
                            locked={plan == "BASIC" || plan == "VERIFIED"}
                        />
                        <SidebarLink
                            href={`/manager/${instituteId}/chat`}
                            icon={<MessageCircle />}
                            label="Institute Chat"
                            locked={plan == "BASIC" || plan == "VERIFIED"}
                            onClick={() => {
                                if (plan === "BASIC" || plan === "VERIFIED") {
                                    return <PremiumLock title="Institute Chat Locked" description="Upgrade to Premium or Ultra to unlock institute chats, enabling direct communication between students and teachers." instituteId={instituteId} />
                                }
                            }}
                        />
                        <SidebarLink href={`/manager/${instituteId}/leads`} icon={<MessageSquare />} label="Student Leads" locked={plan === "BASIC" || plan == "VERIFIED"} />

                        <SidebarLink
                            href={`/manager/${instituteId}/blogs`}
                            icon={<FileText />}
                            label="Articles"
                            locked={plan === "BASIC" || plan === "VERIFIED"}
                        />

                        <SidebarLink
                            href={`/manager/${instituteId}/metrics`}
                            icon={<BarChart2 />}
                            label="Metrics"
                            locked={plan === "BASIC" || plan === "VERIFIED"}
                        />

                        <SidebarLink
                            href={`/manager/${instituteId}/analytics`}
                            icon={<BarChart3 />}
                            label="Analytics"
                            locked={plan === "BASIC" || plan === "VERIFIED"}
                        />

                        <SidebarLink
                            href={`/manager/${instituteId}/integrations`}
                            icon={<Zap />}
                            label="Integrations"
                            locked={plan === "BASIC" || plan === "VERIFIED"}
                        />

                        <SidebarLink
                            href={`/manager/${instituteId}/subscription`}
                            icon={<CreditCard />}
                            label="Billing & Plan"
                            className="mt-4 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/50"
                        />
                    </nav>
                </ManagerSidebarWrapper>

                {/* --- MAIN CONTENT AREA --- */}
                <main className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 min-h-[600px]">
                    {children}
                </main>

            </div>
        </div>
    );
}

// Helper Component for Sidebar Links
function SidebarLink({ href, icon, label, locked, badge, className = "" }: any) {
    return (
        <Link
            href={href}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all
            hover:bg-blue-50 hover:text-blue-700 text-slate-600 ${className}`}
        >
            <div className="flex items-center gap-3">
                <span className="[&>svg]:w-4 [&>svg]:h-4">{icon}</span>
                {label}
            </div>
            {locked && <span className="text-xs bg-slate-100 text-slate-500 px-1.5 rounded">🔒</span>}
            {!locked && badge !== undefined && (
                <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {badge}
                </span>
            )}
        </Link>
    );
}