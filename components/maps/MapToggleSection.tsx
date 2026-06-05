"use client";

import { useState } from "react";
import InstitutesMap from "./InstitutesMap";

interface MapData {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  slug: string;
}

interface Props {
  institutes: MapData[];
}

export default function MapToggleSection({ institutes }: Props) {
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <div className="mt-8 flex flex-col items-center w-full">
      {/* Premium Toggle Button */}
      <button
        onClick={() => setMapOpen(!mapOpen)}
        className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 hover:ring-gray-400"
      >
        {!mapOpen ? (
          <>
            <svg className="h-5 w-5 text-amber-600 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            Explore Interactive Map
          </>
        ) : (
          <>
            <svg className="h-5 w-5 text-gray-500 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close Map View
          </>
        )}
      </button>

      {/* Expandable Map Container with Animation */}
      <div 
        className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${
          mapOpen ? "max-h-[600px] mt-6 opacity-100" : "max-h-0 mt-0 opacity-0"
        }`}
      >
        {mapOpen && <InstitutesMap institutes={institutes} />}
      </div>
    </div>
  );
}