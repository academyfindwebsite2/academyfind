// components/categories/CategoriesFilter.tsx
"use client";

import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoryFiltersProps {
  parents: { id: string; name: string; slug: string }[];
  activeId: string;
  setActiveId: (id: string) => void;
}

export default function CategoryFilters({ parents, activeId, setActiveId }: CategoryFiltersProps) {
  if (!parents || parents.length === 0) return null;

  // Split into primary (first 5) and more (dropdown)
  const primaryCategories = parents.slice(0, 5);
  const moreCategories = parents.slice(5);

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex gap-3 overflow-x-auto no-scrollbar">
        {primaryCategories.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveId(item.id)}
            className={`
              rounded-full px-5 py-2 text-sm font-medium whitespace-nowrap transition-all
              ${
                activeId === item.id
                  ? "bg-amber-500 text-white"
                  : "border bg-background hover:bg-muted"
              }
            `}
          >
            {item.name}
          </button>
        ))}

        {moreCategories.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="
                  flex items-center gap-2 rounded-full border
                  px-5 py-2 text-sm font-medium hover:bg-muted
                "
              >
                View More <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              {moreCategories.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={activeId === item.id ? "bg-amber-50 text-amber-600" : ""}
                >
                  {item.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </section>
  );
}