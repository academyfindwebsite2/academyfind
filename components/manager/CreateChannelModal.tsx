"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { createCustomChannel } from "@/app/(public)/manager/[instituteId]/chat/actions";

export function CreateChannelModal({ instituteId }: { instituteId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) return;

        setIsLoading(true);
        const res = await createCustomChannel(instituteId, title, isReadOnly);
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Channel created!");
            setIsOpen(false);
            setTitle("");
            setIsReadOnly(false);
        }
        setIsLoading(false);
    }

    if (!isOpen) {
        return (
            <Button onClick={() => setIsOpen(true)} className="bg-amber-600 text-white hover:bg-amber-700 h-9 gap-1.5 rounded-lg px-3">
                <Plus className="h-4 w-4" />
                <span className="text-sm font-semibold">Create Channel</span>
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Create Channel</h2>
                    <button onClick={() => setIsOpen(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Channel Name</label>
                        <Input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Announcements"
                            required
                        />
                    </div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={isReadOnly}
                            onChange={(e) => setIsReadOnly(e.target.checked)}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-600"
                        />
                        Read-only (Only Managers/Staff can post)
                    </label>
                    <div className="pt-2">
                        <Button type="submit" disabled={isLoading} className="w-full bg-amber-600 text-white hover:bg-amber-700 rounded-xl font-bold">
                            {isLoading ? "Creating..." : "Create Channel"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
