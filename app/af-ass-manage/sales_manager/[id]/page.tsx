import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SalesStatusBadge } from "@/components/sales/SalesStatusBadge";
import AdminAssignInstituteForm from "@/components/admin/AdminAssignInstituteForm";
import AdminAssignCategoryForm from "@/components/admin/AdminAssignCategoryForm";
import RemoveAssignmentButton from "@/components/admin/AdminRemoveAssignmentButton";
import {
    User,
    Mail,
    Phone,
    Building2,
    FolderTree,
    CalendarDays,
    ArrowLeft,
    CheckCircle2,
    Clock,
    PhoneOff,
    AlertTriangle,
    ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

export default async function AdminSalesManagerDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const manager = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            role: true,
            createdAt: true,
            isActive: true,
        }
    });

    if (!manager || manager.role !== "SALES_MANAGER") {
        notFound();
    }

    const [assignments, categoryAssignments, allInstitutes, allCategories] = await Promise.all([
        // Current assignments
        prisma.salesAssignment.findMany({
            where: { salesManagerId: id },
            include: {
                institute: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                        city: { select: { name: true } },
                        categories: {
                            include: { category: { select: { name: true } } },
                            take: 2,
                        }
                    }
                }
            },
            orderBy: [{ contactStatus: "asc" }, { deadline: "asc" }],
        }),

        // Category assignments
        prisma.salesCategoryAssignment.findMany({
            where: { salesManagerId: id },
            include: {
                category: { select: { id: true, name: true } }
            },
            orderBy: { createdAt: "desc" },
        }),

        // All institutes for assignment form (exclude already assigned)
        prisma.institute.findMany({
            where: {
                salesAssignments: null
            },
            select: {
                id: true,
                name: true,
                city: { select: { name: true } },
            },
            orderBy: { name: "asc" },
            take: 500,
        }),

        // All categories for assignment form (exclude already assigned)
        prisma.category.findMany({
            where: {
                isActive: true,
                NOT: {
                    salesCategoryAssignments: {
                        some: { salesManagerId: id }
                    }
                }
            },
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        }),
    ]);

    const now = new Date();
    const total = assignments.length;
    const onboarded = assignments.filter((a: any)=> a.contactStatus === "ONBOARDED").length;
    const contacted = assignments.filter((a:any) => a.contactStatus === "CONTACTED").length;
    const notContacted = assignments.filter((a: any) => a.contactStatus === "NOT_CONTACTED").length;
    const overdue = assignments.filter((a:any) =>
        a.deadline && new Date(a.deadline) < now && a.contactStatus !== "ONBOARDED"
    ).length;
    const completionRate = total > 0 ? Math.round((onboarded / total) * 100) : 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Back Link */}
            <Link href="/af-ass-manage/sales_manager" className="inline-flex items-center text-xs text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft className="w-3 h-3 mr-1" /> Back to All Sales Managers
            </Link>

            {/* Manager Profile Header */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-800 rounded-3xl p-8 text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                <div className="flex flex-col sm:flex-row items-start gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-2xl text-white/80 overflow-hidden shrink-0 backdrop-blur-sm border border-white/10">
                        {manager.image ? (
                            <Image src={manager.image} alt="avatar" width={64} height={64} className="w-full h-full object-cover" />
                        ) : (
                            manager.name?.charAt(0).toUpperCase() || "S"
                        )}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-extrabold tracking-tight">{manager.name || "Sales Manager"}</h1>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-purple-200">
                            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {manager.email}</span>
                            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {manager.phone || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <Link
                                href={`/sales_manager/${id}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm"
                            >
                                <ExternalLink className="w-3 h-3" /> View as Manager
                            </Link>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-5 gap-3 text-center">
                        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/5 min-w-[60px]">
                            <div className="text-xl font-extrabold">{total}</div>
                            <div className="text-[9px] uppercase tracking-wider text-purple-300 mt-0.5">Total</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/5 min-w-[60px]">
                            <div className="text-xl font-extrabold flex items-center justify-center gap-1">
                                <PhoneOff className="w-3 h-3 text-slate-300" />{notContacted}
                            </div>
                            <div className="text-[9px] uppercase tracking-wider text-purple-300 mt-0.5">Pending</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/5 min-w-[60px]">
                            <div className="text-xl font-extrabold flex items-center justify-center gap-1">
                                <Clock className="w-3 h-3 text-amber-300" />{contacted}
                            </div>
                            <div className="text-[9px] uppercase tracking-wider text-purple-300 mt-0.5">Called</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/5 min-w-[60px]">
                            <div className="text-xl font-extrabold flex items-center justify-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-300" />{onboarded}
                            </div>
                            <div className="text-[9px] uppercase tracking-wider text-purple-300 mt-0.5">Done</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/5 min-w-[60px]">
                            <div className={`text-xl font-extrabold ${overdue > 0 ? "text-red-300" : ""}`}>
                                {completionRate}%
                            </div>
                            <div className="text-[9px] uppercase tracking-wider text-purple-300 mt-0.5">Rate</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assignment Forms */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AdminAssignInstituteForm salesManagerId={id} />
                <AdminAssignCategoryForm salesManagerId={id} categories={allCategories} />
            </div>

            {/* Category Assignments */}
            {categoryAssignments.length > 0 && (
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <FolderTree className="w-5 h-5 text-teal-600" /> Assigned Categories
                        </h3>
                        <span className="text-xs text-slate-500 font-medium">{categoryAssignments.length} categories</span>
                    </div>
                    <div className="p-4">
                        <div className="flex flex-wrap gap-2">
                            {categoryAssignments.map((ca: any) => (
                                <div
                                    key={ca.id}
                                    className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-xl px-3 py-2"
                                >
                                    <span className="text-sm font-medium text-teal-800">{ca.category.name}</span>
                                    {ca.deadline && (
                                        <span className="text-[10px] text-teal-600 flex items-center gap-0.5">
                                            <CalendarDays className="w-2.5 h-2.5" />
                                            {format(new Date(ca.deadline), "MMM dd")}
                                        </span>
                                    )}
                                    <RemoveAssignmentButton assignmentId={ca.id} type="category" label={ca.category.name} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Institute Assignments Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-4 bg-slate-50 border-b flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-purple-600" /> Assigned Institutes
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">{assignments.length} institutes</span>
                </div>

                {assignments.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">
                        No institutes assigned yet. Use the form above to assign institutes.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b text-xs">
                                <tr>
                                    <th className="p-3">Institute</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Deadline</th>
                                    <th className="p-3">Remark</th>
                                    <th className="p-3 text-right">Remove</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {assignments.map((a: any) => {
                                    const isOverdue = a.deadline && new Date(a.deadline) < now && a.contactStatus !== "ONBOARDED";
                                    return (
                                        <tr key={a.id} className={`hover:bg-slate-50/50 transition-colors ${isOverdue ? "bg-red-50/30" : ""}`}>
                                            <td className="p-3">
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm">{a.institute.name}</div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                                                        <span>{a.institute.city?.name}</span>
                                                        {a.institute.categories?.[0] && (
                                                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                                                                {a.institute.categories[0].category.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <SalesStatusBadge status={a.contactStatus} />
                                                {a.onboardedPlan && (
                                                    <span className="block mt-1 text-[10px] text-emerald-600 font-bold">
                                                        Plan: {a.onboardedPlan}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                {a.deadline ? (
                                                    <span className={`text-xs flex items-center gap-1 ${isOverdue ? "text-red-600 font-bold" : "text-slate-500"}`}>
                                                        <CalendarDays className="w-3 h-3" />
                                                        {format(new Date(a.deadline), "MMM dd, yyyy")}
                                                        {isOverdue && <AlertTriangle className="w-3 h-3 text-red-500" />}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-400">No deadline</span>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <span className="text-xs text-slate-500 line-clamp-2 max-w-[200px]">
                                                    {a.remark || "—"}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right">
                                                <RemoveAssignmentButton assignmentId={a.id} type="institute" label={a.institute.name} />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
