import Link from "next/link";
import { MapPin, ArrowRight, Building2 } from "lucide-react";

interface CityCardProps {
  cityName: string;
  citySlug: string;
  categorySlug: string; // Jaise: 'jee-coaching'
  instituteCount?: number; // Optional: Agar DB se count bhej rahe ho
}

export default function CityCard({
  cityName,
  citySlug,
  categorySlug,
  instituteCount,
}: CityCardProps) {
  return (
    <Link
      href={`/${categorySlug}/${citySlug}`}
      className="
        group 
        relative 
        flex 
        flex-col 
        justify-between 
        overflow-hidden 
        rounded-2xl 
        border 
        border-slate-200 
        bg-white 
        p-6 
        transition-all 
        duration-300
        hover:-translate-y-1
        hover:border-amber-300 
        hover:shadow-xl 
        hover:shadow-amber-500/5
      "
    >
      {/* Subtle Background Glow (Hover par expand hoga) */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-amber-400/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />

      <div className="relative flex items-start justify-between">
        {/* Icon Container */}
        <div className="rounded-xl bg-amber-50 p-3 text-amber-500 transition-colors group-hover:bg-amber-100 group-hover:text-amber-600">
          <MapPin className="h-6 w-6" />
        </div>
        
        {/* Animated Arrow */}
        <div className="rounded-full bg-slate-50 p-2 transition-colors group-hover:bg-amber-50">
          <ArrowRight className="h-4 w-4 text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-amber-500" />
        </div>
      </div>

      <div className="relative mt-8">
        <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-amber-600">
          {cityName}
        </h3>
        
        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <Building2 className="h-4 w-4 text-slate-400" />
          <span>
            {instituteCount ? `${instituteCount}+ Top Institutes` : "Explore Top Institutes"}
          </span>
        </div>
      </div>
    </Link>
  );
}