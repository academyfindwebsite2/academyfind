"use client";

import { useState } from "react";
import {
  GraduationCap,
  Heart,
  Landmark,
  Briefcase,
  Wrench,
  Calculator,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import CategoryCard from "./CategoryCard";

const categories = [
  {
    title: "JEE",
    description: "Engineering Entrance",
    icon: GraduationCap,
    slug: "jee-coaching",
  },
  {
    title: "NEET",
    description: "Medical Entrance",
    icon: Heart,
    slug: "neet-coaching",
  },
  {
    title: "UPSC",
    description: "Civil Services",
    icon: Landmark,
    slug: "upsc-coaching",
  },
  {
    title: "SSC",
    description: "Government Jobs",
    icon: Briefcase,
    slug: "ssc-coaching",
  },
  {
    title: "CAT",
    description: "MBA Entrance",
    icon: Briefcase,
    slug: "cat-coaching",
  },
  {
    title: "GATE",
    description: "PG Engineering",
    icon: Wrench,
    slug: "gate-coaching",
  },
  {
    title: "Banking",
    description: "PO & Clerk Exams",
    icon: Calculator,
    slug: "banking-coaching",
  },
  {
    title: "CUET",
    description: "University Entrance",
    icon: GraduationCap,
    slug: "cuet-coaching",
  },
];

export default function CategoryGrid() {
  const [expanded, setExpanded] = useState(false);

  const visibleCategories = expanded
    ? categories
    : categories.slice(0, 6);

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {visibleCategories.map((category) => (
          <CategoryCard
            key={category.title}
            {...category}
          />
        ))}
      </div>

      {categories.length > 6 && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setExpanded(!expanded)}
            className="rounded-full"
          >
            {expanded ? (
              <>
                Show Less
                <ChevronUp className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                View More Categories
                <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </section>
  );
}