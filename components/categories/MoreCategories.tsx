import {
  Scale,
  Calculator,
  Plane,
  Shield,
  Train,
  GraduationCap,
} from "lucide-react";

import MiniCategoryCard from "./MiniCategoryCard";

const items = [
  {
    title: "CLAT",
    subtitle: "Law Entrance",
    count: "64",
    icon: Scale,
  },
  {
    title: "CA / CS",
    subtitle: "Commerce",
    count: "112",
    icon: Calculator,
  },
  {
    title: "NID / NIFT",
    subtitle: "Design",
    count: "42",
    icon: GraduationCap,
  },
  {
    title: "IELTS / TOEFL",
    subtitle: "Study Abroad",
    count: "76",
    icon: Plane,
  },
  {
    title: "Railways",
    subtitle: "RRB Exams",
    count: "94",
    icon: Train,
  },
  {
    title: "Defence",
    subtitle: "NDA & CDS",
    count: "58",
    icon: Shield,
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
          <MiniCategoryCard
            key={item.title}
            {...item}
          />
        ))}
      </div>
    </section>
  );
}