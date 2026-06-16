"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookOpen, ChevronRight } from "lucide-react";

// Added slugs for real routing
const categories = [
  { name: "JEE Coaching", slug: "jee-coaching" },
  { name: "NEET Coaching", slug: "neet-coaching" },
  { name: "NDA Coaching", slug: "nda-coaching" },
  { name: "UPSC Coaching", slug: "upsc-coaching" },
  { name: "Digital Marketing", slug: "digital-marketing" },
  { name: "UI/UX Design", slug: "ui-ux-design" },
];

export default function RelatedCategories() {
  const searchParams = useSearchParams();

  // 🔥 Existing URL parameters ko preserve karke naya filter add karne ka function
  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    params.delete("page"); // Naya filter lagane par page 1 par reset hona chahiye
    return params.toString();
  };

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          Popular Categories
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {categories.map((category: any) => (
          <Link
            key={category.slug}
            // 🔥 Direct page ke bajaye ab hum isko Search Page par hi as a filter use kar rahe hain
            href={`/search?${createQueryString('category', category.slug)}`}
            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-amber-400 hover:shadow-md hover:shadow-amber-100"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="font-bold text-slate-700 group-hover:text-amber-600 transition-colors">
                {category.name}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </section>
  );
}