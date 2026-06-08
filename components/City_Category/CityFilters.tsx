"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDownUp, MapPin, Star, IndianRupee } from "lucide-react";
import { Button } from "../ui/button";
import SmartButton from "../ui/SmartButton";

interface Props {
  category: string;
  city: string;
  hasLocation: boolean;
}

export default function CityFilters({ category, city, hasLocation }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Current values from URL (Default 'all' set kiya hai UI match karne ke liye)
  const currentSort = searchParams.get("sort") || "relevance";
  const currentRadius = searchParams.get("radius") || "5";
  const currentRating = searchParams.get("rating") || "all";
  const currentFee = searchParams.get("fee") || "all";
  const isClosest = searchParams.get("closest") === "true";

  const toggleClosest = () => {
  const params = new URLSearchParams(searchParams.toString());
  if (isClosest) {
    params.delete("closest");
  } else {
    params.delete("sort");
    params.set("closest", "true");
  }
  router.push(`${pathname}?${params.toString()}`);
};

  // 🚀 Magic Function
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "relevance" && value !== "all") {
      params.delete("closest");
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  // 💅 Common styles for the premium pill look
  const triggerClasses = "rounded-full border-amber-200 bg-white hover:bg-amber-50 focus:ring-2 focus:ring-amber-400 focus:ring-offset-0 focus:outline-none transition-all data-[state=open]:bg-amber-50 data-[state=open]:border-amber-400 h-10 shadow-sm";

  return (
    <section className="mb-8 flex flex-col gap-4">
      
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

      {/* 2. Distance Filter */}
      {hasLocation && (
        <Select value={currentRadius} onValueChange={(val) => handleFilterChange("radius", val)}>
          <SelectTrigger className={`w-full ${triggerClasses}`}>
            <div className="flex items-center gap-2 font-medium text-slate-700">
              <MapPin className="h-4 w-4 text-amber-500" />
              <SelectValue placeholder="Distance" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-100 shadow-xl" position="popper" side="bottom" sideOffset={5}>
            <SelectItem value="2" className="cursor-pointer">Within 2 km</SelectItem>
            <SelectItem value="5" className="cursor-pointer">Within 5 km</SelectItem>
            <SelectItem value="10" className="cursor-pointer">Within 10 km</SelectItem>
            <SelectItem value="20" className="cursor-pointer">Within 20 km</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* 3. Ratings Filter */}
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

      {/* 4. Fees Filter */}
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

      <Button 
        variant={isClosest ? "default" : "outline"}
        onClick={toggleClosest}
        className={`rounded-full transition-all ${
          isClosest 
            ? "bg-amber-500 text-white hover:bg-amber-600" 
            : "bg-white border-amber-200 text-slate-700 hover:bg-amber-50"
        }`}
      >
        <MapPin className="mr-2 h-4 w-4" />
        {isClosest ? "Sorted: Closest" : "Sort by Closest"}
      </Button>

    </section>
  );
}