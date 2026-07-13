import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { formatIST } from "@/lib/utils";
import { ArrowLeft, CheckCircle2, Clock, XCircle, ExternalLink, Image as ImageIcon } from "lucide-react";
import ActionButtons from "@/components/admin/ActionButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function PaymentDetailPage({ params }: { params: Promise<{ SubscriptionPaymentId: string }> }) {
    const { SubscriptionPaymentId } = await params;

    const payment = await prisma.subscriptionPayment.findUnique({
        where: { id: SubscriptionPaymentId },
        include: { institute: true }
    });

    if (!payment) notFound();

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans w-full p-4 md:p-8">
            <Link href="/af-ass-manage/payments" className="inline-flex items-center text-sm font-semibold text-stone-500 hover:text-stone-800 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Payments
            </Link>

            <Card className="border-stone-200 shadow-sm overflow-hidden bg-white">
                {/* Header Status */}
                <CardHeader className={`p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                    payment.status === "PENDING" ? "bg-stone-50 border-stone-100" :
                    payment.status === "APPROVED" ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100"
                }`}>
                    <div className="flex items-center gap-3">
                        {payment.status === "PENDING" && <Clock className="w-8 h-8 text-stone-500" />}
                        {payment.status === "APPROVED" && <CheckCircle2 className="w-8 h-8 text-emerald-600" />}
                        {payment.status === "REJECTED" && <XCircle className="w-8 h-8 text-rose-600" />}
                        
                        <div>
                            <CardTitle className={`text-xl font-bold ${
                                payment.status === "PENDING" ? "text-stone-800" :
                                payment.status === "APPROVED" ? "text-emerald-800" : "text-rose-800"
                            }`}>Status: {payment.status}</CardTitle>
                            <p className="text-sm text-stone-600 font-medium mt-1">Submitted on {formatIST(payment.createdAt, "PPP 'at' p")}</p>
                        </div>
                    </div>
                    
                    {/* Action Buttons Component */}
                    {payment.status === "PENDING" && (
                        <ActionButtons paymentId={payment.id} />
                    )}
                </CardHeader>
                <Separator className="bg-stone-100" />

                <CardContent className="grid grid-cols-1 md:grid-cols-2 p-6 md:p-8 gap-8">
                    {/* Left: Transaction Details */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-2">Academy Details</p>
                            <p className="text-lg font-black text-stone-800">{payment.institute.name}</p>
                            <Link href={`/institute/${payment.institute.id}-${payment.institute.slug}`} target="_blank" className="text-stone-600 text-sm font-bold hover:text-stone-900 transition-colors inline-flex items-center mt-1 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
                                View Profile <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                            </Link>
                        </div>
                        <Separator className="bg-stone-100" />

                        <div>
                            <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-2">Requested Upgrade</p>
                            <p className="text-lg font-bold text-stone-700 bg-stone-100 inline-block px-3 py-1.5 rounded-lg border border-stone-200 shadow-sm">
                                {payment.planRequested} <span className="text-sm font-medium text-stone-500 ml-1">({payment.billingCycle})</span>
                            </p>
                        </div>

                        <div className="bg-stone-50 border border-stone-100 p-5 rounded-2xl space-y-4 shadow-sm">
                            <div>
                                <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">Amount Paid</p>
                                <p className="text-3xl font-black text-stone-800 mt-1">₹{payment.amountPaid.toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                                <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">UTR / Transaction ID</p>
                                <p className="text-lg font-mono font-bold text-stone-700 tracking-wider bg-white border border-stone-200 shadow-sm px-3 py-1.5 rounded-lg inline-block mt-2 select-all">
                                    {payment.utrNumber}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Payment Proof Image */}
                    <div>
                        <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-3">User Uploaded Proof</p>
                        {payment.proofImageUrl ? (
                            <a href={payment.proofImageUrl} target="_blank" rel="noreferrer" className="block border-2 border-stone-200 rounded-3xl overflow-hidden hover:border-stone-400 transition-colors shadow-sm relative group bg-stone-50">
                                <img src={payment.proofImageUrl} alt="Proof" className="w-full object-contain max-h-[400px]" />
                                <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                    <span className="text-white font-bold inline-flex items-center bg-stone-900/80 px-4 py-2 rounded-full shadow-lg">
                                        <ExternalLink className="w-4 h-4 mr-2" /> Click to enlarge
                                    </span>
                                </div>
                            </a>
                        ) : (
                            <div className="border-2 border-dashed border-stone-200 rounded-3xl h-64 flex flex-col items-center justify-center bg-stone-50 text-stone-400">
                                <ImageIcon className="w-12 h-12 mb-3 text-stone-300" />
                                <p className="font-bold text-sm">No Image Uploaded</p>
                                <p className="text-xs mt-1">Please verify via UTR matching only.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}