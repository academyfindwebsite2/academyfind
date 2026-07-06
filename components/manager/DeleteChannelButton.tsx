"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { deleteCustomChannel } from "@/app/(public)/manager/[instituteId]/chat/actions";

export function DeleteChannelButton({ channelId }: { channelId: string }) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this channel? All messages will be permanently lost.")) return;
        
        setIsLoading(true);
        const res = await deleteCustomChannel(channelId);
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Channel deleted");
        }
        setIsLoading(false);
    }

    return (
        <button 
            onClick={handleDelete} 
            disabled={isLoading}
            className="rounded p-1 text-slate-400 hover:bg-rose-100 hover:text-rose-600 disabled:opacity-50 transition-colors"
            title="Delete custom channel"
        >
            <Trash2 className="h-4 w-4" />
        </button>
    );
}
