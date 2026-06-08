"use client";

import { useEffect, useState, useRef } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// 👇 Aapka naya Google Places Component yahan import karein
import LocationAutocomplete from "./LocationAutoComplete";

type Suggestion = {
  id: string;
  type: "institute" | "city" | "category";
  name: string;
  url: string;
};

const CATEGORY_MAP = [
  { keywords: ["jee", "iit", "mains", "advanced"], slug: "jee-coaching" },
  { keywords: ["neet", "medical", "mbbs"], slug: "neet-coaching" },
  { keywords: ["upsc", "ias", "civil services"], slug: "upsc-coaching" },
];

const CITY_MAP = [
  { keywords: ["noida", "greater noida"], slug: "noida" },
  { keywords: ["delhi", "new delhi"], slug: "delhi" },
  { keywords: ["kota"], slug: "kota" },
];

export function SearchBar() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 👇 Naya State: Google Places se aaye hue coordinates ke liye
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    // Agar click wrapperRef (Input + Dropdown) ke BAHAR hua hai
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      setShowSuggestions(false); // Dropdown band kar do
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  // Handle Autocomplete Suggestions (Sirf "What" input ke liye)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(input)}`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Suggestion fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [input]);

  // Handle Search Execution
  const handleSearch = () => {
    // Agar dono input khali hain, toh kuch mat karo
    if (!input.trim() && !selectedLocation) return;

    setSuggestions([]);

    const lowerInput = input.toLowerCase();
    
    // Google API se jo address aaya (e.g., "Sector 62, Noida, UP"), usko check karenge
    const lowerAddress = selectedLocation?.address.toLowerCase() || "";

    let matchedCategorySlug = null;
    let matchedCitySlug = null;

    // 1. Find Category from "What" input
    for (const cat of CATEGORY_MAP) {
      for (const kw of cat.keywords) {
        if (new RegExp(`\\b${kw}\\b`, "i").test(lowerInput)) {
          matchedCategorySlug = cat.slug;
          break;
        }
      }
      if (matchedCategorySlug) break;
    }

    // 2. Find City from "Where" Address (Google result) ya fallback text input
    const citySearchText = lowerAddress || lowerInput;
    for (const c of CITY_MAP) {
      for (const kw of c.keywords) {
        if (new RegExp(`\\b${kw}\\b`, "i").test(citySearchText)) {
          matchedCitySlug = c.slug;
          break;
        }
      }
      if (matchedCitySlug) break;
    }

    // 3. 🧹 Magic Cleaner: Taki URL neat and clean dikhe
    let cleanQuery = lowerInput;
    const stopWords = ["best", "top", "in", "near", "me", "coaching", "coachings", "institute", "institutes", "classes"];
    
    stopWords.forEach((kw) => {
      cleanQuery = cleanQuery.replace(new RegExp(`\\b${kw}\\b`, "gi"), "");
    });
    // Category aur City hatao (Kyunki wo URL path me chali jayegi)
    if (matchedCategorySlug) {
      CATEGORY_MAP.find(c => c.slug === matchedCategorySlug)?.keywords.forEach(kw => {
        cleanQuery = cleanQuery.replace(new RegExp(`\\b${kw}\\b`, "gi"), "");
      });
    }
    if (matchedCitySlug && !selectedLocation) {
      CITY_MAP.find(c => c.slug === matchedCitySlug)?.keywords.forEach(kw => {
        cleanQuery = cleanQuery.replace(new RegExp(`\\b${kw}\\b`, "gi"), "");
      });
    }
    cleanQuery = cleanQuery.replace(/\s+/g, " ").trim();

    // 4. Build URL Parameters
    const params = new URLSearchParams();
    if (cleanQuery) params.set("q", cleanQuery);

    // 👇 SABSE ZAROORI: Google Coordinates URL me pass karo
    if (selectedLocation) {
      params.set("lat", selectedLocation.lat.toString());
      params.set("lng", selectedLocation.lng.toString());
      // Optional: Agar aapko SEO page pe address print karwana hai "Showing results near Sector 62..."
      params.set("address", selectedLocation.address); 
    }

    // 5. Smart Routing
    if (matchedCategorySlug && matchedCitySlug) {
      router.push(`/${matchedCategorySlug}/${matchedCitySlug}?${params.toString()}`);
    } else if (matchedCategorySlug) {
      router.push(`/${matchedCategorySlug}?${params.toString()}`);
    } else {
      router.push(`/search?${params.toString()}`);
    }
  };

  const handleSuggestionClick = (url: string) => {
    setShowSuggestions(false);
    setSuggestions([]);
    router.push(url);
  };

  return (
    <div
      className="
        flex
        flex-col
        gap-2
        w-full
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-2
        shadow-lg
        sm:h-16
        sm:flex-row
        sm:items-center
      "
    >
      {/* 1. "What" Input Box */}
      <div ref={wrapperRef} className="relative min-w-0 w-full flex-1">
        <div className="flex items-center h-12">
          <Search className="ml-2 mr-3 h-5 w-5 shrink-0 text-amber-400" />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => {
              if (input.trim().length >= 2) setShowSuggestions(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter"){
                setShowSuggestions(false)
                handleSearch();
              } 
            }}
            placeholder="Search 'JEE Coaching' or 'Aakash'..."
            className="
              min-w-0
              flex-1
              border-0
              p-0
              text-sm
              shadow-none
              focus-visible:ring-0
              sm:text-base
            "
          />
        </div>

        {/* Suggestions Dropdown Container */}
        {(showSuggestions && (suggestions.length > 0 || loading)) && (
          <div className="relative md:absolute md:left-0 md:top-full z-50 mt-2 md:mt-3 w-full max-h-52 md:max-h-96 overflow-y-auto rounded-2xl border border-slate-200 bg-white md:shadow-2xl shadow-md">
            {loading && (
              <div className="px-4 py-3 text-sm text-slate-500">
                Searching...
              </div>
            )}

            {!loading &&
              suggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSuggestionClick(item.url)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-amber-50"
                >
                  <span className="text-lg shrink-0">
                    {item.type === "institute" && "🏫"}
                    {item.type === "city" && "📍"}
                    {item.type === "category" && "📚"}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {item.name}
                    </p>
                    <p className="truncate text-xs text-slate-500 capitalize">
                      {item.type}
                    </p>
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Desktop Divider */}
      <div className="hidden h-8 w-px bg-slate-200 sm:block"></div>

      {/* 2. "Where" Location Autocomplete Box */}
      <div className="w-full sm:w-72">
        <LocationAutocomplete
          onLocationSelect={(lat, lng, address) => {
            setSelectedLocation({ lat, lng, address });
          }}
        />
      </div>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        className="
          h-12
          w-full
          sm:w-auto
          sm:shrink-0
          rounded-xl
          bg-amber-400
          px-6
          text-black
          hover:bg-amber-500
        "
      >
        Search
      </Button>
    </div>
  );
}