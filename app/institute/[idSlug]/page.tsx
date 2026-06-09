import type { Metadata } from "next";
import { notFound } from "next/navigation";

import extractId from "@/lib/extractId";
import { getInstituteById } from "@/lib/institutes_id";
import Breadcrumb from "@/components/navigation/BreadCrumbs";
import Link from "next/link";
import InstituteMap from "@/components/maps/InstituteMap";
import ReviewForm from "@/components/reviews/ReviewForm";
// 👇 Saare naye icons import kiye hain
import { Star, Phone, MapPin, Mail, Globe, CheckCircle } from "lucide-react"; 
import Image from "next/image";
import SmartButton from "@/components/ui/SmartButton";
import { Button } from "@/components/ui/button";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{
    idSlug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { idSlug } = await params;
  const id = extractId(idSlug);
  const institute = await getInstituteById(id);

  if (!institute) {
    return { title: "Institute Not Found" };
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
    telephone: institute.phone ?? undefined,
    url: institute.website ?? undefined,
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
              { label: institute.name, href: "#" },
            ]}
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_350px]">
            <div>
              <div className="rounded-3xl border bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  
                  {/* Institute Image/Logo */}
                  <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-3xl border shadow-sm">
                    <Image 
                      src={institute.logo ?? institute.imageUrl ?? "/inst.jpg"} 
                      alt={institute.name} 
                      width={128} 
                      height={128}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        {/* Title with Verified Badge */}
                        <div className="flex items-center gap-2">
                          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                            {institute.name}
                          </h1>
                          {institute.isVerified && (
                            <p className="text-[0.6rem]"><CheckCircle className="h-6 w-6 text-blue-500"/>Verified Institute</p>
                            
                          )}
                        </div>

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
                          
                          {/* Google Rating Badge */}
                          {displayRating > 0 && (
                            <div className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              {displayRating} ({displayReviewCount} Reviews)
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 🚀 Updated Contact Info Box */}
                    <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                      
                      {/* Address */}
                      <div className="flex items-start gap-2.5 text-slate-600">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                        <span className="text-sm leading-relaxed">{institute.address || institute.city.name}</span>
                      </div>

                      {/* Flex Container for Phone, Email, Website */}
                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6 pt-2 border-t border-slate-200/60 mt-1">
                        
                        {/* Phone */}
                        {institute.phone && (
                          <a href={`tel:${institute.phone}`} className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-amber-600 transition">
                            <Phone className="h-4 w-4 text-amber-500" />
                            {institute.phone}
                          </a>
                        )}

                        {/* Email */}
                        {institute.email && (
                          <a href={`mailto:${institute.email}`} className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-amber-600 transition">
                            <Mail className="h-4 w-4 text-amber-500" />
                            {institute.email}
                          </a>
                        )}

                        {/* Website */}
                        {institute.website && (
                          <a href={institute.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-amber-600 transition">
                            <Globe className="h-4 w-4 text-amber-500" />
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
               {institute.description ? (
  <p className="mt-8 leading-8 text-amber-600 bg-slate-50 p-4 border border-slate-100 rounded-xl">
    {institute.description}
  </p>
                ) : (
                  <div className="mt-8 text-amber-600 bg-slate-50 p-4 border border-slate-100 rounded-xl space-y-4">
                    <p className="leading-8">
                      <strong>{institute.name}</strong> located in {institute.city.name} is listed on AcademyFind to help students and parents discover educational and learning opportunities. Information displayed on this page has been compiled from publicly available sources and may be updated over time. For the latest details regarding courses, fees, schedules, admissions, and facilities, please contact the institute directly.
                    </p>
                    
                    {/* Clean, Flexbox CTA Section */}
                    <div className="pt-4 border-t border-amber-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <p className="text-amber-700 text-sm sm:text-base leading-relaxed">
                        <strong>Are you the owner or representative of this institute?</strong>{' '}
                        Claim this profile to update information, add photos, and enhance your presence on AcademyFind.
                      </p>

                      <Link href="/claim" className="shrink-0">
                        <Button className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer transition-colors px-6">
                          Claim Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
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
                  <SmartButton className="mt-5 w-full rounded-xl bg-amber-400 px-5 py-3 font-semibold text-black transition hover:bg-amber-500">
                    Enquire Now
                  </SmartButton>
                </Link>
                
                {/* Agar Google Maps URL hai toh ek aur button show kar do */}
                {institute.googleMapsUrl && (
                  <a href={institute.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    <button className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50 flex items-center justify-center gap-2">
                      <MapPin className="h-4 w-4" />
                      View on Maps
                    </button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the Content (Quick Facts, About, Location, Reviews remain same) */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <section>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border bg-white p-6">
              <p className="text-sm text-slate-500">City</p>
              <h3 className="mt-2 text-2xl font-bold">{institute.city.name}</h3>
            </div>
            <div className="rounded-3xl border bg-white p-6">
              <p className="text-sm text-slate-500">Categories</p>
              <h3 className="mt-2 text-2xl font-bold">{institute.categories.length}</h3>
            </div>
            <div className="rounded-3xl border bg-white p-6">
              <p className="text-sm text-slate-500">Google Rating</p>
              <h3 className="mt-2 flex items-center gap-2 text-2xl font-bold">
                {displayRating > 0 ? (
                  <>{displayRating} <Star className="h-5 w-5 fill-amber-400 text-amber-400" /></>
                ) : ("New")}
              </h3>
              <p className="mt-1 text-xs text-slate-500">{displayReviewCount} total reviews</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold">About {institute.name}</h2>
          <div className="mt-6 rounded-3xl border bg-white p-8">
            <p className="leading-8 text-slate-600">
              {institute.description ?? "Empowering students with top-notch education and expert faculty to pave the way for their successful careers."}
            </p>
          </div>
        </section>

        {/* Location Map */}
        {institute.latitude && institute.longitude && (
          <section className="mt-16">
            <h2 className="mb-6 text-3xl font-bold">Location</h2>
            <InstituteMap name={institute.name} latitude={institute.latitude} longitude={institute.longitude} />
          </section>
        )}

        {/* Reviews Section */}
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
                  <div className="font-semibold">{review.user?.name || "Anonymous User"}</div>
                  <div className="mt-2 text-amber-400">{"⭐".repeat(review.rating)}</div>
                  {review.comment && <p className="mt-3 text-slate-600">{review.comment}</p>}
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