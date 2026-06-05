import type { Metadata } from "next";
import { notFound } from "next/navigation";

import extractId from "@/lib/extractId";
import { getInstituteById } from "@/lib/institutes_id";
import Breadcrumb from "@/components/navigation/BreadCrumbs";
import Link from "next/link";
import InstituteMap from "@/components/maps/InstituteMap";

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
    title: `${institute?.name} | AcademyFind`,
    description:
      institute?.description ??
      `Learn more about ${institute?.name}.`,

    alternates: {
      canonical: `${process.env.BASE_URL}/inst/${idSlug}`,
    },
  };
}

export default async function InstitutePage({
  params,
}: PageProps) {

  const { idSlug } = await params;

  const id = extractId(idSlug);

  const institute = await getInstituteById(id);

  if (!institute) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",

    name: institute.name,

    description:
      institute.description ??
      "No description available",

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
              label:
                institute.categories[0]?.category.name,
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
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-amber-100 text-4xl font-bold text-amber-600">
                  {institute.name.charAt(0)}
                </div>

                <div>
                  <h1 className="text-4xl font-bold text-slate-900">
                    {institute.name}
                  </h1>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {institute.categories.map(
                      (item) => (
                        <span
                          key={item.category.id}
                          className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700"
                        >
                          {item.category.name}
                        </span>
                      )
                    )}
                  </div>

                  <p className="mt-4 text-slate-600">
                    📍 {institute.city.name}
                  </p>
                </div>
              </div>

              <p className="mt-8 leading-8 text-slate-600">
                {institute.description ??
                  "No description available."}
              </p>
            </div>
          </div>

          {/* Sticky CTA */}
          <div>
            <div className="sticky top-24 rounded-3xl border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">
                Get Admission Guidance
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Connect with experts and compare
                institutes before admission.
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
            <p className="text-sm text-slate-500">
              City
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              {institute.city.name}
            </h3>
          </div>

          {/* <div className="rounded-3xl border bg-white p-6">
            <p className="text-sm text-slate-500">
              Categories
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              {institute.categories.length}
            </h3>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <p className="text-sm text-slate-500">
              Reviews
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              Coming Soon
            </h3>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <p className="text-sm text-slate-500">
              Status
            </p>

            <h3 className="mt-2 text-2xl font-bold text-green-600">
              Active
            </h3>
          </div> */}
        </div>
      </section>

      {/* About */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold">
          About {institute.name}
        </h2>

        <div className="mt-6 rounded-3xl border bg-white p-8">
          <p className="leading-8 text-slate-600">
            {institute.description ??
              "No description available."}
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold">
          Coaching Categories
        </h2>

        <div className="mt-6 flex flex-wrap gap-3">
          {institute.categories.map((item) => (
            <span
              key={item.category.id}
              className="rounded-full border bg-white px-4 py-2"
            >
              {item.category.name}
            </span>
          ))}
        </div>
      </section>

      {/* Reviews Placeholder */}
      <section className="mt-16 rounded-[32px] bg-slate-900 p-10 text-white">
        <h2 className="text-3xl font-bold">
          Student Reviews
        </h2>

        <p className="mt-3 text-slate-300">
          Reviews and ratings will appear here
          once students start sharing their
          experiences.
        </p>
      </section>

      {/* CTA */}
      <section className="mt-16 rounded-[32px] bg-linear-to-r from-amber-400 to-amber-500 p-12 text-center">
        <h2 className="text-4xl font-bold text-black">
          Looking for the Right Institute?
        </h2>

        <p className="mt-4 text-black/80">
          Compare top coaching institutes,
          courses and reviews on AcademyFind.
        </p>

        <button className="mt-8 rounded-xl bg-black px-8 py-3 font-semibold text-white">
          Compare Institutes
        </button>

        <div>
            
          institute.latitude &&
            institute.longitude && (
              <section className="mt-16">
                <h2 className="mb-6 text-3xl font-bold">
                  Location
                </h2>

                <InstituteMap
                  name={institute.name}
                  latitude={institute.latitude}
                  longitude={institute.longitude}
                />
              </section>
            );
        
        </div>

        
      </section>
    </div>
  </main>
);
}