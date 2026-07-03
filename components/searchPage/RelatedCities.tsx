"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MapPin, ChevronRight } from "lucide-react";

// Added slugs for real routing
const cities = [
  { name: "Noida", slug: "noida" },
  { name: "Delhi", slug: "delhi" },
  { name: "Faridabad", slug: "faridabad" },
  { name: "Greater Noida", slug: "greater-noida" },
  { name: "Gurgaon", slug: "gurgaon" },
  { name: "Ghaziabad", slug: "ghaziabad" },
  { name: "Modinagar", slug: "modinagar" },
  { name: "Meerut", slug: "meerut" },
  { name: "Sonipat", slug: "sonipat" },
];

export default function RelatedCities() {
  const searchParams = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    params.delete("page"); 
    return params.toString();
  };

  if(lat && lng) {
    return null; // Don't show related cities if lat/lng is present
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          Top Education Hubs
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {cities.map((city: any) => (
          <Link
            key={city.slug}
            // 🔥 URL mein dynamic parameters pass ho rahe hain
            href={`/search?${createQueryString('city', city.slug)}`}
            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:border-amber-400 hover:shadow-md hover:shadow-amber-100"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-slate-50 p-2.5 text-slate-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                  {city.name}
                </h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  Explore institutes
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </section>
  );
}