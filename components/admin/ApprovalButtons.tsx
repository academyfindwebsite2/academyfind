"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { approveInstituteRequest, rejectInstituteRequest } from "@/lib/User/admin/adminApprovalInstitute";
import toast from "react-hot-toast";

export default function ApprovalButtons({ requestId }: { requestId: string }) {
    const [isPending, setIsPending] = useState(false);

    const handleAction = async (type: "APPROVE" | "REJECT") => {
        if (!confirm(`Are you sure you want to ${type.toLowerCase()} this submission?`)) return;
        
        setIsPending(true);
        const res = type === "APPROVE" 
            ? await approveInstituteRequest(requestId)
            : await rejectInstituteRequest(requestId);

        if (res.success) {
            toast.success(res.message || "Operation executed!");
        } else {
            toast.error(res.error || "Execution error.");
        }
        setIsPending(false);
    };

    return (
        <div className="flex items-center gap-3">
            <Button 
                disabled={isPending}
                onClick={() => handleAction("REJECT")}
                variant="outline" 
                className="rounded-xl text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 px-4 font-bold text-xs gap-1.5"
            >
                {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />} Reject Request
            </Button>
            
            <Button 
                disabled={isPending}
                onClick={() => handleAction("APPROVE")}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 font-bold text-xs gap-1.5 shadow-sm"
            >
                {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Approve & Launch
            </Button>
        </div>
    );
}