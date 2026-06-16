"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

export default function InstituteFilters({ cities, categories }: { cities: any[], categories: any[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentSearch = searchParams.get("search") || "";
    const currentCity = searchParams.get("cityId") || "";
    const currentCategory = searchParams.get("categoryId") || "";

    // URL Update Logic
    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        
        params.set("page", "1"); // Naya filter lagte hi hamesha Page 1 par bhej do
        router.push(`/admin/institutes?${params.toString()}`);
    }

    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Input */}
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text"
                    placeholder="Search academy name..."
                    defaultValue={currentSearch}
                    onBlur={(e) => updateFilter("search", e.target.value)} // Type karke bahar click karne pe search hoga
                    onKeyDown={(e) => e.key === 'Enter' && updateFilter("search", e.currentTarget.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
            </div>

            {/* City Filter */}
            <div className="w-full md:w-48">
                <select 
                    value={currentCity}
                    onChange={(e) => updateFilter("cityId", e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                </select>
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-48">
                <select 
                    value={currentCategory}
                    onChange={(e) => updateFilter("categoryId", e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}