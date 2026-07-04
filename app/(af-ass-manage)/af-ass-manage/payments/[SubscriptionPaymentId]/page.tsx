import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, CheckCircle2, Clock, XCircle, ExternalLink, Image as ImageIcon } from "lucide-react";
import ActionButtons from "@/components/admin/ActionButton"; // Hum ye abhi banayenge

export default async function PaymentDetailPage({ params }: { params: Promise<{ SubscriptionPaymentId: string }> }) {
    const { SubscriptionPaymentId } = await params;

    const payment = await prisma.subscriptionPayment.findUnique({
        where: { id: SubscriptionPaymentId },
        include: { institute: true }
    });

    if (!payment) notFound();

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans animate-in fade-in duration-300">
            <Link href="/af-ass-manage/payments" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Payments
            </Link>

            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                {/* Header Status */}
                <div className={`p-6 border-b flex justify-between items-center ${
                    payment.status === "PENDING" ? "bg-amber-50 border-amber-100" :
                    payment.status === "APPROVED" ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"
                }`}>
                    <div className="flex items-center gap-3">
                        {payment.status === "PENDING" && <Clock className="w-8 h-8 text-amber-500" />}
                        {payment.status === "APPROVED" && <CheckCircle2 className="w-8 h-8 text-emerald-500" />}
                        {payment.status === "REJECTED" && <XCircle className="w-8 h-8 text-red-500" />}
                        
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Status: {payment.status}</h2>
                            <p className="text-sm text-slate-600">Submitted on {format(new Date(payment.createdAt), "PPP 'at' p")}</p>
                        </div>
                    </div>
                    
                    {/* Action Buttons Component */}
                    {payment.status === "PENDING" && (
                        <ActionButtons paymentId={payment.id} />
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 p-8 gap-12">
                    {/* Left: Transaction Details */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Academy Details</p>
                            <p className="text-lg font-black text-slate-900">{payment.institute.name}</p>
                            <Link href={`/institute/${payment.institute.id}-${payment.institute.slug}`} target="_blank" className="text-blue-600 text-sm font-medium hover:underline inline-flex items-center mt-1">
                                View Profile <ExternalLink className="w-3 h-3 ml-1" />
                            </Link>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Requested Upgrade</p>
                            <p className="text-lg font-bold text-blue-700 bg-blue-50 inline-block px-3 py-1 rounded-lg">
                                {payment.planRequested} <span className="text-sm font-medium text-slate-600">({payment.billingCycle})</span>
                            </p>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-4">
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Amount Paid</p>
                                <p className="text-3xl font-black text-slate-900">₹{payment.amountPaid.toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">UTR / Transaction ID</p>
                                <p className="text-xl font-mono font-bold text-blue-600 tracking-wider bg-white border px-3 py-1.5 rounded-lg inline-block mt-1 select-all">
                                    {payment.utrNumber}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Payment Proof Image */}
                    <div>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-3">User Uploaded Proof</p>
                        {payment.proofImageUrl ? (
                            <a href={payment.proofImageUrl} target="_blank" rel="noreferrer" className="block border-2 border-slate-200 rounded-3xl overflow-hidden hover:border-blue-400 transition-colors shadow-sm relative group">
                                <img src={payment.proofImageUrl} alt="Proof" className="w-full object-contain max-h-100" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white font-bold inline-flex items-center bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                                        <ExternalLink className="w-4 h-4 mr-2" /> Click to enlarge
                                    </span>
                                </div>
                            </a>
                        ) : (
                            <div className="border-2 border-dashed border-slate-200 rounded-3xl h-64 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                                <ImageIcon className="w-12 h-12 mb-3 text-slate-300" />
                                <p className="font-semibold">No Image Uploaded</p>
                                <p className="text-xs">Please verify via UTR matching only.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}