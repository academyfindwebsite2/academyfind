"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowDownUp, Star, IndianRupee, MonitorSmartphone } from "lucide-react";

interface Props {
  category: string;
}

export default function CategoryFilters({ category }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL se current parameters uthao
  const currentSort = searchParams.get("sort") || "relevance";
  const currentRating = searchParams.get("rating") || "all";
  const currentFee = searchParams.get("fee") || "all";
  
  const currentModeParam = searchParams.get("mode");
  const currentModes = currentModeParam ? currentModeParam.split(",") : ["offline", "online", "hybrid"];

  // URL parameters update karne ka magic function
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "relevance" && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Filter badalne par page hamesha 1 par reset hona chahiye
    router.push(`${pathname}?${params.toString()}`);
  };

  // Mode Checkbox toggling logic
  const toggleMode = (modeValue: string) => {
    let newModes = [...currentModes];
    if (newModes.includes(modeValue)) {
      newModes = newModes.filter((m) => m !== modeValue);
    } else {
      newModes.push(modeValue);
    }

    const params = new URLSearchParams(searchParams.toString());
    if (newModes.length === 3 || newModes.length === 0) {
      params.delete("mode");
    } else {
      params.set("mode", newModes.join(","));
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const triggerClasses = "rounded-full border-amber-200 bg-white hover:bg-amber-50 focus:ring-2 focus:ring-amber-400 focus:ring-offset-0 focus:outline-none transition-all data-[state=open]:bg-amber-50 data-[state=open]:border-amber-400 h-10 shadow-sm";

  return (
    <section className="flex flex-col gap-4">
      {/* 1. Sort By */}
      <Select value={currentSort} onValueChange={(val) => handleFilterChange("sort", val)}>
        <SelectTrigger className={`w-full ${triggerClasses}`}>
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <ArrowDownUp className="h-4 w-4 text-amber-500" />
            <SelectValue placeholder="Sort By" />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl border-slate-100 shadow-xl" position="popper" side="bottom" sideOffset={5}>
          <SelectItem value="relevance" className="cursor-pointer">Relevance</SelectItem>
          <SelectItem value="rating" className="cursor-pointer">Top Rated</SelectItem>
          <SelectItem value="reviews" className="cursor-pointer">Most Reviewed</SelectItem>
        </SelectContent>
      </Select>

      {/* 2. Ratings Filter */}
      <Select value={currentRating} onValueChange={(val) => handleFilterChange("rating", val)}>
        <SelectTrigger className={`w-full ${triggerClasses}`}>
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <Star className="h-4 w-4 text-amber-500" />
            <SelectValue placeholder="Ratings" />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl border-slate-100 shadow-xl" position="popper" side="bottom" sideOffset={5}>
          <SelectItem value="all" className="cursor-pointer">Any Rating</SelectItem>
          <SelectItem value="4.5" className="cursor-pointer">4.5+ Stars</SelectItem>
          <SelectItem value="4.0" className="cursor-pointer">4.0+ Stars</SelectItem>
          <SelectItem value="3.5" className="cursor-pointer">3.5+ Stars</SelectItem>
        </SelectContent>
      </Select>

      {/* 3. Fees Filter */}
      <Select value={currentFee} onValueChange={(val) => handleFilterChange("fee", val)}>
        <SelectTrigger className={`w-full ${triggerClasses}`}>
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <IndianRupee className="h-4 w-4 text-amber-500" />
            <SelectValue placeholder="Fees" />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl border-slate-100 shadow-xl" position="popper" side="bottom" sideOffset={4}>
          <SelectItem value="all" className="cursor-pointer">Any Fee</SelectItem>
          <SelectItem value="50000" className="cursor-pointer">&lt; ₹50,000</SelectItem>
          <SelectItem value="100000" className="cursor-pointer">&lt; ₹1,00,000</SelectItem>
          <SelectItem value="150000" className="cursor-pointer">&lt; ₹1,50,000</SelectItem>
        </SelectContent>
      </Select>

      {/* 4. Learning Mode Checkboxes Box */}
      <div className="rounded-3xl border border-amber-200 bg-white p-5 shadow-sm mt-1">
        <div className="flex items-center gap-2 font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">
          <MonitorSmartphone className="h-5 w-5 text-amber-500" />
          <span>Learning Mode</span>
        </div>
        
        <div className="flex flex-col gap-3.5">
          {[
            { id: "offline", label: "Offline / Classroom" },
            { id: "online", label: "Online / Live Classes" },
            { id: "hybrid", label: "Hybrid Mode" },
          ].map((mode) => (
            <div key={mode.id} className="flex items-center space-x-3 group">
              <Checkbox
                id={`cat-mode-${mode.id}`}
                checked={currentModes.includes(mode.id)}
                onCheckedChange={() => toggleMode(mode.id)}
                className="h-5 w-5 rounded-[6px] border-slate-300 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 transition-all cursor-pointer"
              />
              <Label
                htmlFor={`cat-mode-${mode.id}`}
                className="cursor-pointer text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors flex-1"
              >
                {mode.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}