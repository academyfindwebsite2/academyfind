import type { Metadata } from "next";
import { notFound } from "next/navigation";

import extractId from "@/lib/extractId";
import { getInstituteById } from "@/lib/institutes/institutes_id";
import Breadcrumb from "@/components/navigation/BreadCrumbs";
import Link from "next/link";
import InstituteMap from "@/components/maps/InstituteMap";
import ReviewForm from "@/components/reviews/ReviewForm";
import { Star, Phone, MapPin, Mail, Globe, CheckCircle, Users, Trophy, PlayCircle, User } from "lucide-react"; 
import Image from "next/image";
import SmartButton from "@/components/ui/SmartButton";
import { Button } from "@/components/ui/button";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { trackVisitHistory } from "@/lib/User/user/user-activity";
import { prisma } from "@/lib/prisma";
import SaveButton from "@/components/ui/SaveButton"; // Fixed extension .tsx

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

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default async function InstitutePage({ params }: PageProps) {
  const { idSlug } = await params;
  const id = extractId(idSlug);
  const institute = await getInstituteById(id);

  if (!institute) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers()
  })

  let alreadySaved = false;

  if (session?.user) {
    await trackVisitHistory(session.user.id, institute.id).catch(console.error)

    const savedEntry = await prisma.userShortlist.findUnique({
      where: {
        userId_instituteId: {
          userId: session.user.id,
          instituteId: institute.id
        }
      }
    });
    alreadySaved = !!savedEntry
  }

  const displayRating = institute.googleRating ?? institute.averageRating ?? 0;
  const displayReviewCount = institute.googleReviewCount ?? institute.reviewCount ?? 0;

  // 🚀 Logic to hide "Claim Profile" if a manager already exists
  const isAlreadyClaimed = institute.managers && institute.managers.length > 0;

  const primaryCategoryId = institute.categories[0]?.categoryId;
  
  let similarInstitutes: any[] = [];
  if (primaryCategoryId && institute.cityId) {
    similarInstitutes = await prisma.institute.findMany({
      where: {
        cityId: institute.cityId,
        isActive: true,
        id: { not: institute.id },
        categories: {
          some: { categoryId: primaryCategoryId }
        }
      },
      take: 3,
      orderBy: { averageRating: 'desc' },
      include: {
        city: true,
        categories: { include: { category: true } }
      }
    });
  }

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
                    {/* 🚀 FIX: Made this row completely flex so the save button is ALWAYS on the right */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                            {institute.name}
                          </h1>
                          {institute.isVerified && (
                            <p className="text-[0.65rem] font-bold text-blue-600 flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 mt-1">
                              <CheckCircle className="h-3.5 w-3.5"/> Verified
                            </p>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <div className="flex flex-wrap gap-2">
                            {institute.categories.map((item: any) => (
                              <span
                                key={item.category.id}
                                className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 tracking-wide uppercase"
                              >
                                {item.category.name}
                              </span>
                            ))}
                          </div>
                          
                          {displayRating > 0 && (
                            <div className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              {displayRating} ({displayReviewCount} Reviews)
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* 🚀 FIX: Save Button & Text wrapped in a col-flex */}
                      <div className="shrink-0 flex flex-col items-center justify-center gap-1.5 pt-1">
                        <SaveButton 
                          userId={session?.user?.id} 
                          instituteId={institute.id} 
                          isInitiallySaved={alreadySaved} 
                        />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${alreadySaved ? "text-amber-600" : "text-slate-400"}`}>
                          {alreadySaved ? "Saved" : "Save"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                      <div className="flex items-start gap-2.5 text-slate-600">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                        <span className="text-sm leading-relaxed">{institute.address || institute.city.name}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6 pt-2 border-t border-slate-200/60 mt-1">
                        {institute.phone && (
                          <a href={`tel:${institute.phone}`} className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-amber-600 transition">
                            <Phone className="h-4 w-4 text-amber-500" />
                            {institute.phone}
                          </a>
                        )}

                        {institute.email && (
                          <a href={`mailto:${institute.email}`} className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-amber-600 transition">
                            <Mail className="h-4 w-4 text-amber-500" />
                            {institute.email}
                          </a>
                        )}

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

                {institute.description ? (
                  <p className="mt-8 leading-8 text-amber-700 bg-amber-50/50 p-5 border border-amber-100 rounded-2xl">
                    {institute.description}
                  </p>
                ) : (
                  <div className="mt-8 text-amber-700 bg-amber-50/50 p-5 border border-amber-100 rounded-2xl space-y-4">
                    <p className="leading-8">
                      <strong>{institute.name}</strong> located in {institute.city.name} is listed on AcademyFind to help students and parents discover educational and learning opportunities. Information displayed on this page has been compiled from publicly available sources and may be updated over time. For the latest details regarding courses, fees, schedules, admissions, and facilities, please contact the institute directly.
                    </p>
                    
                    {/* 🚀 FIX: Hidden if already claimed */}
                    {!isAlreadyClaimed && (
                        <div className="pt-4 border-t border-amber-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <p className="text-amber-800 text-sm sm:text-base leading-relaxed">
                            <strong>Are you the owner or representative of this institute?</strong>{' '}
                            Claim this profile to update information, add photos, and enhance your presence on AcademyFind.
                        </p>

                        <Link href={`/institute/${institute.id}-${institute.slug}/claim`} className="shrink-0">
                            <Button className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer transition-colors px-6">
                            Claim Profile
                            </Button>
                        </Link>
                        </div>
                    )}
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
                
                {institute.googleMapsUrl && (
                  <a href={institute.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    <button className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50 flex items-center justify-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      View on Maps
                    </button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 space-y-16">
        
        {/* Quick Facts */}
        <section>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">City</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-800">{institute.city.name}</h3>
            </div>
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Categories Listed</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-800">{institute.categories.length}</h3>
            </div>
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Google Rating</p>
              <h3 className="mt-2 flex items-center gap-2 text-2xl font-bold text-slate-800">
                {displayRating > 0 ? (
                  <>{displayRating} <Star className="h-5 w-5 fill-amber-400 text-amber-400" /></>
                ) : ("New")}
              </h3>
              <p className="mt-1 text-xs text-slate-500">{displayReviewCount} total reviews</p>
            </div>
          </div>
        </section>

        {/* TEACHERS / FACULTY */}
        {institute && institute.teachers && institute.teachers.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><Users className="w-6 h-6" /></div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Expert Faculty</h2>
                <p className="text-slate-500 text-sm mt-1">Learn from highly experienced educators.</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {institute.teachers.map((teacher: any) => (
                <div key={teacher.id} className="rounded-3xl border border-slate-200 bg-white p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                    {teacher.imageUrl ? (
                      <Image src={teacher.imageUrl} alt={teacher.name} width={60} height={60} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-8 w-8 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{teacher.name}</h4>
                    {teacher.subject && <p className="text-sm font-semibold text-emerald-600">{teacher.subject}</p>}
                    {teacher.experience && <p className="text-xs text-slate-500 mt-1">{teacher.experience}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RESULT IMAGES / GALLERY */}
        {institute.gallery && institute.gallery.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Trophy className="w-6 h-6" /></div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Student Achievements</h2>
                <p className="text-slate-500 text-sm mt-1">Glimpses of past results and campus.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {institute.gallery.map((url: string, idx: number) => (
                <div key={idx} className="relative aspect-4/3 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm group cursor-pointer">
                  <img 
                    src={url} 
                    alt={`Result ${idx + 1}`} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* YOUTUBE VIDEOS */}
        {institute.youtubeVideos && institute.youtubeVideos.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl"><PlayCircle className="w-6 h-6" /></div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Featured Videos</h2>
                <p className="text-slate-500 text-sm mt-1">Watch demo classes and academy tours.</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {institute.youtubeVideos.map((url: string, idx: number) => {
                const videoId = getYouTubeId(url);
                if (!videoId) return null;
                return (
                  <div key={idx} className="aspect-video w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full border-0"
                    ></iframe>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Location Map */}
        {institute.latitude && institute.longitude && (
          <section>
            <h2 className="mb-6 text-3xl font-bold text-slate-900">Location Map</h2>
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
              <InstituteMap name={institute.name} latitude={institute.latitude} longitude={institute.longitude} />
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900">AcademyFind Reviews</h2>
          <p className="mt-2 text-slate-600">Share your personal experience with this institute.</p>
          <div className="mt-6 space-y-4">
            {institute.reviews.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
                Be the first to review {institute.name} on our platform!
              </div>
            ) : (
              institute.reviews.map((review: any) => (
                <div key={review.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="font-semibold text-slate-800">{review.user?.name || "Anonymous User"}</div>
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

        {/* SIMILAR INSTITUTES */}
        {similarInstitutes.length > 0 && (
          <section className="border-t border-slate-200 pt-16 mt-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  Similar Institutes in {institute.city.name}
                </h2>
                <p className="mt-2 text-slate-500">
                  Explore other top-rated options for {institute.categories[0]?.category.name}.
                </p>
              </div>
              <Link href={`/${institute.categories[0]?.category.slug}/${institute.city.slug}`} className="text-sm font-bold text-amber-600 hover:text-amber-700 transition">
                View All →
              </Link>
            </div>
            
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similarInstitutes.map((simInst: any) => (
                <Link 
                  href={`/institute/${simInst.id}-${simInst.slug}`} 
                  key={simInst.id} 
                  className="group flex flex-col rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Card Image */}
                  <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                    <img 
                      src={simInst.imageUrl ?? simInst.logo ?? "/no_image/coaching_inst.PNG"} 
                      alt={simInst.name} 
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    {simInst.isVerified && (
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-[10px] font-bold text-slate-700">Verified</span>
                        </div>
                    )}
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md line-clamp-1">
                            {simInst.categories[0]?.category.name}
                        </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg line-clamp-1 group-hover:text-amber-600 transition-colors">
                      {simInst.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1.5 flex items-start gap-1.5 line-clamp-2">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5" /> 
                      {simInst.address || simInst.city.name}
                    </p>
                    
                    {/* Card Footer (Rating) */}
                    <div className="mt-auto pt-5 flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold text-slate-800">
                            {simInst.googleRating > 0 ? simInst.googleRating : "New"}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-slate-400">({simInst.googleReviewCount} reviews)</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}