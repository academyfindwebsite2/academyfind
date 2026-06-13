"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderTree, Calendar, Plus, Loader2 } from "lucide-react";

interface AdminAssignCategoryFormProps {
    salesManagerId: string;
    categories: { id: string; name: string }[];
}

export default function AdminAssignCategoryForm({
    salesManagerId,
    categories,
}: AdminAssignCategoryFormProps) {
    const router = useRouter();
    const [categoryId, setCategoryId] = useState("");
    const [deadline, setDeadline] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryId) {
            setMessage("❌ Please select a category");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/sales/assign-category", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    salesManagerId,
                    categoryId,
                    deadline: deadline || undefined,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("✅ Category assigned successfully!");
                setCategoryId("");
                setDeadline("");
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
                <FolderTree className="w-4 h-4 text-teal-600" />
                Assign Category
            </h3>

            {/* Category Select */}
            <div>
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 outline-none transition-all"
                >
                    <option value="">Select a category...</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
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
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 outline-none transition-all"
                />
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-sm font-bold rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {loading ? "Assigning..." : "Assign Category"}
                </button>
                {message && <span className="text-sm font-medium">{message}</span>}
            </div>
        </form>
    );
}
