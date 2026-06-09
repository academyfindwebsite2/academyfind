import InstituteCard from "@/components/institutes/InstituteCard";
import { getInstitutesByCategoryAndCity } from "@/lib/institutes_cat_city";
import { InstituteWithDistance } from "@/lib/institutes_cat_city";

type InstituteWithRelations = Awaited<ReturnType<typeof getInstitutesByCategoryAndCity>>["institutes"][number];

interface Props {
  institutes: InstituteWithDistance[];
  category: string
}

export default function InstituteListing({
  institutes,category
}: Props) {
  if (!institutes.length) {
    return (
      <div className="mt-10 rounded-3xl border border-amber-100 bg-amber-50 p-10 text-center">
        <h3 className="text-xl font-semibold text-slate-900">
          No Institutes Found
        </h3>

        <p className="mt-2 text-slate-600">
          We couldn't find any institutes for this
          category and city yet.
        </p>

        <button className="mt-6 rounded-xl bg-amber-500 px-5 py-2 text-white hover:bg-amber-600">
            Explore Other Cities
        </button>
      </div>
    );
  }

  return (
    <section className="mt-12">
        <div className="mb-8">
            <span className="rounded-full bg-amber-100 px-4 py-1 text-sm font-medium text-amber-400">
            Institute Listings
            </span>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-amber-950">
            Top Institutes
            </h2>

            <p className="mt-3 text-amber-400/80">
            {institutes.length} visible on this page
            </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {institutes.map((institute) => (
            <InstituteCard
                key={institute.id}
                id={institute.id}
                slug={institute.slug}
                name={institute.name}
                description={institute.description}
                city={institute.city}
                averageRating={institute.googleRating ?? 0}
                reviewCount={institute.googleReviewCount ?? 0}
                image={institute.imageUrl}
                distance={institute.distance}
                category={category}
            />
            ))}
        </div>
    </section>
  );
}