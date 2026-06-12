"use client";

import { useState } from "react";
import { approvePayment, rejectPayment } from "@/lib/User/admin/adminPaymentApprove";
import toast from "react-hot-toast";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export default function ActionButtons({ paymentId }: { paymentId: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleApprove = async () => {
        if (!confirm("Are you sure you have received the payment and want to ACTIVATE the plan?")) return;
        setIsLoading(true);
        const res = await approvePayment(paymentId);
        if (res.success) toast.success(res.message || "Payment approved sucessfully");
        else toast.error(res.error || "payment can't be approved");
        setIsLoading(false);
    };

    const handleReject = async () => {
        if (!confirm("Are you sure you want to REJECT this transaction?")) return;
        setIsLoading(true);
        const res = await rejectPayment(paymentId);
        if (res.success) toast.success(res.message || "payment rejected");
        else toast.error(res.error || "payment can't be rejected");
        setIsLoading(false);
    };

    return (
        <div className="flex gap-3">
            <button 
                onClick={handleReject} 
                disabled={isLoading}
                className="px-4 py-2 bg-white text-red-600 font-bold rounded-xl border border-red-200 hover:bg-red-50 transition flex items-center disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><XCircle className="w-4 h-4 mr-1.5" /> Reject</>}
            </button>

            <button 
                onClick={handleApprove} 
                disabled={isLoading}
                className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md transition flex items-center disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4 mr-1.5" /> Approve & Activate</>}
            </button>
        </div>
    );
}