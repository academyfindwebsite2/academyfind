"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const primaryCategories = [
  "Engineering",
  "Medical",
  "Civil Services",
  "Management",
  "Government Jobs",
];

const moreCategories = [
  "Study Abroad",
  "Commerce",
  "Design",
  "Law",
  "Defence",
  "Railways",
  "Teaching",
  "Language Training",
  "Sports",
  "Music & Arts",
];

export default function CategoryFilters() {
  const [active, setActive] = useState("Engineering");

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex gap-3 overflow-x-auto">
        {primaryCategories.map((item) => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className={`
              rounded-full px-5 py-2 text-sm font-medium whitespace-nowrap transition-all
              ${
                active === item
                  ? "bg-amber-500 text-white"
                  : "border bg-background hover:bg-muted"
              }
            `}
          >
            {item}
          </button>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="
                flex items-center gap-2
                rounded-full border
                px-5 py-2 text-sm font-medium
                hover:bg-muted
              "
            >
              View More
              <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            {moreCategories.map((item) => (
              <DropdownMenuItem
                key={item}
                onClick={() => setActive(item)}
              >
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </section>
  );
}