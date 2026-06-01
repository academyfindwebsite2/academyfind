import {getInstitutesByCategoryAndCity} from "@/lib/institutes_cat_city"
import {notFound} from "next/navigation"
import type {Metadata} from "next"
import formatSlug from "@/lib/formatSlug"
import Link from "next/link"
import InstituteCard from "@/components/institutes/InstituteCard"
import Breadcrumb from "@/components/navigation/BreadCrumbs"

export const revalidate = 86400;

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
    const {category, city} = await params;
    const categoryName = formatSlug(category);
    const cityName = formatSlug(city);
    return {
        title: `Best ${categoryName} in ${cityName} - AcademyFind`,
        description: `Discover the best ${categoryName} in ${cityName} with AcademyFind. Find top-rated institutes, courses, and more to help you achieve your goals.`,
        alternates:{
            canonical: `${process.env.BASE_URL}/${category}/${city}`
        }
    }
    


}

interface PageProps {
    params: Promise<{
        category: string;
        city: string;
    }>;
}

export default async function CategroryCityPage({params}: PageProps) {
    const {category, city} = await params;
    const categoryName = formatSlug(category);
    const cityName = formatSlug(city);
    const institutes = await getInstitutesByCategoryAndCity(category, city);
    // if (!institutes.length) {
    //     notFound();
    // }
    return (
    <div>
      <Breadcrumb 
        items = {[
          {
            label: categoryName,
            href: `${category}`
          },
          {
            label: cityName,
            href: `/{category}/${city}`
          },
        ]}
        />
      <h1>
        Best {categoryName} in {cityName}
      </h1>

      {institutes.length === 0 ? (
        <p>No institutes found.</p>
      ) : (
        institutes.map((institute) => {
            const averageRating = institute.reviews.length > 0 ? institute.reviews.reduce((sum, review) => sum + review.rating, 0) / institute.reviews.length : null;
            const reviewCount = institute.reviews.length;
            return (
          <InstituteCard
            key={institute.id}
            id={institute.id}
            slug={institute.slug}
            name={institute.name}
            description={institute.description}
            city={institute.city}
            averageRating={averageRating}
            reviewCount={reviewCount}
            image={institute.imageUrl}
          />
            )
})
      )}
    </div>
  );
}

