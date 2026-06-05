import InstituteCard from "@/components/institutes/InstituteCard";
import { meili } from "@/lib/meilisearch";

// Naya Client Component import kiya (jo humne pichle step mein banaya tha)
import MapToggleSection from "../maps/MapToggleSection"; 

type Props = {
  query: string;
  city?: string;
};

export default async function InstituteResults({
  query,
  city
}: Props) {
  const result = await meili
  .index("global_search")
  .search(query, {
    limit: 20,
    filter: city
      ? [
          'type = "institute"',
          `citySlug = "${city}"`,
        ]
      : ['type = "institute"'],
  });

  const institutes = result.hits as any[];

  if (institutes.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <h3 className="text-lg font-semibold">
          No institutes found
        </h3>

        <p className="mt-2 text-slate-500">
          Try searching with different keywords.
        </p>
      </div>
    );
  }

  return (
    <>
        <MapToggleSection
            institutes={institutes.map((institute) => ({
              id: institute.id,
              name: institute.name,
              latitude: institute.latitude,
              longitude: institute.longitude,
              slug: `${institute.prismaId}-${institute.slug}`, // Note: Make sure 'slug' format matches what your InfoWindow Link expects
            }))}
          />
      <div className="grid gap-6 md:grid-cols-2">
        {institutes.map((institute) => (
          <InstituteCard
            key={institute.id}
            id={institute.prismaId}
            slug={institute.slug}
            name={institute.name}
            image={institute.imageUrl}
            averageRating={institute.averageRating}
            reviewCount={institute.reviewCount}
            description={institute.description}
            city={{
              name: institute.city,
              slug: institute.citySlug,
            }}
          />
        ))}
      </div>

      {/* Direct map ki jagah ab humara premium toggle component aayega */}
      
    </>
  );
}