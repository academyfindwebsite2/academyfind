import SearchHero from "@/components/searchPage/SearchHero";
import SearchFilters from "@/components/searchPage/SearchFilters";
import SearchResultsHeader from "@/components/searchPage/SearchResultsHeader";
import InstituteResults from "@/components/searchPage/InstituteResults";
import RelatedCategories from "@/components/searchPage/RelatedCategories";
import RelatedCities from "@/components/searchPage/RelatedCities";
import RelatedBlogs from "@/components/searchPage/RelatedBlogs";
import CompareCTA from "@/components/searchPage/CompareCTA";
import { prisma } from "@/lib/prisma"; 
import { Metadata } from "next"; // 👈 Don't forget to import Metadata

type Props = {
  searchParams: Promise<{
    q?: string;
    type?: string;
    city?: string;
    category?: string; 
    rating?: string;   
  }>;
};

// ─── 1. DYNAMIC METADATA FOR SEARCH UX & CRAWLER CONTROL ───
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q = "", city = "", category = "" } = await searchParams;

  // Browser tab ke liye ek smart dynamic title banate hain
  let titleStr = "Search Institutes & Coaching";
  
  if (q) {
    titleStr = `Results for "${q}"`;
  } else if (category && city) {
    // Format slashes or hyphens if needed, e.g., "JEE Coaching in Delhi"
    titleStr = `${category.replace(/-/g, ' ')} in ${city.replace(/-/g, ' ')}`;
  } else if (city) {
    titleStr = `Top Institutes in ${city.replace(/-/g, ' ')}`;
  } else if (category) {
    titleStr = `${category.replace(/-/g, ' ')} Institutes`;
  }

  const title = `${titleStr} | AcademyFind`;
  const description = "Search, filter, and compare the best coaching institutes and schools on AcademyFind.";

  return {
    title: title,
    description: description,
    robots: { 
      index: false, 
      follow: true 
    },
    openGraph: {
      title: title,
      description: description,
      url: "https://www.academyfind.com/search",
      type: "website",
    },
  };
}

// ─── 2. PAGE COMPONENT ───────────────────────────────────────
export default async function SearchPage({ searchParams }: Props) {
  const { q = "", type = "", city = "", category = "", rating = "" } = await searchParams;

  const categories = await prisma.category.findMany({ select: { name: true, slug: true }, orderBy: { name: "asc" } });
  const cities = await prisma.city.findMany({
    where: {
      institutes: {
        some: {
          isActive: true
        }
      }
    },
    select: { 
      name: true, 
      slug: true 
    },
    orderBy: [
      { name: 'asc' },
      { state: 'asc' },
    ]
  });

  return (
    <>
      <SearchHero query={q || city} />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          
          <SearchFilters 
            categories={categories} 
            cities={cities} 
            currentType={type} 
            currentCity={city} 
            currentCategory={category}
            currentRating={rating}
          />

          <div className="space-y-14">
            <SearchResultsHeader 
               query={q} 
               type={type} 
               city={city} 
               category={category} 
               rating={rating}
            />

            <InstituteResults query={q} type={type} city={city} category={category} rating={rating} />

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