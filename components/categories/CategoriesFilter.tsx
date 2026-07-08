// components/categories/CategoriesFilter.tsx
"use client";

interface CategoryFiltersProps {
  parents: { id: string; name: string; slug: string }[];
  activeId: string;
  setActiveId: (id: string) => void;
}

export default function CategoryFilters({ parents, activeId, setActiveId }: CategoryFiltersProps) {
  if (!parents || parents.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex flex-wrap gap-3">
        {parents.map((item) => (
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
      </div>
    </section>
  );
}