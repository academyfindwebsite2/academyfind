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

export function SearchBar() {
  const [input, setInput] = useState("");
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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

  const handleSearch = () => {
    if (!input.trim()) return;

    const params = new URLSearchParams();

    params.set("q", input.trim());

    if (city) {
      params.set("city", city);
    }

    router.push(`/search?${params.toString()}`);
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
      {/* Search Input */}
      <div className="relative flex min-w-0 w-full flex-1 items-center">
        <Search className="ml-2 mr-3 h-5 w-5 shrink-0 text-amber-400" />

        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Search coaching institutes..."
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

        {/* Suggestions Dropdown */}
        {(suggestions.length > 0 || loading) && (
          <div
            className="
              absolute
              left-0
              right-0
              top-full
              z-50
              mt-3
              overflow-hidden
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
                  <span className="text-lg">
                    {item.type === "institute" && "🏫"}
                    {item.type === "city" && "📍"}
                    {item.type === "category" && "📚"}
                  </span>

                  <div>
                    <p className="font-medium text-slate-900">
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

      {/* City Select */}
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
            <SelectValue placeholder="City" />
          </div>
        </SelectTrigger>

        <SelectContent className="rounded-xl border-0 bg-slate-50 p-2 shadow-lg">
          <SelectItem value="noida">Noida</SelectItem>
          <SelectItem value="delhi">Delhi</SelectItem>
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