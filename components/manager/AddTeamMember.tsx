// components/Team/AddMemberDialog.tsx
"use client";

import { useState } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { addTeamMember } from "@/lib/User/manager/manager-add-team";

export default function AddMemberDialog({ 
    instituteId, 
    canAdd, 
    currentCount, 
    maxLimit, 
    plan 
}: { 
    instituteId: string, 
    canAdd: boolean, 
    currentCount: number, 
    maxLimit: number,
    plan: string 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        const res = await addTeamMember(instituteId, email);

        if (res.error) {
            setMessage({ text: res.error, type: "error" });
        } else {
            setMessage({ text: "Member added successfully!", type: "success" });
            setEmail("");
            setTimeout(() => setIsOpen(false), 2000); // 2 sec baad modal close
        }
        setLoading(false);
    };

    return (
        <>
            <div className="flex flex-col items-end">
                <button 
                    onClick={() => setIsOpen(true)}
                    disabled={!canAdd}
                    className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                        canAdd 
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                >
                    <UserPlus className="w-4 h-4" /> 
                    {canAdd ? "Add Member" : "Limit Reached"}
                </button>
                <span className="text-xs text-slate-400 mt-1 font-medium">
                    {currentCount} / {maxLimit} Added ({plan} Plan)
                </span>
            </div>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Add Team Member</h3>
                        <p className="text-sm text-slate-500 mb-4">Enter the email address of the person you want to add. They must have an account on AcademyFind.</p>
                        
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    placeholder="manager@example.com"
                                />
                            </div>

                            {message.text && (
                                <p className={`text-sm font-medium ${message.type === 'error' ? 'text-red-500' : 'text-emerald-600'}`}>
                                    {message.text}
                                </p>
                            )}

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-xl">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 min-w-[100px] justify-center">
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Member"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}