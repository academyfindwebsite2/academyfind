import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { Clock, CheckCircle2, XCircle, Eye, IndianRupee } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminPaymentListPage() {
    const payments = await prisma.subscriptionPayment.findMany({
        orderBy: { createdAt: 'desc' },
        include: { institute: { select: { name: true } } }
    });

    const pendingCount = payments.filter((p: any) => p.status === "PENDING").length;

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                        <IndianRupee className="w-8 h-8 text-emerald-600" /> Payment Approvals
                    </h1>
                    <p className="text-slate-500 mt-1">
                        You have <span className="font-bold text-amber-600">{pendingCount} pending</span> verification requests.
                    </p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="p-4 w-12 text-center">Status</th>
                                <th className="p-4">Academy</th>
                                <th className="p-4">Requested Plan</th>
                                <th className="p-4">Amount & UTR</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {payments.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-400">No payment requests found.</td></tr>
                            ) : (
                                payments.map((payment: any) => (
                                    <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 text-center">
                                            {payment.status === "PENDING" && <Clock className="w-5 h-5 text-amber-500 mx-auto" />}
                                            {payment.status === "APPROVED" && <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />}
                                            {payment.status === "REJECTED" && <XCircle className="w-5 h-5 text-red-500 mx-auto" />}
                                        </td>
                                        
                                        <td className="p-4 font-bold text-slate-800">
                                            {payment.institute.name}
                                            <div className="text-xs text-slate-400 font-medium mt-0.5">
                                                {format(new Date(payment.createdAt), "MMM dd, yyyy - hh:mm a")}
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                                                {payment.planRequested}
                                            </span>
                                            <span className="ml-2 text-xs text-slate-500 font-medium">({payment.billingCycle})</span>
                                        </td>

                                        <td className="p-4">
                                            <div className="font-bold text-slate-800">₹{payment.amountPaid.toLocaleString('en-IN')}</div>
                                            <div className="font-mono text-xs text-slate-500 mt-0.5 tracking-wider">UTR: {payment.utrNumber}</div>
                                        </td>

                                        <td className="p-4 text-right">
                                            <Link 
                                                href={`/af-ass-manage/payments/${payment.id}`}
                                                className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all"
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