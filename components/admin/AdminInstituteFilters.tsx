"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

export default function InstituteFilters({ cities, categories }: { cities: any[], categories: any[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Current Values from URL
    const currentSearch = searchParams.get("search") || "";
    const currentCity = searchParams.get("cityId") || "";
    const currentCategory = searchParams.get("categoryId") || "";
    const currentStatus = searchParams.get("status") || "all";
    const currentSubscriptionPlan = searchParams.get("subscriptionPlan") || "";
    const currentSortBy = searchParams.get("sortBy") || "newest";

    // URL Update Logic
    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        // Agar value empty ya default (all/newest) hai, toh URL clean rakhne ke liye param delete kardo
        if (value && value !== "all" && value !== "newest") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        
        params.set("page", "1"); // Naya filter lagte hi hamesha Page 1 par bhej do
        router.push(`/af-ass-manage/institutes?${params.toString()}`);
    }

    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row flex-wrap gap-4 mb-6">
            
            {/* Search Input (Takes remaining space) */}
            <div className="flex-1 min-w-[200px] relative">
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

            {/* 🔥 Sort Dropdown */}
            <div className="w-full md:w-40">
                <select 
                    value={currentSortBy}
                    onChange={(e) => updateFilter("sortBy", e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
                >
                    <option value="newest">Latest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="views"> Most Viewed</option>
                </select>
            </div>

            {/* 🔥 Status & Visibility Filter */}
            <div className="w-full md:w-40">
                <select 
                    value={currentStatus}
                    onChange={(e) => updateFilter("status", e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
                >
                    <option value="all">All Statuses</option>
                    <option value="active">🟢 Active Only</option>
                    <option value="inactive">🔴 Inactive Only</option>
                    <option value="published">👁️ Published Only</option>
                    <option value="hidden">🙈 Hidden Only</option>
                </select>
            </div>

            {/* 🔥 Subscription Plan Filter */}
            <div className="w-full md:w-60">
                <select 
                    value={currentSubscriptionPlan}
                    onChange={(e) => updateFilter("subscriptionPlan", e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
                >
                    <option value="">All Subscription Plans</option>
                    <option value="BASIC">Basic</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="PREMIUM">Premium</option>
                    <option value="ULTRA">Ultra</option>
                </select>
            </div>


            {/* City Filter */}
            <div className="w-full md:w-40">
                <select 
                    value={currentCity}
                    onChange={(e) => updateFilter("cityId", e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
                >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                </select>
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-40">
                <select 
                    value={currentCategory}
                    onChange={(e) => updateFilter("categoryId", e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
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