"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Calendar, Plus, Loader2, Search } from "lucide-react";
import { searchInstitutesAction } from "@/lib/User/admin/institutesearch";

interface AdminAssignInstituteFormProps {
    salesManagerId: string;
    //institutes: { id: string; name: string; city: { name: string } }[];
}

export default function AdminAssignInstituteForm({
    salesManagerId,
    //institutes,
}: AdminAssignInstituteFormProps) {
    const router = useRouter();
    const [instituteId, setInstituteId] = useState("");
    const [deadline, setDeadline] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedInstitute, setSelectedInstitute] = useState<{id: string, name: string} | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const searchInstitutes = async () => {
            if (searchTerm.length < 2) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const results = await searchInstitutesAction(searchTerm);
                setSearchResults(results);
            } catch (error) {
                console.error("Error fetching institutes:", error);
            } finally {
                setIsSearching(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            searchInstitutes();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // const filteredInstitutes = institutes.filter(
    //     (inst) =>
    //         inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         inst.city.name.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInstitute || !selectedInstitute.id) {
            setMessage("❌ Please select an institute from search");
            return;
        }
        console.log("Submitting with Institute ID:", selectedInstitute?.id);

        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/sales/assign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    salesManagerId,
                    instituteId: selectedInstitute.id,
                    deadline: deadline || undefined,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("✅ Institute assigned successfully!");
                setSelectedInstitute(null);
                setDeadline("");
                setSearchTerm("");
                router.refresh();
            } else {
                setMessage(`❌ ${data.error || "Failed to assign"}`);
            }
        } catch {
            setMessage("❌ Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                Assign Institute
            </h3>

            {/* Search within institute dropdown */}
            {/* <div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search institutes by name or city..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all mb-2"
                />
                <select
                    value={instituteId}
                    onChange={(e) => setInstituteId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all"
                    size={Math.min(filteredInstitutes.length + 1, 6)}
                >
                    <option value="">Select an institute...</option>
                    {filteredInstitutes.map((inst) => (
                        <option key={inst.id} value={inst.id}>
                            {inst.name} — {inst.city.name}
                        </option>
                    ))}
                </select>
            </div> */}
            <div className="relative">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                        type="text"
                        value={selectedInstitute ? selectedInstitute.name : searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setSelectedInstitute(null); 
                        }}
                        placeholder="Type to search institutes (e.g., Aakash)..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all"
                    />
                    {isSearching && <Loader2 className="w-4 h-4 absolute right-3 top-3 animate-spin text-purple-500" />}
                </div>

                {searchResults.length > 0 && !selectedInstitute && (
                    <ul className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.map((inst) => (
                            <li
                                key={inst.id}
                                onClick={() => {
                                    setSelectedInstitute({ id: inst.id, name: inst.name });
                                    setSearchResults([]);
                                    setSearchTerm("");
                                }}
                                className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-sm text-slate-700 border-b border-slate-50 last:border-0"
                            >
                                <div className="font-semibold">{inst.name}</div>
                                {inst.city && <div className="text-xs text-slate-400">{inst.city}</div>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Deadline */}
            <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Deadline (optional)
                </label>
                <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all"
                />
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {loading ? "Assigning..." : "Assign Institute"}
                </button>
                {message && <span className="text-sm font-medium">{message}</span>}
            </div>
        </form>
    );
}
