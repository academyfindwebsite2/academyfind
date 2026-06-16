"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layers, MapPin, Star, Sparkles } from "lucide-react";

type FilterProps = {
  categories: { name: string; slug: string }[];
  cities: { name: string; slug: string }[];
  currentType: string;
  currentCity: string;
  currentCategory: string;
  currentRating: string;
};

export default function SearchFilters({ 
  categories, 
  cities, 
  currentType, 
  currentCity, 
  currentCategory, 
  currentRating 
}: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // 🔥 URL parameters manager
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key); 
    }

    if (key === "type" && value !== "institute") {
        params.delete("rating");
    }
    
    params.delete("page"); // Filter badalne par page hamesha 1 par reset
    router.push(`${pathname}?${params.toString()}`);
  };

  // 💅 Premium Shadcn Pill Look Classes
  const triggerClasses = "w-full rounded-xl border-slate-200 bg-slate-50/50 hover:bg-amber-50/30 hover:border-amber-300 focus:ring-2 focus:ring-amber-400 focus:ring-offset-0 focus:outline-none transition-all data-[state=open]:bg-amber-50/50 data-[state=open]:border-amber-400 h-11 text-sm shadow-xs font-medium text-slate-700";

  return (
    <aside className="sticky top-24 hidden h-fit rounded-3xl border bg-background p-6 shadow-sm lg:block border-slate-200">
      <h3 className="font-extrabold text-slate-900 mb-6 text-lg tracking-tight pb-3 border-b border-slate-100 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-500" /> Filters
      </h3>

      <div className="space-y-6">
        
        {/* 1. Result Type Dropdown */}
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Result Type</label>
            <Select 
              value={currentType || "ALL"} 
              onValueChange={(val) => handleFilterChange("type", val)}
            >
              <SelectTrigger className={triggerClasses}>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-amber-500 shrink-0" />
                  <SelectValue placeholder="Everything" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-60" position="popper" sideOffset={5}>
                <SelectItem value="ALL" className="cursor-pointer font-medium">Everything</SelectItem>
                <SelectItem value="institute" className="cursor-pointer font-medium">Institutes</SelectItem>
                <SelectItem value="job" className="cursor-pointer font-medium">Careers & Jobs</SelectItem>
                <SelectItem value="blog" className="cursor-pointer font-medium">Blogs & Articles</SelectItem>
              </SelectContent>
            </Select>
        </div>

        {/* 2. Category Dropdown */}
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Category</label>
            <Select 
              value={currentCategory || "ALL"} 
              onValueChange={(val) => handleFilterChange("category", val)}
            >
              <SelectTrigger className={triggerClasses}>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-amber-500 shrink-0" />
                  <SelectValue placeholder="All Categories" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-64" position="popper" sideOffset={5}>
                <SelectItem value="ALL" className="cursor-pointer font-medium">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.slug} value={c.slug} className="cursor-pointer font-medium">
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

        {/* 3. Cities Dropdown */}
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">City</label>
            <Select 
              value={currentCity || "ALL"} 
              onValueChange={(val) => handleFilterChange("city", val)}
            >
              <SelectTrigger className={triggerClasses}>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-500 shrink-0" />
                  <SelectValue placeholder="All Cities" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-64" position="popper" sideOffset={5}>
                <SelectItem value="ALL" className="cursor-pointer font-medium">All Cities</SelectItem>
                {cities.map((c) => (
                  <SelectItem key={c.slug} value={c.slug} className="cursor-pointer font-medium">
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

        {/* 4. Rating Dropdown (Smart Filter) */}
        {(currentType === "ALL" || currentType === "institute" || !currentType) && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Minimum Rating</label>
                <Select 
                  value={currentRating || "ALL"} 
                  onValueChange={(val) => handleFilterChange("rating", val)}
                >
                  <SelectTrigger className={triggerClasses}>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500 shrink-0" />
                      <SelectValue placeholder="Any Rating" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl" position="popper" sideOffset={5}>
                    <SelectItem value="ALL" className="cursor-pointer font-medium">Any Rating</SelectItem>
                    <SelectItem value="5.0" className="cursor-pointer font-medium">5.0</SelectItem>
                    <SelectItem value="4.5" className="cursor-pointer font-medium">4.5 & Above</SelectItem>
                    <SelectItem value="4" className="cursor-pointer font-medium">4.0 & Above</SelectItem>
                    <SelectItem value="3.5" className="cursor-pointer font-medium">3.5 & Above</SelectItem>
                    <SelectItem value="3" className="cursor-pointer font-medium">3.0 & Above</SelectItem>
                  </SelectContent>
                </Select>
            </div>
        )}
      </div>
    </aside>
  );
}