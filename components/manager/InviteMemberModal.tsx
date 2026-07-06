"use client";

import { useState } from "react";
import { Search, UserPlus, X, Check, Loader2, User, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import toast from "react-hot-toast";

export function InviteMemberModal({ instituteId }: { instituteId: string }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [invitingId, setInvitingId] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!search.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/v2/users/search?q=${encodeURIComponent(search)}&instituteId=${instituteId}`);
            if (res.ok) {
                const data = await res.json();
                setResults(data.users || []);
            }
        } catch (error) {
            toast.error("Failed to search users");
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (userId: string) => {
        setInvitingId(userId);
        try {
            const res = await fetch(`/api/v2/memberships/invite`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, instituteId, role: "STUDENT" }) // default role
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Invitation sent!");
                setResults(results.map(r => r.id === userId ? { ...r, isInvited: true } : r));
            } else {
                toast.error(data.error || "Failed to invite user");
            }
        } catch (error) {
            toast.error("Failed to invite user");
        } finally {
            setInvitingId(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white gap-2 font-bold rounded-xl">
                    <UserPlus className="w-4 h-4" /> Invite Member
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-800">Invite a Member</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSearch} className="flex gap-2 mt-2">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, username or email..."
                            className="pl-9 bg-slate-50 border-slate-200"
                        />
                    </div>
                    <Button type="submit" disabled={loading} className="bg-slate-900 text-white hover:bg-slate-800">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
                    </Button>
                </form>

                <div className="mt-4 max-h-[300px] overflow-y-auto space-y-3">
                    {results.length > 0 ? results.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-slate-50">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-full border border-slate-200 bg-white overflow-hidden shrink-0 flex items-center justify-center">
                                    {user.image ? (
                                        <Image src={user.image} alt={user.name || "User"} width={40} height={40} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-5 h-5 text-slate-400" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-slate-900 text-sm truncate">{user.name || user.username || "Unknown User"}</h4>
                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                </div>
                            </div>
                            {user.isMember ? (
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Member
                                </span>
                            ) : user.isInvited ? (
                                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Invited
                                </span>
                            ) : (
                                <Button 
                                    size="sm" 
                                    className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl"
                                    onClick={() => handleInvite(user.id)}
                                    disabled={invitingId === user.id}
                                >
                                    {invitingId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Invite"}
                                </Button>
                            )}
                        </div>
                    )) : search && !loading ? (
                        <div className="text-center p-6 text-slate-500 text-sm">
                            No users found matching "{search}".<br/>
                            Make sure they have created an account on AcademyFind first.
                        </div>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}
