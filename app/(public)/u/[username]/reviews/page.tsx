import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import Image from "next/image";

import { getPublicProfile } from "@/lib/profile/queries";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await getPublicProfile(username);
  if (!profile) return { title: "Not found" };
  return {
    title: `Reviews by ${profile.name ?? `@${username}`} | AcademyFind`,
    description: `All institute reviews written by @${username} on AcademyFind.`,
  };
}

export default async function UserReviewsPage({ params }: Props) {
  const { username } = await params;
  const profile = await getPublicProfile(username);
  if (!profile) notFound();

  const reviews = await prisma.review.findMany({
    where: { userId: profile.id, status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      institute: {
        select: {
          name: true,
          slug: true,
          id: true,
          logo: true,
          city: { select: { name: true } },
        },
      },
    },
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href={`/u/${username}`}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="size-4" /> Back to {profile.name ?? `@${username}`}
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-slate-950">
        Reviews by {profile.name ?? `@${username}`}
      </h1>
      <p className="mt-1 text-slate-500">
        {reviews.length} approved review{reviews.length !== 1 ? "s" : ""}
      </p>

      {reviews.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
          No reviews written yet.
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start gap-3">
                {review.institute.logo ? (
                  <Image
                    src={review.institute.logo}
                    alt=""
                    width={32}
                    height={32}
                    className="size-8 rounded-lg object-contain"
                  />
                ) : (
                  <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-sm">
                    🏫
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={`/institute/${review.institute.id}-${review.institute.slug}`}
                      className="font-semibold text-slate-900 hover:text-amber-700"
                    >
                      {review.institute.name}
                      {review.institute.city && (
                        <span className="font-normal text-slate-500">
                          {" "}
                          · {review.institute.city.name}
                        </span>
                      )}
                    </Link>
                    <div className="flex gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-4 ${
                            i < review.rating
                              ? "fill-amber-400"
                              : "fill-slate-200 text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {review.comment}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-slate-400">
                    {review.createdAt.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
