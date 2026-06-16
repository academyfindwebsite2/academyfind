"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Search, ArrowUpDown, X } from "lucide-react";

export default function SalesManagerFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");

    const updateParams = useCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.delete("page");
        router.push(`?${params.toString()}`);
    }, [router, searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateParams("search", search);
    };

    const clearFilters = () => {
        setSearch("");
        router.push("?");
    };

    const hasFilters = searchParams.get("search") || searchParams.get("sort");

    return (
        <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by manager name, email or institute..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all"
                    />
                </form>

                {/* Sort */}
                <div className="relative">
                    <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select
                        value={searchParams.get("sort") || ""}
                        onChange={(e) => updateParams("sort", e.target.value)}
                        className="pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all appearance-none cursor-pointer min-w-[180px]"
                    >
                        <option value="">Sort: Default</option>
                        <option value="name_asc">Name: A → Z</option>
                        <option value="name_desc">Name: Z → A</option>
                        <option value="work_desc">Most Assignments</option>
                        <option value="work_asc">Least Assignments</option>
                        <option value="completion_desc">Best Completion</option>
                        <option value="completion_asc">Worst Completion</option>
                        <option value="overdue_desc">Most Overdue</option>
                    </select>
                </div>

                {/* Clear */}
                {hasFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-all shrink-0"
                    >
                        <X className="w-3.5 h-3.5" /> Clear
                    </button>
                )}
            </div>
        </div>
    );
}
