import Link from "next/link";

interface Props {
  category: string;
  city: string;
  activeSort?: string;
}

const filters = [
  {
    label: "Top Rated",
    value: "rating",
  },
  {
    label: "Most Reviewed",
    value: "reviews",
  },
  {
    label: "Lowest Fees",
    value: "fees",
  },
];

export default function CityFilters({
  category,
  city,
  activeSort,
}: Props) {
  return (
    <section className="mb-8">
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => {
          const isActive =
            activeSort === filter.value;

          return (
            <Link
              key={filter.value}
              href={`/${category}/${city}?sort=${filter.value}`}
              className={`
                rounded-full
                px-4
                py-2
                text-sm
                font-medium
                transition-all

                ${
                  isActive
                    ? "bg-amber-500 text-white border border-amber-500"
                    : "bg-white text-slate-700 border border-amber-200 hover:bg-amber-50"
                }
              `}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}