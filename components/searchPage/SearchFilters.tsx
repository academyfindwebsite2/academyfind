"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Layers, MapPin, Star, Sparkles, Filter, Navigation } from "lucide-react";

type FilterProps = {
  categories: { name: string; slug: string }[];
  cities: { name: string; slug: string }[];
  currentType: string;
  currentCity: string;
  currentCategory: string;
  currentRating: string;
  currentLat?: string;
  currentLng?: string;
  currentRadius?: string;
  currentSort?: string;
};

export default function SearchFilters({ 
  categories, cities, currentType, currentCity, currentCategory, currentRating, currentLat, currentLng, currentRadius, currentSort
}: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if(key === "sort" && value === "nearest_me" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        params.set("userlat", latitude.toString());
        params.set("userlng", longitude.toString());
        params.set(key, value);
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
      }, (error) => {
        console.error("Error getting geolocation:", error);
        params.delete("userlat");
        params.delete("userlng");
        router.push(`${pathname}?${params.toString()}`);
      })
    }

    if(key === "sort" && value === "nearest_location") {
      params.delete("userlat");
      params.delete("userlng");
      params.set(key, value);
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    }

    
    if (value && value !== "ALL") params.set(key, value);
    else params.delete(key); 

    if (key === "type" && value !== "institute") params.delete("rating");
    
    params.delete("page"); 
    router.push(`${pathname}?${params.toString()}`);
  };

  const triggerClasses = "w-full rounded-xl border-slate-200 bg-slate-50/50 hover:bg-amber-50/30 hover:border-amber-300 focus:ring-2 focus:ring-amber-400 focus:ring-offset-0 focus:outline-none transition-all data-[state=open]:bg-amber-50/50 data-[state=open]:border-amber-400 h-11 text-sm shadow-xs font-medium text-slate-700";

  // 🔥 Dono Desktop & Mobile ke liye Same Content Variable
  const FiltersContent = (
    <div className="space-y-6">
      {currentLat && currentLng && (
          <div className="space-y-4 rounded-2xl">
             <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Distance From Area</label>
                <Select value={currentRadius || "5"} onValueChange={(val) => handleFilterChange("radius", val)}>
                  <SelectTrigger className={triggerClasses}>
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-amber-500 shrink-0" />
                      <SelectValue placeholder="Select Distance" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    <SelectItem value="ALL" className="cursor-pointer font-medium">Any Distance</SelectItem>
                    <SelectItem value="1" className="cursor-pointer font-medium">&lt; 1 km</SelectItem>
                    <SelectItem value="2" className="cursor-pointer font-medium">&lt; 2 km</SelectItem>
                    <SelectItem value="5" className="cursor-pointer font-medium">&lt; 5 km</SelectItem>
                    <SelectItem value="10" className="cursor-pointer font-medium">&lt; 10 km</SelectItem>
                  </SelectContent>
                </Select>
            </div>

            <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <Button variant="outline" className="w-full justify-between border-slate-200 bg-white shadow-sm rounded-2xl py-3 font-bold text-slate-700 hover:bg-slate-50" onClick={() => handleFilterChange("sort", "nearest_location")}>
                  <span className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-amber-500" />
                    Sort by Nearest to Area
                  </span>
                </Button>
            </div>


            {/*  <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Sort By Location</label>
                   <Select value={currentSort || "nearest_location"} onValueChange={(val) => handleFilterChange("sort", val)}>
                     <SelectTrigger className={triggerClasses}>
                       <div className="flex items-center gap-2">
                         <Filter className="h-4 w-4 text-amber-500 shrink-0" />
                         <SelectValue placeholder="Sort Results" />
                       </div>
                     </SelectTrigger>
                     <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                       <SelectItem value="nearest_location" className="cursor-pointer font-medium">Nearest to Searched Area</SelectItem>
                       <SelectItem value="nearest_me" className="cursor-pointer font-medium">Nearest to Me (My GPS)</SelectItem>
                     </SelectContent>
                   </Select>
               </div> */}
          </div>
        )}
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Result Type</label>
            <Select value={currentType || "ALL"} onValueChange={(val) => handleFilterChange("type", val)}>
              <SelectTrigger className={triggerClasses}>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-amber-500 shrink-0" />
                  <SelectValue placeholder="Everything" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-60">
                <SelectItem value="ALL" className="cursor-pointer font-medium">Everything</SelectItem>
                <SelectItem value="institute" className="cursor-pointer font-medium">Institutes</SelectItem>
                <SelectItem value="job" className="cursor-pointer font-medium">Careers & Jobs</SelectItem>
                <SelectItem value="blog" className="cursor-pointer font-medium">Blogs & Articles</SelectItem>
              </SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Category</label>
            <Select value={currentCategory || "ALL"} onValueChange={(val) => handleFilterChange("category", val)}>
              <SelectTrigger className={triggerClasses}>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-amber-500 shrink-0" />
                  <SelectValue placeholder="All Categories" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-64">
                <SelectItem value="ALL" className="cursor-pointer font-medium">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.slug} value={c.slug} className="cursor-pointer font-medium">{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">City</label>
            <Select value={currentCity || "ALL"} onValueChange={(val) => handleFilterChange("city", val)}>
              <SelectTrigger className={triggerClasses}>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-500 shrink-0" />
                  <SelectValue placeholder="All Cities" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-64">
                <SelectItem value="ALL" className="cursor-pointer font-medium">All Cities</SelectItem>
                {cities.map((c) => (
                  <SelectItem key={c.slug} value={c.slug} className="cursor-pointer font-medium">{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

        {(currentType === "ALL" || currentType === "institute" || !currentType) && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Minimum Rating</label>
                <Select value={currentRating || "ALL"} onValueChange={(val) => handleFilterChange("rating", val)}>
                  <SelectTrigger className={triggerClasses}>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500 shrink-0" />
                      <SelectValue placeholder="Any Rating" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    <SelectItem value="ALL" className="cursor-pointer font-medium">Any Rating</SelectItem>
                    <SelectItem value="4" className="cursor-pointer font-medium">4.0 & Above</SelectItem>
                    <SelectItem value="4.5" className="cursor-pointer font-medium">4.5 & Above</SelectItem>
                  </SelectContent>
                </Select>
            </div>
        )}
    </div>
  );

  return (
    <>
      {/* 🚀 Mobile View: Sticky Filter Button & Sheet */}
      <div className="lg:hidden mb-2 ">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-between border-slate-200 bg-white shadow-sm rounded-2xl py-6 font-bold text-slate-700 hover:bg-slate-50">
              <span className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-amber-500" />
                Filter Results
              </span>
              <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-full text-slate-500">Tap to open</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl h-[85vh] overflow-y-auto px-6 py-5">
            <SheetHeader className="pb-4 border-b border-slate-100 mb-6 text-left">
              <SheetTitle className="flex items-center gap-2 text-xl font-extrabold text-slate-800">
                <Sparkles className="w-5 h-5 text-amber-500" /> Refine Search
              </SheetTitle>
            </SheetHeader>
            {FiltersContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* 💻 Desktop View: Sticky Sidebar */}
      <aside className="sticky top-24 hidden h-fit rounded-3xl border bg-background p-6 shadow-sm lg:block border-slate-200">
        <h3 className="font-extrabold text-slate-900 mb-6 text-lg tracking-tight pb-3 border-b border-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" /> Filters
        </h3>
        {FiltersContent}
      </aside>
    </>
  );
}