import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { 
  Star, Phone, MapPin, Mail, Globe, CheckCircle, Users, Trophy, 
  PlayCircle, User, Presentation, BookOpen, IndianRupee, Clock, 
  Home, Award, Calendar, Building, ThumbsUp, ThumbsDown, HelpCircle, Check 
} from "lucide-react"; 
import { FaFacebook, FaInstagram, FaLinkedin, FaTelegram, FaTwitter, FaWhatsapp, FaYoutube } from "react-icons/fa";

import extractId from "@/lib/extractId";
import { getInstituteById } from "@/lib/institutes/institutes_id";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { trackVisitHistory } from "@/lib/User/user/user-activity";

import Breadcrumb from "@/components/navigation/BreadCrumbs";
import InstituteMap from "@/components/maps/InstituteMap";
import ReviewForm from "@/components/reviews/ReviewForm";
import { Button } from "@/components/ui/button";
import SaveButton from "@/components/ui/SaveButton"; 
import InstituteEnquiryForm from "@/components/manager/InstituteEnquiryForm";
import ViewTracker from "@/components/manager/ViewTracker";
import { getCachedInstituteById } from "@/lib/cachedQueries";
import { LockedOverlay } from "@/components/institutes/LockedOverlay";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ idSlug: string }>;
}

// 🚀 Helper Functions
function isCloudinaryImage(url?: string | null) {
  if (!url) return false;
  return url.includes("cloudinary.com");
}

const getFallbackImage = () => {
   return "/no_image/coaching_inst.PNG";
};

function getSafeImageUrl(logo?: string | null, imageUrl?: string | null) {
  if (isCloudinaryImage(logo)) return logo!;
  if (isCloudinaryImage(imageUrl)) return imageUrl!;
  return getFallbackImage(); 
}

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

const formatCurrency = (amount?: number | null) => {
  if (!amount) return "N/A";
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

// ─── 1. METADATA ─────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { idSlug } = await params;
  const id = extractId(idSlug);
  const institute = await getInstituteById(id);

  if (!institute) return { title: "Institute Not Found | AcademyFind" };

  const title = `${institute.name} in ${institute.city.name} - Fees, Reviews, Admission | AcademyFind`;
  const description = institute.description?.substring(0, 155) || `Get complete details about ${institute.name} in ${institute.city.name}. Check fee structure, read genuine student reviews, and get admission guidance on AcademyFind.`;

  const safeOgImage = getSafeImageUrl(institute.logo, institute.imageUrl);

  return {
    title,
    description,
    alternates: { canonical: `https://academyfind.com/institute/${idSlug}` },
    keywords: [
      `${institute.name} ${institute.city.name}`,
      `${institute.name} fees`,
      `${institute.name} reviews`,
      `${institute.name} admission`,
      `best coaching in ${institute.city.name}`,
      `${institute.categories[0]?.category.name} in ${institute.city.name}`
    ],
    openGraph: {
      title,
      description,
      images: [safeOgImage],
      type: 'website',
    }
  };
}

