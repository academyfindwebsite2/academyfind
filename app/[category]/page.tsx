import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import InstituteCard from "@/components/institutes/InstituteCard";

import formatSlug from "@/lib/formatSlug";

import {
  getCategoryBySlug,
  getCitiesForCategory,
  getFeaturedInstitutesForCategory,
} from "@/lib/category";
import Breadcrumb from "@/components/navigation/BreadCrumbs";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;

  const categoryName = formatSlug(category);

  return {
    title: `Best ${categoryName} Institutes in India | AcademyFind`,
    description: `Discover top ${categoryName} institutes across India. Compare cities, reviews and courses.`,
  };
}

export default async function CategoryPage({
  params,
}: PageProps) {
  const { category } = await params;

  const categoryData =
    await getCategoryBySlug(category);

  if (!categoryData) {
    notFound();
  }

  const cities =
    await getCitiesForCategory(category);

  const featuredInstitutes =
    await getFeaturedInstitutesForCategory(
      category
    );

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">

      <Breadcrumb
        items={[
          {
            label: categoryData.name,
            href: `/${category}`,
          },
        ]}
      />

      <section>
        <h1 className="text-4xl font-bold">
          Best {categoryData.name} Institutes in India
        </h1>

        <p className="mt-4 text-gray-600">
          Compare top {categoryData.name} institutes,
          explore cities, reviews and course details.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">
          Popular Cities
        </h2>

        <div className="mt-6 flex flex-wrap gap-4">
          {cities.map((city) => (
            <Link
              key={city.id}
              href={`/${category}/${city.slug}`}
              className="border rounded-lg px-4 py-2"
            >
              {city.name}
            </Link>
          ))}
        </div>
      </section>


      <section className="mt-12">
        <h2 className="text-2xl font-semibold">
          Featured Institutes
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
            {featuredInstitutes.map((institute) => {
            const averageRating = institute.reviews.length > 0? institute.reviews.reduce((sum, review) => sum + review.rating,0) / institute.reviews.length: null;

            return (
              <InstituteCard
                key={institute.id}
                id={institute.id}
                slug={institute.slug}
                name={institute.name}
                description={institute.description}
                city={institute.city}
                averageRating={averageRating}
                reviewCount={institute.reviews.length}
                image={institute.imageUrl}
              />
            );
        })}
      </div>
      </section>


      <section className="mt-12">
        <h2 className="text-2xl font-semibold">
          About {categoryData.name}
        </h2>

        <p className="mt-4 text-gray-600">
          Find and compare the best{" "}
          {categoryData.name} institutes across
          India. Explore locations, reviews,
          facilities, and course information.
        </p>
      </section>

      {/* FAQ */}

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">
          Frequently Asked Questions
        </h2>

        <div className="mt-6 space-y-4">
          <div>
            <h3 className="font-medium">
              Which city is best for {categoryData.name}?
            </h3>

            <p className="text-gray-600">
              Popular cities include Kota,
              Delhi, Hyderabad and Jaipur.
            </p>
          </div>

          <div>
            <h3 className="font-medium">
              How do I compare institutes?
            </h3>

            <p className="text-gray-600">
              Compare reviews, courses,
              facilities and location before
              making a decision.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}