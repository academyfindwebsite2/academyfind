import InstituteCard from "@/components/institutes/InstituteCard";
import { meili } from "@/lib/meilisearch";
import MapToggleSection from "../maps/MapToggleSection"; 

type Props = {
  query: string;
  city?: string;
};

export default async function InstituteResults({ query, city }: Props) {
  // 1. STRICT SEARCH (Pehle try karega exact Sector/Area dhoondhne ki)
  let result = await meili.index("global_search").search(query, {
    limit: 100,
    filter: city
      ? ['type = "institute"', `citySlug = "${city}"`]
      : ['type = "institute"'],
  });

  let institutes = result.hits as any[];
  let showedFallbackMessage = false;

  // 2. THE FALLBACK LOGIC (Agar area me kuch nahi mila)
  // Agar query me kuch likha tha (e.g. Sector 62) par result 0 aaye
  if (institutes.length === 0 && query.trim().length > 0) {
    showedFallbackMessage = true;

    // Ab hum specific query (Sector 62) hata kar, blank query "" se broad search karenge
    // Jisse us city ke baaki top rating wale institutes aa jayenge
    result = await meili.index("global_search").search("", {
      limit: 100,
      filter: city
        ? ['type = "institute"', `citySlug = "${city}"`]
        : ['type = "institute"'],
    });

    institutes = result.hits as any[];
  }

  // 3. Agar poore sehar me hi kuch nahi hai (Zero Results)
  if (institutes.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <h3 className="text-lg font-semibold">No institutes found</h3>
        <p className="mt-2 text-slate-500">
          Try searching with different keywords or check nearby cities.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* 👇 FALLBACK BANNER 👇 */}
      {showedFallbackMessage && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm animate-in fade-in zoom-in duration-300">
          <div className="flex items-start gap-3">
            <span className="text-xl">📍</span>
            <div>
              <h4 className="font-semibold">Couldn't find exact matches for your specific area.</h4>
              <p className="text-sm mt-1 text-amber-700">
                Showing top-rated institutes in and around <strong>{city || "your selected location"}</strong> instead.
              </p>
            </div>
          </div>
        </div>
      )}

      <MapToggleSection
        institutes={institutes.map((institute) => ({
          id: institute.id,
          name: institute.name,
          latitude: institute.latitude,
          longitude: institute.longitude,
          slug: `${institute.prismaId}-${institute.slug}`,
        }))}
      />

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        {institutes.map((institute) => (
          <InstituteCard
            key={institute.id}
            id={institute.prismaId}
            slug={institute.slug}
            name={institute.name}
            image={institute.imageUrl}
            averageRating={institute.googleRating || institute.averageRating}
            reviewCount={institute.googleReviewCount || institute.reviewCount}
            description={institute.description}
            city={{
              name: institute.city,
              slug: institute.citySlug,
            }}
          />
        ))}
      </div>
    </>
  );
}