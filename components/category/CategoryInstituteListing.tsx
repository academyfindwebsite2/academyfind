import InstituteCard from "@/components/institutes/InstituteCard";
import { getInstitutesByCategory } from "@/lib/category_inst"; // 👈 Sahi function import kiya type ke liye

// Ye ensure karta hai ki TypeScript ko exact DB columns pata hon
type InstituteWithRelations =
  Awaited<
    ReturnType<
      typeof getInstitutesByCategory
    >
  >[number];

interface Props {
  institutes: InstituteWithRelations[];
}

export default function InstituteListing({
  institutes,
}: Props) {
  if (!institutes.length) {
    return (
      <div className="mt-10 rounded-3xl border border-amber-100 bg-amber-50 p-10 text-center shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900">
          No Institutes Found
        </h3>

        <p className="mt-2 text-slate-600">
          We couldn't find any institutes for this category yet.
        </p>

        <button className="mt-6 rounded-xl bg-amber-500 px-6 py-2.5 font-medium text-white transition-colors hover:bg-amber-600 shadow-sm">
          Explore Other Categories
        </button>
      </div>
    );
  }

  return (
    <section className="mt-12">
      {/* 🎨 Sahi Color Theme: Amber & Slate ka premium mix */}
      <div className="mb-8">
        <span className="inline-block rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold text-amber-700">
          Institute Listings
        </span>

        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Top Institutes
        </h2>

        <p className="mt-2 text-lg text-slate-600">
          {institutes.length} institutes available to explore
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {institutes.map((institute) => (
          <InstituteCard
            key={institute.id}
            id={institute.id}
            slug={institute.slug}
            name={institute.name}
            description={institute.description}
            city={{
              name: institute.city.name,
              slug: institute.city.slug,
            }}
            averageRating={institute.averageRating ?? 0}
            reviewCount={institute.reviewCount ?? 0}
            // 👇 Google Ratings pass karna mat bhoolna
            googleRating={institute.googleRating}
            googleReviewCount={institute.googleReviewCount}
            image={institute.imageUrl}
          />
        ))}
      </div>
    </section>
  );
}