import type { Metadata } from "next";
import { notFound } from "next/navigation";

import extractId from "@/lib/extractId";
import { getInstituteById } from "@/lib/institutes_id";
import Breadcrumb from "@/components/navigation/BreadCrumbs";
import Link from "next/link";
import InstituteMap from "@/components/maps/InstituteMap";
import ReviewForm from "@/components/reviews/ReviewForm";
import { Star } from "lucide-react"; // Star icon import kiya hai

export const revalidate = 86400;

interface PageProps {
  params: Promise<{
    idSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { idSlug } = await params;
  const id = extractId(idSlug);
  const institute = await getInstituteById(id);

  if (!institute) {
    return {
      title: "Institute Not Found",
    };
  }

  return {
    title: `${institute.name} | AcademyFind`,
    description: institute.description ?? `Learn more about ${institute.name}.`,
    alternates: {
      canonical: `${process.env.BASE_URL}/institute/${idSlug}`,
    },
  };
}

export default async function InstitutePage({ params }: PageProps) {
  const { idSlug } = await params;
  const id = extractId(idSlug);
  const institute = await getInstituteById(id);

  if (!institute) {
    notFound();
  }

  // Fallback logic: Agar google rating hai to wo use karo, nahi to internal average
  const displayRating = institute.googleRating ?? institute.averageRating ?? 0;
  const displayReviewCount = institute.googleReviewCount ?? institute.reviewCount ?? 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: institute.name,
    description: institute.description ?? "No description available",
    address: {
      "@type": "PostalAddress",
      addressLocality: institute.city.name,
    },
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-linear-to-b from-amber-50 via-white to-white">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-300/20 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 py-10">
          <Breadcrumb
            items={[
              {
                label: institute.categories[0]?.category.name,
                href: `/${institute.categories[0]?.category.slug}`,
              },
              {
                label: institute.city.name,
                href: `/${institute.categories[0]?.category.slug}/${institute.city.slug}`,
              },
              {
                label: institute.name,
                href: "#",
              },
            ]}
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_350px]">
            <div>
              <div className="rounded-3xl border bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-amber-100 text-4xl font-bold text-amber-600">
                    {institute.name.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <h1 className="text-4xl font-bold text-slate-900">
                          {institute.name}
                        </h1>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          {/* Categories */}
                          <div className="flex flex-wrap gap-2">
                            {institute.categories.map((item) => (
                              <span
                                key={item.category.id}
                                className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700"
                              >
                                {item.category.name}
                              </span>
                            ))}
                          </div>
                          
                          {/* Google Rating Badge in Hero */}
                          {displayRating > 0 && (
                            <div className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              {displayRating} ({displayReviewCount} Google Reviews)
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-slate-600">
                      📍 {institute.address || institute.city.name}
                    </p>
                  </div>
                </div>

                <p className="mt-8 leading-8 text-slate-600">
                  {institute.description ?? "A premier educational institute dedicated to providing quality coaching, expert guidance, and a competitive environment to help students achieve their academic goals."}
                </p>
              </div>
            </div>

            {/* Sticky CTA */}
            <div>
              <div className="sticky top-24 rounded-3xl border bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold">Get Admission Guidance</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Connect with experts and compare institutes before admission.
                </p>
                <Link href="/contact">
                  <button className="mt-5 w-full rounded-xl bg-amber-400 px-5 py-3 font-semibold text-black transition hover:bg-amber-500">
                    Enquire Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Quick Facts */}
        <section>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border bg-white p-6">
              <p className="text-sm text-slate-500">City</p>
              <h3 className="mt-2 text-2xl font-bold">{institute.city.name}</h3>
            </div>

            <div className="rounded-3xl border bg-white p-6">
              <p className="text-sm text-slate-500">Categories</p>
              <h3 className="mt-2 text-2xl font-bold">
                {institute.categories.length}

              </h3>
            </div>

            {/* Updated Reviews Fact Box */}
            <div className="rounded-3xl border bg-white p-6">
              <p className="text-sm text-slate-500">Google Rating</p>
              <h3 className="mt-2 flex items-center gap-2 text-2xl font-bold">
                {displayRating > 0 ? (
                  <>
                    {displayRating} <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  </>
                ) : (
                  "New"
                )}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {displayReviewCount} total reviews
              </p>
            </div>

            {/* <div className="rounded-3xl border bg-white p-6">
              <p className="text-sm text-slate-500">Status</p>
              <h3 className="mt-2 text-2xl font-bold text-green-600">
                {institute.isActive ? "Active" : "Closed"}
              </h3>
            </div> */}
          </div>
        </section>

        {/* About */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold">About {institute.name}</h2>
          <div className="mt-6 rounded-3xl border bg-white p-8">
            <p className="leading-8 text-slate-600">
              {institute.description ?? "Empowering students with top-notch education and expert faculty to pave the way for their successful careers."}
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 rounded-[32px] bg-linear-to-r from-amber-400 to-amber-500 p-12 text-center">
          <h2 className="text-4xl font-bold text-black">
            Looking for the Right Institute?
          </h2>
          <p className="mt-4 text-black/80">
            Compare top coaching institutes, courses and reviews on AcademyFind.
          </p>
          <button className="mt-8 rounded-xl bg-black px-8 py-3 font-semibold text-white">
            Compare Institutes
          </button>
        </section>

        {/* Location Map */}
        {institute.latitude && institute.longitude && (
          <section className="mt-16">
            <h2 className="mb-6 text-3xl font-bold">Location</h2>
            <InstituteMap
              name={institute.name}
              latitude={institute.latitude}
              longitude={institute.longitude}
            />
          </section>
        )}

        {/* Internal Student Reviews */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold">AcademyFind Reviews</h2>
          <p className="mt-2 text-slate-600">Share your personal experience with this institute.</p>
          
          <div className="mt-6 space-y-4">
            {institute.reviews.length === 0 ? (
              <div className="rounded-3xl border bg-white p-8 text-center text-slate-500">
                Be the first to review {institute.name} on our platform!
              </div>
            ) : (
              institute.reviews.map((review) => (
                <div key={review.id} className="rounded-3xl border bg-white p-6">
                  <div className="font-semibold">{review.user.name}</div>
                  <div className="mt-2 text-amber-400">
                    {"⭐".repeat(review.rating)}
                  </div>
                  {review.comment && (
                    <p className="mt-3 text-slate-600">{review.comment}</p>
                  )}
                </div>
              ))
            )}
          </div>
          
          <div className="mt-8">
            <ReviewForm instituteId={institute.id} />
          </div>
        </section>
      </div>
    </main>
  );
}