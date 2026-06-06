import Link from "next/link";
import { Search } from "lucide-react";

interface Props {
  categoryName: string;
}

export default function PopularSearches({ categoryName }: Props) {
  const searches = [
    `Best ${categoryName}`,
    `${categoryName} in Kota`,
    `${categoryName} in Delhi`,
    `Affordable ${categoryName}`,
  ];

  return (
    <section className="py-16 border-t border-slate-100 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-900">
          Popular Searches
        </h2>

        <div className="flex flex-wrap gap-3 mt-8">
          {searches.map((search) => (
            <Link
              key={search}
              // 👇 Yahan query ko encode karke search page par bhej rahe hain
              href={`/search?q=${encodeURIComponent(search)}`}
              className="
                group 
                flex 
                items-center 
                gap-2 
                rounded-full 
                border 
                border-slate-200 
                bg-white 
                px-5 
                py-2.5 
                text-sm 
                font-medium 
                text-slate-600 
                transition-all 
                hover:border-amber-300 
                hover:bg-amber-50 
                hover:text-amber-700
              "
            >
              <Search className="h-4 w-4 text-slate-400 transition-colors group-hover:text-amber-500" />
              {search}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}