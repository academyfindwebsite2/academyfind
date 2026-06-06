"use client";

import { useEffect, useState } from "react";
import { Search, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Suggestion = {
  id: string;
  type: "institute" | "city" | "category";
  name: string;
  url: string;
};

// 👇 Naye Smart Routing Dictionaries (Apni needs ke hisaab se words add karein)
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
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Handle Autocomplete Suggestions
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

  // 👇 Updated: Smart Routing Handle Search
  // 👇 Updated: Bulletproof Smart Routing Handle Search
  const handleSearch = () => {
    // Agar input khali hai aur city bhi select nahi ki (ya 'all' hai), toh kuch mat karo
    if (!input.trim() && (!city || city === "all")) return;

    setSuggestions([]);

    const activeCity = city === "all" ? "" : city;
    // Pura text ek dum clean lowercase array banalo
    const combinedQuery = `${input} ${activeCity}`.toLowerCase();
    
    // Testing ke liye console me dekhein
    console.log("Analyzing Query:", combinedQuery);

    let matchedCategorySlug = null;
    let matchedCitySlug = activeCity || null;

    // 1. Better Category Matching (Word boundaries use karke taaki 'jee' aur 'jeevan' mix na ho)
    for (const cat of CATEGORY_MAP) {
      for (const kw of cat.keywords) {
        // Regex word boundary \b ensure karega exact word match ho
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        if (regex.test(combinedQuery)) {
          matchedCategorySlug = cat.slug;
          console.log(`✅ Category Match Found: ${kw} -> ${cat.slug}`);
          break; // Break keyword loop
        }
      }
      if (matchedCategorySlug) break; // Break category map loop
    }

    // 2. Better City Matching (Agar dropdown se 'all' ya khali tha)
    if (!matchedCitySlug) {
      for (const c of CITY_MAP) {
        for (const kw of c.keywords) {
          const regex = new RegExp(`\\b${kw}\\b`, 'i');
          if (regex.test(combinedQuery)) {
            matchedCitySlug = c.slug;
            console.log(`✅ City Match Found: ${kw} -> ${c.slug}`);
            break;
          }
        }
        if (matchedCitySlug) break;
      }
    }

    // 3. Exact Routing Decisions
    console.log("Final Routing Plan:", { category: matchedCategorySlug, city: matchedCitySlug });

    if (matchedCategorySlug && matchedCitySlug) {
      // Dono mil gaye -> Direct dedicated page
      router.push(`/${matchedCategorySlug}/${matchedCitySlug}`);
    } 
    else if (matchedCategorySlug) {
      // Sirf Category mili -> Category hub page
      router.push(`/${matchedCategorySlug}`);
    } 
    else {
      // Generic ya institute naam hai -> Meilisearch page par bhejo
      const params = new URLSearchParams();
      if (input.trim()) params.set("q", input.trim());
      if (activeCity) params.set("city", activeCity);
      
      router.push(`/search?${params.toString()}`);
    }
  };

  const handleSuggestionClick = (url: string) => {
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
      {/* Search Input + Dropdown */}
      <div className="relative min-w-0 w-full flex-1">
        <div className="flex items-center h-12">
          <Search className="ml-2 mr-3 h-5 w-5 shrink-0 text-amber-400" />

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search 'Best JEE coaching in Noida'..."
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
        {(suggestions.length > 0 || loading) && (
          <div
            className="
              absolute
              left-0
              top-full
              z-50
              mt-3
              w-full
              max-h-96
              overflow-y-auto
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-2xl
            "
          >
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
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-left
                    transition
                    hover:bg-amber-50
                  "
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
                    <p className="text-xs text-slate-500 capitalize">
                      {item.type}
                    </p>
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* City Select Dropdown */}
      <Select value={city} onValueChange={setCity}>
        <SelectTrigger
          className="
            h-12
            w-full
            sm:w-40
            sm:shrink-0
            border-0
            shadow-none
            focus:ring-0
          "
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-amber-500" />
            <SelectValue placeholder="All Cities" />
          </div>
        </SelectTrigger>

        <SelectContent className="rounded-xl border-0 bg-slate-50 p-2 shadow-lg">
          <SelectItem value="all">All Cities</SelectItem>
          <SelectItem value="noida">Noida</SelectItem>
          <SelectItem value="delhi">Delhi</SelectItem>
          <SelectItem value="kota">Kota</SelectItem>
        </SelectContent>
      </Select>

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