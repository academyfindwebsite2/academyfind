import SearchHero from "@/components/searchPage/SearchHero";
import SearchFilters from "@/components/searchPage/SearchFilters";
import SearchResultsHeader from "@/components/searchPage/SearchResultsHeader";
import InstituteResults from "@/components/searchPage/InstituteResults";
import RelatedCategories from "@/components/searchPage/RelatedCategories";
import RelatedCities from "@/components/searchPage/RelatedCities";
import RelatedBlogs from "@/components/searchPage/RelatedBlogs";
import CompareCTA from "@/components/searchPage/CompareCTA";
import InstitutesMap from "@/components/maps/InstitutesMap";

type Props = {
  searchParams: Promise<{
    q?: string;
    city?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: Props) {
  const { q = "" } = await searchParams;

  return {
    title: q
      ? `${q} Search Results | AcademyFind`
      : "Search | AcademyFind",
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SearchPage({
  searchParams,
}: Props) {
  const { q = "", city="" } = await searchParams;

  return (
    <>
      <SearchHero query={q} />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <SearchFilters />

          <div className="space-y-14">
            <SearchResultsHeader query={q} />

            <InstituteResults query={q} city={city}/>

            <RelatedCategories />

            <RelatedCities />

            <RelatedBlogs />

            <CompareCTA />
          </div>
        </div>
      </section>
    </>
  );
}