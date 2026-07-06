"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export function InviteActions({ notificationId, membershipId }: { notificationId: string, membershipId: string }) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"IDLE" | "ACCEPTED" | "REJECTED">("IDLE");

    const handleRespond = async (accept: boolean) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/v2/memberships/respond`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationId, membershipId, accept })
            });
            if (res.ok) {
                toast.success(accept ? "Invitation accepted! +25 Coins" : "Invitation declined");
                setStatus(accept ? "ACCEPTED" : "REJECTED");
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to process invitation");
            }
        } catch (error) {
            toast.error("Failed to process invitation");
        } finally {
            setLoading(false);
        }
    };

    if (status === "ACCEPTED") {
        return <p className="text-sm font-bold text-emerald-600 flex items-center gap-1 mt-2"><Check className="w-4 h-4"/> Accepted</p>;
    }
    if (status === "REJECTED") {
        return <p className="text-sm font-bold text-rose-600 flex items-center gap-1 mt-2"><X className="w-4 h-4"/> Declined</p>;
    }

    return (
        <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={() => handleRespond(true)} disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-8">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1"/>} Accept
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleRespond(false)} disabled={loading} className="text-rose-600 hover:bg-rose-50 border-rose-200 hover:text-rose-700 font-bold h-8">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <X className="w-4 h-4 mr-1"/>} Decline
            </Button>
        </div>
    );
}
