import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { formatIST } from "@/lib/utils";
import { Clock, CheckCircle2, XCircle, Eye, IndianRupee, Filter } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminPaymentListPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const params = await searchParams;
    const currentFilter = params.status || 'PENDING';

    // Build filter condition
    const whereCondition: any = {};
    if (currentFilter !== 'ALL') {
        whereCondition.status = currentFilter;
    }

    const payments = await prisma.subscriptionPayment.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
        include: { institute: { select: { name: true } } }
    });

    // 🚀 We still might want to know total pending overall for the alert text
    const totalPendingCount = await prisma.subscriptionPayment.count({
        where: { status: "PENDING" }
    });

    const filterOptions = [
        { label: "All", value: "ALL" },
        { label: "Pending", value: "PENDING" },
        { label: "Approved", value: "APPROVED" },
        { label: "Rejected", value: "REJECTED" },
    ];

    return (
        <div className="w-full space-y-6 pb-12 p-8 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                        <IndianRupee className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Payment Approvals
                        </h1>
                        <p className="text-slate-500 mt-1 text-sm">
                            You have <span className="font-bold text-stone-600">{totalPendingCount} pending</span> verification requests in total.
                        </p>
                    </div>
                </div>
            </div>

            {/* 🚀 Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <div className="text-sm font-bold text-slate-400 flex items-center gap-1.5 mr-2">
                    <Filter className="w-4 h-4" /> Filter:
                </div>
                {filterOptions.map((opt: any) => (
                    <Link 
                        key={opt.value}
                        href={`/af-ass-manage/payments?status=${opt.value}`}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                            currentFilter === opt.value 
                            ? "bg-stone-900 text-white shadow-md shadow-stone-900/20 scale-105" 
                            : "bg-white border border-stone-100 text-slate-500 hover:bg-stone-50 hover:text-stone-700 hover:border-stone-200"
                        }`}
                    >
                        {opt.label}
                    </Link>
                ))}
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-stone-100/60 rounded-[2rem] shadow-sm overflow-hidden mt-4">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="p-4 w-12 text-center">Status</th>
                                <th className="p-4">Academy</th>
                                <th className="p-4">Requested Plan</th>
                                <th className="p-4">Amount & UTR</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100/50">
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-slate-400 font-medium">
                                        No payment requests found for "{currentFilter}".
                                    </td>
                                </tr>
                            ) : (
                                payments.map((payment: any) => (
                                    <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 text-center">
                                            {payment.status === "PENDING" && <Clock className="w-5 h-5 text-stone-500 mx-auto" />}
                                            {payment.status === "APPROVED" && <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />}
                                            {payment.status === "REJECTED" && <XCircle className="w-5 h-5 text-red-500 mx-auto" />}
                                        </td>
                                        
                                        <td className="p-4 font-bold text-slate-800">
                                            {payment.institute.name}
                                            <div className="text-xs text-slate-400 font-medium mt-0.5">
                                                {formatIST(payment.createdAt, "MMM dd, yyyy - hh:mm a")}
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                                                {payment.planRequested}
                                            </span>
                                            <span className="ml-2 text-xs text-slate-500 font-medium tracking-wide">
                                                ({payment.billingCycle})
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            <div className="font-bold text-slate-800">₹{payment.amountPaid.toLocaleString('en-IN')}</div>
                                            <div className="font-mono text-[10px] text-slate-500 mt-0.5 tracking-wider bg-slate-100 px-1.5 py-0.5 rounded w-fit border border-slate-200">
                                                UTR: {payment.utrNumber}
                                            </div>
                                        </td>

                                        <td className="p-4 text-right">
                                            <Link 
                                                href={`/af-ass-manage/payments/${payment.id}`}
                                                className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all shadow-xs"
                                            >
                                                Review <Eye className="w-3.5 h-3.5 ml-1.5" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}