// ─── 2. PAGE COMPONENT ───────────────────────────────────────
export default async function InstitutePage({ params }: PageProps) {
  const { idSlug } = await params;
  const id = extractId(idSlug);
  
  // NOTE: Make sure getCachedInstituteById fetches all the new relations 
  // like batches, faqs, notablepersons, facilities, achievements etc.
  const institute = await getCachedInstituteById(id);

  if (!institute) notFound();

  const displayRating = institute.googleRating ?? institute.averageRating ?? 0;
  const displayReviewCount = institute.googleReviewCount ?? institute.reviewCount ?? 0;
  const isAlreadyClaimed = institute.managers && institute.managers.length > 0;
  const plan = institute.subscriptionPlan || "BASIC";

  const hasPremiumAccess = ["PREMIUM", "ULTRA", "VERIFIED"].includes(plan);
  const hasUltraAccess = ["ULTRA", "VERIFIED"].includes(plan);
  
  // Similar Institutes
  let similarInstitutes: any[] = [];
  if (institute.categories[0]?.categoryId && institute.cityId) {
    similarInstitutes = await prisma.institute.findMany({
      where: { cityId: institute.cityId, isActive: true, id: { not: institute.id }, categories: { some: { categoryId: institute.categories[0].categoryId } } },
      take: 3,
      orderBy: { averageRating: 'desc' },
      include: { city: true, categories: { include: { category: true } } }
    });
  }

  const safeSchemaImage = getSafeImageUrl(institute.logo, institute.imageUrl);
  const mainLogo = safeSchemaImage.replace("https://academyfind.com", ""); 

  const safeMapsUrl = institute.googleMapsUrl && !institute.googleMapsUrl.includes("key=") 
    ? institute.googleMapsUrl 
    : `https://www.google.com/maps/search/?api=1&query=$?q=${encodeURIComponent(`${institute.name}, ${institute.address || institute.city.name}`)}`;

  // ── 3. JSON-LD ──
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": institute.name,
    "image": safeSchemaImage,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": institute.address || "",
      "addressLocality": institute.city.name,
      "addressCountry": "IN"
    },
    "telephone": institute.phone || "",
    "url": institute.website || `https://academyfind.com/institute/${idSlug}`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": displayRating > 0 ? displayRating : 4.5,
      "reviewCount": displayReviewCount > 0 ? displayReviewCount : 1
    }
  };

  const validClassroomImages = institute.classroomImages?.filter(isCloudinaryImage) || [];
  const validGalleryImages = institute.gallery?.filter(isCloudinaryImage) || [];

  return (
    <main className="min-h-screen bg-slate-50">
      <Script
        id="schema-institute"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewTracker instituteId={institute.id} />

      <section className="relative overflow-hidden border-b bg-linear-to-b from-amber-50 via-white to-white">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-300/20 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 py-10">
          <Breadcrumb
            items={[
              { label: institute.categories[0]?.category.name || "Institute", href: `/${institute.categories[0]?.category.slug}` },
              { label: institute.city.name, href: `/${institute.categories[0]?.category.slug}/${institute.city.slug}` },
              { label: institute.name, href: "#" },
            ]}
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_350px]">
            <div>
              <div className="rounded-3xl border bg-white p-6 md:p-8 shadow-sm">
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-3xl border shadow-sm mx-auto md:mx-0 bg-white">
                    <Image src={mainLogo} alt={institute.name} width={128} height={128} className="h-full w-full object-contain p-2" />
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{institute.name}</h1>
                          {institute.isVerified && (
                            <p className="text-[0.65rem] font-bold text-blue-600 flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 mt-1">
                              <CheckCircle className="h-3.5 w-3.5"/> Verified
                            </p>
                          )}
                        </div>
                        <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-3">
                          <div className="flex flex-wrap justify-center gap-2">
                            {/* Mode Badge */}
                            {institute.mode && (
                                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800 tracking-wide uppercase">
                                  {institute.mode}
                                </span>
                            )}
                            {institute.categories.map((item: any) => (
                              <span key={item.category.id} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 tracking-wide uppercase">
                                {item.category.name}
                              </span>
                            ))}
                          </div>
                          {displayRating > 0 && institute.googlePlaceId && (
                            <Link
                              href={`${process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL}${institute.googlePlaceId}`}
                              prefetch={false}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                            >
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span>
                                {displayRating} ({displayReviewCount} Reviews)
                              </span>
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0 relative z-20">
                        <SaveButton instituteId={institute.id} />
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-left">
                      <Link href={safeMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 text-slate-600 hover:text-amber-600 transition group">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500 group-hover:scale-110 transition-transform" />
                        <span className="text-sm leading-relaxed underline-offset-4 group-hover:underline">{institute.address || institute.city.name}</span>
                      </Link>  
                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 pt-2 border-t border-slate-200/60 mt-1">
                        {institute.phone && <a href={`tel:${institute.phone}`} className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-amber-600"><Phone className="h-4 w-4 text-amber-500" /> {institute.phone}</a>}
                        {institute.email && <a href={`mailto:${institute.email}`} className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-amber-600"><Mail className="h-4 w-4 text-amber-500" /> {institute.email}</a>}
                        {institute.website && <a href={institute.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-amber-600"><Globe className="h-4 w-4 text-amber-500" /> Visit Website</a>}
                      </div>
                      
                      {/* Social Media Section */}
                      {(institute.facebookUrl || institute.instagramUrl || institute.twitterUrl || institute.youtubeUrl || institute.telegramUrl || institute.whatsappUrl) && (
                        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-200/60 mt-1">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-1">Follow:</span>
                          {institute.whatsappUrl && <a href={institute.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:scale-110 transition-transform"><FaWhatsapp className="h-5 w-5" /></a>}
                          {institute.instagramUrl && <a href={institute.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:scale-110 transition-transform"><FaInstagram className="h-5 w-5" /></a>}
                          {institute.facebookUrl && <a href={institute.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:scale-110 transition-transform"><FaFacebook className="h-5 w-5" /></a>}
                          {institute.youtubeUrl && <a href={institute.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:scale-110 transition-transform"><FaYoutube className="h-5 w-5" /></a>}
                          {institute.linkedinUrl && <a href={institute.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:scale-110 transition-transform"><FaLinkedin className="h-5 w-5" /></a>}
                          {institute.twitterUrl && <a href={institute.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:scale-110 transition-transform"><FaTwitter className="h-5 w-5" /></a>}
                          {institute.telegramUrl && <a href={institute.telegramUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:scale-110 transition-transform"><FaTelegram className="h-5 w-5" /></a>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Amenities Toggles */}
                <div className="mt-6 flex flex-wrap gap-2">
                    {institute.hasOnlineClasses && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-100 text-green-700 text-xs font-bold"><Check className="w-3.5 h-3.5"/> Online Classes</span>}
                    {institute.hasHostelFacility && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-100 text-green-700 text-xs font-bold"><Home className="w-3.5 h-3.5"/> Hostel Available</span>}
                    {institute.hasDemoClasses && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-100 text-green-700 text-xs font-bold"><Check className="w-3.5 h-3.5"/> Demo Classes</span>}
                    {institute.hasScholarship && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-100 text-green-700 text-xs font-bold"><Award className="w-3.5 h-3.5"/> Scholarships</span>}
                    {institute.hasCertification && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-100 text-green-700 text-xs font-bold"><Check className="w-3.5 h-3.5"/> Certification</span>}
                </div>

                {/* About Section */}
                {institute.description && (
                  <p className="mt-6 leading-8 text-amber-900 bg-amber-50/50 p-5 border border-amber-100 rounded-2xl text-sm md:text-base">
                    {institute.description}
                  </p>
                )}

                {!isAlreadyClaimed && (
                  <div className="mt-5 p-5 bg-amber-50 border border-amber-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-amber-900 font-bold flex items-center gap-1.5 text-sm md:text-base">
                        <CheckCircle className="w-4 h-4 text-amber-500" /> Are you the owner or representative?
                      </p>
                      <p className="text-amber-700 text-xs md:text-sm leading-relaxed">
                        Don't miss out on student leads! Claim your profile now to manage enquiries, update details, and get real-time insights on who visits or saves your page.
                      </p>
                    </div>

                    <Link href={`/institute/${institute.id}-${institute.slug}/claim`} className="shrink-0 w-full sm:w-auto">
                      <Button className="bg-amber-600 hover:bg-amber-700 text-white transition-colors px-6 font-bold w-full sm:w-auto rounded-xl cursor-pointer">
                        Claim Profile
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky CTA */}
            <div>
              <InstituteEnquiryForm instituteId={institute.id} feeInfo={institute.feeInfo} mapsUrl={safeMapsUrl} />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 space-y-16 relative z-10">
        
        {/* 🚀 QUICK FACTS & STATS */}
        <section>
          <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border bg-white p-5 shadow-sm flex flex-col justify-center items-center text-center">
              <Calendar className="w-6 h-6 text-amber-500 mb-2"/>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Established</p>
              <h3 className="mt-1 text-lg font-extrabold text-slate-800">{institute.establishedYear || "N/A"}</h3>
            </div>
            <div className="rounded-3xl border bg-white p-5 shadow-sm flex flex-col justify-center items-center text-center">
              <Users className="w-6 h-6 text-blue-500 mb-2"/>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Students</p>
              <h3 className="mt-1 text-lg font-extrabold text-slate-800">{institute.totalStudents ? `${institute.totalStudents}+` : "N/A"}</h3>
            </div>
            <div className="rounded-3xl border bg-white p-5 shadow-sm flex flex-col justify-center items-center text-center">
              <Building className="w-6 h-6 text-purple-500 mb-2"/>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Branches</p>
              <h3 className="mt-1 text-lg font-extrabold text-slate-800">{institute.totalBranches || 1}</h3>
            </div>
            <div className="rounded-3xl border bg-white p-5 shadow-sm flex flex-col justify-center items-center text-center">
              <IndianRupee className="w-6 h-6 text-emerald-500 mb-2"/>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Estimated Fees</p>
              <h3 className="mt-1 text-lg font-extrabold text-slate-800">
                  {institute.feeMin || institute.feeMax 
                    ? `${formatCurrency(institute.feeMin)} - ${formatCurrency(institute.feeMax)}` 
                    : "On Request"}
              </h3>
            </div>
          </div>
        </section>

        {/* 🚀 PROS & CONS */}
        {(institute.pros?.length > 0 || institute.cons?.length > 0) && (
            <section className="grid md:grid-cols-2 gap-6">
                {institute.pros?.length > 0 && (
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6">
                        <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2 mb-4">
                            <ThumbsUp className="w-5 h-5 text-emerald-600"/> Why Choose Us (Pros)
                        </h3>
                        <ul className="space-y-3">
                            {institute.pros.map((pro: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2.5 text-emerald-800 text-sm">
                                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5"/> {pro}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {institute.cons?.length > 0 && (
                    <div className="bg-red-50/30 border border-red-100 rounded-3xl p-6">
                        <h3 className="text-lg font-bold text-red-900 flex items-center gap-2 mb-4">
                            <ThumbsDown className="w-5 h-5 text-red-500"/> Things to Consider (Cons)
                        </h3>
                        <ul className="space-y-3">
                            {institute.cons.map((con: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2.5 text-red-800 text-sm">
                                    <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-red-400 mt-2"/> {con}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>
        )}

        {/* 🚀 COURSES & BATCHES */}
        {/*}
        {(!hasUltraAccess || (institute.batches && institute.batches.length > 0)) && (
            <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><BookOpen className="w-6 h-6" /></div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Courses & Batches</h2>
                    <p className="text-slate-500 text-sm mt-1">Explore available programs and fee structures.</p>
                  </div>
                </div>
                
                <div className={`relative rounded-3xl overflow-hidden ${!hasUltraAccess ? 'min-h-[350px]' : ''}`}>
                    {!hasUltraAccess && <LockedOverlay title="Courses" instituteId={institute.id} slug={institute.slug} />}
                    
                    <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-5 ${!hasUltraAccess ? 'opacity-40 blur-[4px] pointer-events-none select-none grayscale-[50%]' : ''}`}>
                        {hasUltraAccess ? (
                            institute.batches.map((batch: any) => (
                                <div key={batch.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-lg text-slate-900 leading-tight">{batch.name}</h3>
                                        {batch.mode && <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase">{batch.mode}</span>}
                                    </div>
                                    <div className="space-y-2.5 text-sm text-slate-600">
                                        {batch.duration && <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400"/> {batch.duration}</p>}
                                        {batch.fee && <p className="flex items-center gap-2 font-bold text-slate-800"><IndianRupee className="w-4 h-4 text-emerald-500"/> {formatCurrency(batch.fee)}</p>}
                                        {batch.timing && <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400"/> {batch.timing}</p>}
                                    </div>
                                </div>
                            ))
                        ) : (
                             // Placeholders
                            [1, 2, 3].map((i: number) => (
                                <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-40 flex flex-col gap-3">
                                    <div className="h-6 w-1/2 bg-amber-200 rounded"></div>
                                    <div className="h-4 w-1/3 bg-amber-200 rounded"></div>
                                    <div className="h-4 w-2/3 bg-amber-200 rounded"></div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        )}
        */}

        {/* 🚀 TEACHERS / FACULTY */}
       {/*
        {(!hasUltraAccess || (institute.teachers && institute.teachers.length > 0)) && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><Users className="w-6 h-6" /></div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Expert Faculty</h2>
                <p className="text-slate-500 text-sm mt-1">Learn from highly experienced educators.</p>
              </div>
            </div>

            <div className={`relative rounded-3xl overflow-hidden ${!hasUltraAccess ? 'min-h-[350px]' : ''}`}>
                {!hasUltraAccess && <LockedOverlay title="Faculty Profiles" instituteId={institute.id} slug={institute.slug} />}

                <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${!hasUltraAccess ? 'opacity-40 blur-[4px] pointer-events-none select-none grayscale-[50%]' : ''}`}>
                  {hasUltraAccess ? (
                      institute.teachers.map((teacher: any) => (
                        <div key={teacher.id} className="rounded-3xl border border-slate-200 bg-white p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                            {isCloudinaryImage(teacher.imageUrl) ? (
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
                      ))
                  ) : (
                      // Placeholders
                      [1, 2, 3].map((i: number) => (
                         <div key={i} className="rounded-3xl border border-slate-200 bg-white p-6 flex items-center gap-5">
                             <div className="h-16 w-16 rounded-full bg-amber-200"></div>
                             <div className="flex-1 space-y-2">
                                 <div className="h-5 w-3/4 bg-amber-200 rounded"></div>
                                 <div className="h-4 w-1/2 bg-amber-200 rounded"></div>
                             </div>
                         </div>
                      ))
                  )}
                </div>
            </div>
          </section>
        )} 
        */}

        {/* 🚀 NOTABLE ALUMNI */}
        {(!hasUltraAccess || (institute.notablepersons && institute.notablepersons.length > 0)) && (
            <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-pink-100 text-pink-600 rounded-xl"><Award className="w-6 h-6" /></div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Notable Alumni</h2>
                    <p className="text-slate-500 text-sm mt-1">Meet the successful students of this academy.</p>
                  </div>
                </div>
                
                {/* 🔥 FIX: min-h-[350px] added */}
                <div className={`relative rounded-3xl overflow-hidden pb-4 ${!hasUltraAccess ? 'min-h-[350px] flex flex-col justify-center' : ''}`}>
                    {!hasUltraAccess && <LockedOverlay title="Alumni Network" instituteId={institute.id} slug={institute.slug} />}

                    <div className={`flex overflow-x-auto gap-5 snap-x ${!hasUltraAccess ? 'opacity-40 blur-[4px] pointer-events-none select-none grayscale-[50%] overflow-hidden' : ''}`}>
                        {hasUltraAccess ? (
                            institute.notablepersons.map((person: any) => (
                                <div key={person.id} className="min-w-[220px] bg-white border border-slate-200 rounded-3xl p-5 shadow-sm snap-start flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-pink-100 mb-3">
                                        {isCloudinaryImage(person.imageUrl) ? (
                                            <Image src={person.imageUrl} alt={person.name} width={80} height={80} className="w-full h-full object-cover"/>
                                        ) : (
                                            <User className="w-10 h-10 text-slate-300 m-auto mt-5"/>
                                        )}
                                    </div>
                                    <h4 className="font-bold text-slate-900">{person.name}</h4>
                                    {person.placedAt && <p className="text-sm text-pink-600 font-semibold mt-1">{person.placedAt}</p>}
                                    {person.package && <p className="text-xs text-slate-500 mt-1 bg-slate-100 px-2 py-1 rounded-md">{person.package}</p>}
                                </div>
                            ))
                        ) : (
                             // Placeholders
                             [1, 2, 3, 4].map((i: number) => (
                                 <div key={i} className="min-w-[220px] bg-white border border-slate-200 rounded-3xl p-5 flex flex-col items-center">
                                     <div className="w-20 h-20 rounded-full bg-amber-200 mb-3"></div>
                                     <div className="h-5 w-2/3 bg-amber-200 rounded mb-2"></div>
                                     <div className="h-4 w-1/2 bg-amber-200 rounded"></div>
                                 </div>
                             ))
                        )}
                    </div>
                </div>
            </section>
        )}

        {/* 🚀 CLASSROOM IMAGES */}
        {(!hasUltraAccess || validClassroomImages.length > 0) && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Presentation className="w-6 h-6" /></div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Campus & Classrooms</h2>
                <p className="text-slate-500 text-sm mt-1">Take a look inside our modern learning environments.</p>
              </div>
            </div>

            {/* 🔥 FIX: min-h-[350px] added */}
            <div className={`relative rounded-3xl overflow-hidden ${!hasUltraAccess ? 'min-h-[350px]' : ''}`}>
                {!hasUltraAccess && <LockedOverlay title="Infrastructure Images" instituteId={institute.id} slug={institute.slug} />}

                <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${!hasUltraAccess ? 'opacity-40 blur-[4px] pointer-events-none select-none grayscale-[50%]' : ''}`}>
                  {hasUltraAccess ? (
                      validClassroomImages.map((url: string, idx: number) => (
                        <div key={idx} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm group cursor-pointer">
                          <img 
                            src={url} 
                            alt={`${institute.name} Classroom ${idx + 1}`} 
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                        </div>
                      ))
                  ) : (
                      // Placeholders
                      [1, 2, 3, 4].map((i: number) => (
                          <div key={i} className="aspect-[4/3] rounded-2xl bg-amber-200 border border-slate-300"></div>
                      ))
                  )}
                </div>
            </div>
          </section>
        )}

        {/* GALLERY IMAGES */}
        {(!hasUltraAccess || validGalleryImages.length > 0) && (
          <section className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Trophy className="w-6 h-6" /></div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Gallery</h2>
                <p className="text-slate-500 text-sm mt-1">Glimpses of events, results, and milestones.</p>
              </div>
            </div>

            {/* The Content Wrapper */}
            <div className="relative rounded-3xl overflow-hidden">
              
              {/* Overlay if not Ultra */}
              {!hasUltraAccess && (
                <LockedOverlay title="Gallery" instituteId={institute.id} slug={institute.slug} />
              )}

              {/* Grid Content (Actual or Mock for Blur) */}
              <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${!hasUltraAccess ? 'opacity-40 pointer-events-none select-none grayscale-[50%]' : ''}`}>
                
                {hasUltraAccess ? (
                  // Actual Images
                  validGalleryImages.map((url: string, idx: number) => (
                    <div key={idx} className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm group cursor-pointer">
                      <img src={url} alt={`Gallery ${idx}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  ))
                ) : (
                  // Mock Placeholders for Basic Plan (Creates a realistic blurred background)
                  [1, 2, 3, 4].map((i: number) => (
                    <div key={i} className="aspect-4/3 rounded-3xl bg-amber-200 animate-pulse border border-amber-500" />
                  ))
                )}

              </div>
            </div>
          </section>
        )}

        {/* YOUTUBE VIDEOS */}
        {(!hasUltraAccess || (institute.youtubeVideos && institute.youtubeVideos.length > 0)) && (
          <section className="relative mt-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl"><PlayCircle className="w-6 h-6" /></div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Featured Videos</h2>
                <p className="text-slate-500 text-sm mt-1">Watch demo classes and academy tours.</p>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden">
              
              {/* Overlay if not Ultra */}
              {!hasUltraAccess && (
                <LockedOverlay title="Video Gallery" instituteId={institute.id} slug={institute.slug} />
              )}

              <div className={`grid gap-6 sm:grid-cols-2 ${!hasUltraAccess ? 'opacity-40 pointer-events-none select-none grayscale-[50%]' : ''}`}>
                
                {hasUltraAccess ? (
                  // Actual Videos
                  institute.youtubeVideos.map((url: string, idx: number) => {
                    const videoId = getYouTubeId(url);
                    if (!videoId) return null;
                    return (
                      <div key={idx} className="aspect-video w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
                        <iframe src={`https://www.youtube.com/embed/${videoId}`} className="h-full w-full border-0" />
                      </div>
                    );
                  })
                ) : (
                  // Mock Placeholders for Basic Plan
                  [1, 2].map((i: number) => (
                    <div key={i} className="aspect-video w-full rounded-3xl bg-amber-200 flex items-center justify-center">
                      <PlayCircle className="w-12 h-12 text-black" />
                    </div>
                  ))
                )}

              </div>
            </div>
          </section>
        )}

        {/* 🚀 FAQs (ULTRA FEATURE) */}
       {(!hasUltraAccess || (institute.faqs && institute.faqs.length > 0)) && (
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <HelpCircle className="w-6 h-6 text-slate-700" />
                  <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
                </div>
                
                {/* 🔥 FIX: Yahan relative div lagaya hai heading ke neeche, with min-h */}
                <div className={`relative rounded-2xl overflow-hidden ${!hasUltraAccess ? 'min-h-[350px] flex flex-col justify-center' : ''}`}>
                    {!hasUltraAccess && <LockedOverlay title="FAQs" instituteId={institute.id} slug={institute.slug} />}
                    
                    <div className={`space-y-6 ${!hasUltraAccess ? 'opacity-30 blur-[4px] pointer-events-none select-none' : ''}`}>
                        {hasUltraAccess ? (
                            institute.faqs.map((faq: any) => (
                                <div key={faq.id}>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">Q. {faq.question}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
                                </div>
                            ))
                        ) : (
                            // Placeholders
                            [1, 2, 3].map((i: number) => (
                                <div key={i}>
                                    <div className="h-6 w-3/4 bg-amber-200 rounded mb-2"></div>
                                    <div className="h-4 w-full bg-amber-200 rounded mb-1"></div>
                                    <div className="h-4 w-5/6 bg-amber-200 rounded"></div>
                                </div>
                            ))
                        )}
                    </div>
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
              {similarInstitutes.map((simInst: any) => {
                const simDisplayLogo = isCloudinaryImage(simInst.imageUrl) 
                  ? simInst.imageUrl 
                  : (isCloudinaryImage(simInst.logo) ? simInst.logo : "/no_image/coaching_inst.PNG");

                return (
                  <Link 
                    href={`/institute/${simInst.id}-${simInst.slug}`} 
                    key={simInst.id} 
                    className="group flex flex-col rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                      <img 
                        src={simDisplayLogo} 
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
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}