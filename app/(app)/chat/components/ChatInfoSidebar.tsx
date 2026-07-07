"use client";

import { useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { Info, X, Users, BadgeCheck } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function ChatInfoSidebar({ conversationId, meta, children }: { conversationId: string, meta: any, children?: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    const { data, isLoading } = useSWR<{ participants: { role: string }[] }>(
        open ? `/api/v2/conversations/${conversationId}/participants` : null,
        fetcher
    );

    const participants = data?.participants || [];
    
    // Group participants by role if it's an institute channel
    const admins = participants.filter((p: { role: string }) => p.role === "ADMIN");
    const members = participants.filter((p: { role: string }) => p.role === "MEMBER");

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {children ? children : (
                    <Button variant="ghost" size="icon" className="shrink-0 text-slate-400 hover:text-slate-600 rounded-full h-8 w-8">
                        <Info className="w-5 h-5" />
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm bg-slate-50 flex flex-col p-0">
                <div className="p-6 pb-4 border-b bg-white">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold flex items-center gap-2">
                            <Info className="w-5 h-5 text-amber-500" /> Channel Info
                        </SheetTitle>
                    </SheetHeader>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* General Info */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-200">
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                                {meta?.institute?.logo ? (
                                    <Image src={meta.institute.logo} alt="" fill className="object-cover" />
                                ) : (
                                    <span className="flex h-full items-center justify-center text-2xl font-bold text-slate-400">
                                        {(meta?.institute?.name ?? meta?.title ?? "?").charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">{meta?.title || meta?.institute?.name || "Group Chat"}</h3>
                                <p className="text-sm text-slate-500">{meta?.memberCount || participants.length} members</p>
                            </div>
                        </div>
                    </div>

                    {/* Members List */}
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-500" /> Members
                        </h4>
                        
                        {isLoading ? (
                            <div className="text-center p-4 text-slate-400 text-sm">Loading members...</div>
                        ) : (
                            <div className="space-y-4">
                                {admins.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Admins / Teachers</p>
                                        <div className="space-y-2">
                                            {admins.map((p: any) => (
                                                <MemberRow key={p.id} participant={p} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {members.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Students</p>
                                        <div className="space-y-2">
                                            {members.map((p: any) => (
                                                <MemberRow key={p.id} participant={p} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

function MemberRow({ participant }: { participant: { role: string; user: any } }) {
    const u = participant.user;
    if (!u) return null;
    return (
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                {u.image ? (
                    <Image src={u.image} alt={u.name} width={32} height={32} className="w-full h-full object-cover" />
                ) : (
                    <span className="flex h-full items-center justify-center text-xs font-bold text-slate-400">{u.name?.charAt(0) || "?"}</span>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                    <p className="font-semibold text-sm text-slate-900 truncate">{u.name}</p>
                    {participant.role === "ADMIN" && <BadgeCheck className="w-3 h-3 text-amber-500" />}
                </div>
                <p className="text-xs text-slate-500 truncate">@{u.username}</p>
            </div>
            <Link href={`/u/${u.username}`} className="text-xs text-blue-600 font-medium hover:underline shrink-0">
                Profile
            </Link>
        </div>
    )
}
