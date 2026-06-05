"use client";

import {
  AdvancedMarker,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";

interface Props {
  name: string;
  latitude: number | null;
  longitude: number | null;
}

export default function InstituteMap({
  name,
  latitude,
  longitude,
}: Props) {
  // Safety fallback just in case coordinates are missing
  const lat = latitude ?? 28.5800; // Noida default
  const lng = longitude ?? 77.3300;

  return (
    <div className="overflow-hidden rounded-3xl border">
      <Map
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || "DEMO_MAP_ID"} // 👈 FIX 1: Map ID added here!
        defaultCenter={{
          lat: lat,
          lng: lng,
        }}
        defaultZoom={15}
        gestureHandling="greedy"
        disableDefaultUI={false}
        style={{
          width: "100%",
          height: "450px",
        }}
      >
        <AdvancedMarker
          position={{
            lat: lat,
            lng: lng,
          }}
        >
          <Pin />
        </AdvancedMarker>
      </Map>

      <div className="border-t bg-white p-4">
        <p className="font-semibold">
          {name}
        </p>

        {/* 👈 FIX 2: Fixed the Google Maps link string interpolation and URL format */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} 
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-sm font-medium text-amber-600"
        >
          Open in Google Maps →
        </a>
      </div>
    </div>
  );
}