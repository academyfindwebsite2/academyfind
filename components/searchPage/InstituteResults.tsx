import InstituteCard from "@/components/institutes/InstituteCard";
import { meili } from "@/lib/meilisearch";
import MapToggleSection from "../maps/MapToggleSection"; 
import Link from "next/link"; // 🔥
import { Briefcase, FileText } from "lucide-react"; // 🔥

type Props = {
  query: string;
  type?: string;     // 🔥 Naya parameter
  city?: string;
  category?: string; 
  rating?: string;   
};

export default async function InstituteResults({ query, type, city, category, rating }: Props) {
  
  const searchFilters: string[] = [];
  
  // 1. Agar type specific hai, toh sirf wo laao, warna sab laao
  if (type) searchFilters.push(`type = "${type}"`);
  
  // 2. City Filter
  if (city) searchFilters.push(`citySlug = "${city}"`);
  
  // 3. Category Filter (Meilisearch me field ka naam categorySlugs tha)
  if (category) searchFilters.push(`categorySlugs = "${category}"`); 
  
  // 4. Rating Filter
  if (rating) searchFilters.push(`googleRating >= ${rating}`);

  // SEARCH CALL
  let result = await meili.index("global_search").search(query, {
    limit: 100,
    filter: searchFilters,
  });

  let hits = result.hits as any[];
  let showedFallbackMessage = false;

  // FALLBACK LOGIC
  if (hits.length === 0 && query.trim().length > 0) {
    showedFallbackMessage = true;
    result = await meili.index("global_search").search("", {
      limit: 100,
      filter: searchFilters, 
    });
    hits = result.hits as any[];
  }

  if (hits.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h3 className="text-lg font-semibold">No results found</h3>
        <p className="mt-2 text-slate-500">
          Try clearing some filters or searching with different keywords.
        </p>
      </div>
    );
  }

  // 🚀 Sirf Institutes ko Map ke liye filter karo
  const instituteHits = hits.filter(hit => hit.type === "institute");

  return (
    <>
      {showedFallbackMessage && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm animate-in fade-in zoom-in duration-300">
          <div className="flex items-start gap-3">
            <span className="text-xl">📍</span>
            <div>
              <h4 className="font-semibold">Couldn't find exact matches for your query.</h4>
              <p className="text-sm mt-1 text-amber-700">
                Showing best available results based on your filters.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Map Toggle (Sirf Institutes ko bhejna hai taaki code na fate) */}
      {instituteHits.length > 0 && (
          <MapToggleSection
            institutes={instituteHits.map((institute) => ({
              id: institute.id,
              name: institute.name,
              latitude: institute.latitude,
              longitude: institute.longitude,
              slug: `${institute.prismaId}-${institute.slug}`,
            }))}
          />
      )}

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        {hits.map((hit) => {
            // 🚀 SMART RENDERING BASED ON CONTENT TYPE

            // 1. Agar Institute hai
            if (hit.type === "institute") {
                return (
                    <InstituteCard
                        key={hit.id}
                        id={hit.prismaId}
                        slug={hit.slug}
                        name={hit.name}
                        image={hit.imageUrl}
                        averageRating={hit.googleRating || hit.averageRating}
                        reviewCount={hit.googleReviewCount || hit.reviewCount}
                        description={hit.description}
                        city={{
                            name: hit.city,
                            slug: hit.citySlug,
                        }}
                    />
                );
            }
            
            // 2. Agar Job / Career hai
            if (hit.type === "job") {
                return (
                    <Link href={`/careers/${hit.slug}`} key={hit.id} className="block group bg-white border border-slate-200 rounded-3xl p-6 hover:border-amber-400 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Briefcase className="w-5 h-5"/></div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Career Opportunity</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors">{hit.name}</h3>
                        <p className="text-sm text-slate-500 mt-2">{hit.department} • {hit.location}</p>
                    </Link>
                );
            }

            // 3. Agar Category ya Blog hai (Placeholder for future)
            if (hit.type === "category") {
                return (
                    <Link href={`/${hit.slug}`} key={hit.id} className="block group bg-white border border-slate-200 rounded-3xl p-6 hover:border-amber-400 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FileText className="w-5 h-5"/></div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors">Explore {hit.name}</h3>
                    </Link>
                );
            }

            return null;
        })}
      </div>
    </>
  );
}