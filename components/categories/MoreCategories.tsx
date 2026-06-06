import Link from "next/link";
import {
  Scale,
  Calculator,
  Plane,
  Shield,
  Train,
  GraduationCap,
} from "lucide-react";

import MiniCategoryCard from "./MiniCategoryCard";

// 👇 1. Har item mein 'slug' add kiya gaya hai
const items = [
  {
    title: "CLAT",
    subtitle: "Law Entrance",
    count: "64",
    icon: Scale,
    slug: "clat-coaching", // Apna actual DB slug yahan daalein
  },
  {
    title: "CA / CS",
    subtitle: "Commerce",
    count: "112",
    icon: Calculator,
    slug: "ca-coaching",
  },
  {
    title: "NID / NIFT",
    subtitle: "Design",
    count: "42",
    icon: GraduationCap,
    slug: "nift-coaching",
  },
  {
    title: "IELTS / TOEFL",
    subtitle: "Study Abroad",
    count: "76",
    icon: Plane,
    slug: "ielts-coaching",
  },
  {
    title: "Railways",
    subtitle: "RRB Exams",
    count: "94",
    icon: Train,
    slug: "railway-coaching",
  },
  {
    title: "Defence",
    subtitle: "NDA & CDS",
    count: "58",
    icon: Shield,
    slug: "defence-coaching",
  },
];

export default function MoreCategories() {
  return (
    <section className="container mx-auto px-4 py-20">
      <h2 className="text-4xl font-bold">
        More Categories
      </h2>

      <p className="mt-2 text-muted-foreground">
        Specialized exams and professional courses.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {items.map((item) => (
          // 👇 2. Link se wrap kar diya aur key yahan move kar di
          <Link key={item.title} href={`/${item.slug}`} className="block outline-none">
            <MiniCategoryCard
              title={item.title}
              subtitle={item.subtitle}
              count={item.count}
              icon={item.icon}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}