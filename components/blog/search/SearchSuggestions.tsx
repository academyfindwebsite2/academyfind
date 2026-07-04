"use client";

import Link from "next/link";
import {
  Search,
  FileText,
  FolderOpen,
  Hash,
} from "lucide-react";

export type SearchSuggestion = {
  id: string;
  type: "blog" | "category" | "tag";
  title: string;
  subtitle?: string;
  url: string;
};

type SearchSuggestionsProps = {
  suggestions: SearchSuggestion[];
  loading?: boolean;
  selectedIndex: number;
  onSelect?: () => void;
};

export default function SearchSuggestions({
  suggestions,
  loading = false,
  selectedIndex,
  onSelect,
}: SearchSuggestionsProps) {
  if (loading) {
    return (
      <div className="absolute left-0 right-0 top-full z-[104] mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-lg bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-0 right-0 top-full z-[104] mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="max-h-96 overflow-y-auto py-2">
        {suggestions.map((item: SearchSuggestion, index: number) => (
          <Link
            key={item.id}
            href={item.url}
            onClick={onSelect}
            className={`flex items-center gap-4 px-5 py-3 transition ${
                selectedIndex === index
                    ? "bg-amber-50"
                    : "hover:bg-amber-50"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              {item.type === "blog" && (
                <FileText className="h-5 w-5" />
              )}

              {item.type === "category" && (
                <FolderOpen className="h-5 w-5" />
              )}

              {item.type === "tag" && (
                <Hash className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-slate-900">
                {item.title}
              </p>

              {item.subtitle && (
                <p className="truncate text-sm text-slate-500">
                  {item.subtitle}
                </p>
              )}
            </div>

            <Search className="h-4 w-4 text-slate-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}