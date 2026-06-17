"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { markNotificationAsRead } from "@/lib/User/admin/adminNotification";

export default function MarkAsReadButton({ notificationId }: { notificationId: string }) {
    const [isPending, startTransition] = useTransition();

    const handleMarkAsRead = () => {
        startTransition(() => {
            markNotificationAsRead(notificationId);
        });
    };

    return (
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleMarkAsRead}
            disabled={isPending}
            className="text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl font-bold"
        >
            {isPending ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-1.5" />}
            Read
        </Button>
    );
}