"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Building2, Loader2, Search } from "lucide-react";
import toast from "react-hot-toast";
import { addManagerRelation, removeManagerRelation } from "@/lib/User/admin/adminUserUpdate"; 
import { ConfirmModal } from "@/components/ui/confirm-modal";

export default function ManagerControl({ 
    userId, 
    managedInstitutes, 
    allInstitutes 
}: { 
    userId: string;
    managedInstitutes: any[];
    allInstitutes: any[];
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedInstitute, setSelectedInstitute] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); // 🚀 Search Query State
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [targetInstitute, setTargetInstitute] = useState({ id: "", name: "" });

    // 🚀 Dynamic search filter (Case-insensitive)
    const filteredInstitutes = useMemo(() => {
        if (!searchQuery.trim()) return allInstitutes;
        return allInstitutes.filter(inst => 
            inst.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, allInstitutes]);

    const handleAdd = async () => {
        if (!selectedInstitute) return toast.error("Please select an institute first.");
        setIsLoading(true);
        const res = await addManagerRelation(userId, selectedInstitute);
        if (res.success) {
            toast.success(res.message || "Successfully added to institute");
            setSelectedInstitute(""); 
            setSearchQuery(""); // Form reset par search clear karo
        } else {
            toast.error(res.error || "Can't add");
        }
        setIsLoading(false);
    };

    const executeRemove = async () => {
        setIsLoading(true);
        setIsConfirmOpen(false);
        const res = await removeManagerRelation(userId, targetInstitute.id);
        if (res.success) toast.success(res.message || "Successfully removed access");
        else toast.error(res.error || "Can't remove access");
        setIsLoading(false);
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-stone-200/60 shadow-sm space-y-4 max-w-full overflow-hidden">
            <h3 className="font-bold text-stone-800 flex items-center gap-2 border-b border-stone-100 pb-2">
                <Building2 className="w-5 h-5 text-stone-500" /> Managed Institutes Workspace
            </h3>

            {/* Current Managed List */}
            {managedInstitutes.length > 0 ? (
                <ul className="space-y-2">
                    {managedInstitutes.map((mi) => (
                        <li key={mi.instituteId} className="text-sm p-3 bg-stone-50/50 border border-stone-100 rounded-xl flex items-center justify-between group">
                            <span className="font-semibold text-stone-700 truncate mr-2 min-w-0">{mi.institute.name}</span>
                            <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => {
                                    setTargetInstitute({ id: mi.instituteId, name: mi.institute.name });
                                    setIsConfirmOpen(true);
                                }}
                                disabled={isLoading}
                                className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 h-8 px-2 shrink-0"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-xs text-slate-400 p-2 text-center bg-slate-50 rounded-xl border border-dashed">Not managing any institute currently.</p>
            )}

            {/* 🚀 FIXED: Searchable Assign Form */}
            <div className="pt-4 mt-2 border-t border-stone-100 space-y-3">
                <label className="text-xs font-bold text-stone-400 uppercase">Assign New Institute</label>
                
                <div className="flex flex-col gap-2">
                    {/* Search Input Box */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Type to search institute..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setSelectedInstitute(""); // Search badalte hi purana selection reset karo
                            }}
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-stone-500"
                        />
                    </div>

                    <div className="flex gap-2">
                        {/* Dropdown for FILTERED Institutes */}
                        <select 
                            value={selectedInstitute} 
                            onChange={(e) => setSelectedInstitute(e.target.value)}
                            className="flex-1 border border-stone-200 text-stone-700 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-stone-500 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            <option value="">-- Select --</option>
                            {filteredInstitutes.length > 0 ? (
                                filteredInstitutes.map((inst) => (
                                    <option key={inst.id} value={inst.id}>{inst.name}</option>
                                ))
                            ) : (
                                <option value="" disabled>No institutes found matching "{searchQuery}"</option>
                            )}
                        </select>
                        <Button 
                            onClick={handleAdd} 
                            disabled={isLoading || !selectedInstitute}
                            className="bg-stone-900 text-white rounded-xl hover:bg-stone-800 shadow-md shrink-0"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        </Button>
                    </div>
                    {searchQuery && (
                        <p className="text-[10px] text-stone-400 pl-1">Showing {filteredInstitutes.length} results</p>
                    )}
                </div>
            </div>
            
            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={executeRemove}
                title={`Remove access to ${targetInstitute.name}?`}
                description="This manager will no longer be able to access this institute's dashboard."
                destructive={true}
                confirmText="Remove Access"
            />
        </div>
    );
}