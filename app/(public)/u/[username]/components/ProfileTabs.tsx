"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Clock,
  Eye,
  GraduationCap,
  Star,
} from "lucide-react";

import type { CompletePublicProfile } from "@/lib/profile/queries";
import { MembershipCard } from "@/app/(public)/u/[username]/components/MembershipCard";

type Tab = "Overview" | "Student" | "Teacher" | "Blogs" | "Reviews" | "Activity";

const TABS: Tab[] = ["Overview", "Student", "Teacher", "Blogs", "Reviews", "Activity"];

export function ProfileTabs({
  profile,
  isOwnProfile = false,
}: {
  profile: CompletePublicProfile;
  isOwnProfile?: boolean;
}) {
  const [active, setActive] = useState<Tab>("Overview");

  return (
    <section>
      {/* Tab bar */}
      <div className="mb-5 flex gap-0 overflow-x-auto border-b border-slate-200">
        {TABS.map((tab: Tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              active === tab
                ? "border-amber-400 text-amber-700"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {active === "Overview" && <OverviewTab profile={profile} />}
      {active === "Student" && <StudentTab profile={profile} isOwnProfile={isOwnProfile} />}
      {active === "Teacher" && <TeacherTab profile={profile} isOwnProfile={isOwnProfile} />}
      {active === "Blogs" && <BlogsTab profile={profile} isOwnProfile={isOwnProfile} />}
      {active === "Reviews" && <ReviewsTab profile={profile} />}
      {active === "Activity" && <ActivityTab />}
    </section>
  );
}

/* ─── Overview ─────────────────────────────────────────── */
function OverviewTab({ profile }: { profile: CompletePublicProfile }) {
  const studentMemberships = profile.memberships.filter(
    (m) => m.role === "STUDENT",
  );
  const teacherMemberships = profile.memberships.filter(
    (m) => m.role === "TEACHER",
  );
  const managerMemberships = profile.memberships.filter(
    (m) => m.role === "MANAGER",
  );

  if (!profile.memberships.length) {
    return <Empty text="No institute affiliations yet." />;
  }

  return (
    <div className="space-y-8">
      {studentMemberships.length > 0 && (
        <div>
          <SectionHeader icon={GraduationCap} title="Studying At" />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {studentMemberships.map((m: any) => (
              <MembershipCard key={m.id} membership={m} />
            ))}
          </div>
        </div>
      )}
      {teacherMemberships.length > 0 && (
        <div>
          <SectionHeader icon={BookOpen} title="Teaching At" />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {teacherMemberships.map((m: any) => (
              <MembershipCard key={m.id} membership={m} />
            ))}
          </div>
        </div>
      )}
      {managerMemberships.length > 0 && (
        <div>
          <SectionHeader icon={Building2} title="Managing" />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {managerMemberships.map((m: any) => (
              <MembershipCard key={m.id} membership={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Student ───────────────────────────────────────────── */
function StudentTab({
  profile,
  isOwnProfile,
}: {
  profile: CompletePublicProfile;
  isOwnProfile: boolean;
}) {
  const sp = profile.studentProfile;
  if (!sp?.isVisible) {
    return (
      <Empty text="Not connected as a student anywhere yet.">
        {isOwnProfile && (
          <Link
            href="/settings/profile"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-700"
          >
            Set up student profile <ArrowRight className="size-4" />
          </Link>
        )}
      </Empty>
    );
  }

  const memberships = profile.memberships.filter((m) => m.role === "STUDENT");

  return (
    <div className="space-y-5">
      {/* Global student profile card */}
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          {sp.headline ?? "Student Profile"}
        </h2>
        {sp.bio && (
          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
            {sp.bio}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {sp.targetExam && (
            <Pill label={`🎯 ${sp.targetExam}`} />
          )}
          {sp.currentClass && (
            <Pill label={`📚 ${sp.currentClass}`} />
          )}
        </div>
      </article>

      {/* Per-institute records */}
      {memberships.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {memberships.map((m: any) => (
            <MembershipCard key={m.id} membership={m} />
          ))}
        </div>
      ) : (
        <Empty text="Not enrolled at any institute yet." />
      )}
    </div>
  );
}

/* ─── Teacher ───────────────────────────────────────────── */
function TeacherTab({
  profile,
  isOwnProfile,
}: {
  profile: CompletePublicProfile;
  isOwnProfile: boolean;
}) {
  const tp = profile.teacherProfile;
  if (!tp?.isVisible) {
    return (
      <Empty text="No public teacher profile yet.">
        {isOwnProfile && (
          <Link
            href="/settings/profile"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-700"
          >
            Set up teacher profile <ArrowRight className="size-4" />
          </Link>
        )}
      </Empty>
    );
  }

  const memberships = profile.memberships.filter((m) => m.role === "TEACHER");

  return (
    <div className="space-y-5">
      {/* Global teacher profile card */}
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">
            {tp.headline ?? "Teacher Profile"}
          </h2>
          {tp.isVerified && (
            <span className="shrink-0 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
              ✓ Verified
            </span>
          )}
        </div>
        {tp.bio && (
          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
            {tp.bio}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {tp.qualification && <Pill label={`🎓 ${tp.qualification}`} />}
          {tp.experience && <Pill label={`⏱ ${tp.experience}`} />}
        </div>
        {tp.subjects.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Subjects
            </p>
            <div className="flex flex-wrap gap-2">
              {tp.subjects.map((s: string) => (
                <Pill key={s} label={s} color="amber" />
              ))}
            </div>
          </div>
        )}
        {tp.languages.length > 0 && (
          <div className="mt-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Languages
            </p>
            <div className="flex flex-wrap gap-2">
              {tp.languages.map((l: string) => (
                <Pill key={l} label={l} />
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Per-institute records */}
      {memberships.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {memberships.map((m: any) => (
            <MembershipCard key={m.id} membership={m} />
          ))}
        </div>
      ) : (
        <Empty text="Not teaching at any institute yet." />
      )}
    </div>
  );
}

/* ─── Blogs ─────────────────────────────────────────────── */
function BlogsTab({
  profile,
  isOwnProfile,
}: {
  profile: CompletePublicProfile;
  isOwnProfile: boolean;
}) {
  if (!profile.blogs.length) {
    return (
      <Empty text="No published articles yet.">
        {isOwnProfile && (
          <Link
            href="/blog/write"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-700"
          >
            Write an article <ArrowRight className="size-4" />
          </Link>
        )}
      </Empty>
    );
  }

  return (
    <div className="space-y-3">
      {profile.blogs.map((post: any) => (
        <Link
          key={post.id}
          href={`/blog/${post.slug}`}
          className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt=""
              width={96}
              height={80}
              className="h-20 w-24 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-2xl">
              ✍️
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-slate-950 line-clamp-2">
              {post.title}
            </p>
            {post.excerpt && (
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                {post.excerpt}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              {post.category && (
                <span className="rounded-md bg-amber-50 px-2 py-0.5 font-semibold text-amber-700">
                  {post.category.name}
                </span>
              )}
              {post.readingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3" /> {post.readingTime} min read
                </span>
              )}
              <span className="flex items-center gap-1">
                <Eye className="size-3" /> {post.viewCount} views
              </span>
            </div>
          </div>
        </Link>
      ))}
      <Link
        href={`/u/${profile.username}/blogs`}
        className="inline-flex items-center gap-1 font-semibold text-amber-700 hover:text-amber-800"
      >
        View all articles <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}

/* ─── Reviews ───────────────────────────────────────────── */
function ReviewsTab({ profile }: { profile: CompletePublicProfile }) {
  if (!profile.reviews.length) {
    return <Empty text="No approved reviews yet." />;
  }

  return (
    <div className="space-y-3">
      {profile.reviews.map((review: any) => (
        <article
          key={review.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start gap-3">
            {review.institute.logo ? (
              <Image
                src={review.institute.logo}
                alt=""
                width={28}
                height={28}
                className="size-7 shrink-0 rounded-lg object-contain"
              />
            ) : (
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-sm">
                🏫
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <Link
                  href={`/institute/${review.institute.slug}`}
                  className="truncate font-semibold text-slate-900 hover:text-amber-700"
                >
                  {review.institute.name}
                  {review.institute.city && (
                    <span className="font-normal text-slate-500">
                      {" "}
                      · {review.institute.city.name}
                    </span>
                  )}
                </Link>
                <div className="flex shrink-0 gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i: number) => (
                    <Star
                      key={i}
                      className={`size-3.5 ${
                        i < review.rating ? "fill-amber-400" : "fill-slate-200 text-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-3">
                  {review.comment}
                </p>
              )}
              <p className="mt-2 text-xs text-slate-400">
                {review.createdAt.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </article>
      ))}
      <Link
        href={`/u/${profile.username}/reviews`}
        className="inline-flex items-center gap-1 font-semibold text-amber-700 hover:text-amber-800"
      >
        View all reviews <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}

/* ─── Activity (placeholder) ────────────────────────────── */
function ActivityTab() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <p className="text-2xl">🕐</p>
      <p className="mt-3 font-semibold text-slate-700">Activity feed coming soon</p>
      <p className="mt-1 text-sm text-slate-400">
        Your recent interactions will appear here.
      </p>
    </div>
  );
}

/* ─── Shared helpers ─────────────────────────────────────── */
function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: typeof GraduationCap;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-5 text-amber-500" />
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
    </div>
  );
}

function Pill({
  label,
  color = "slate",
}: {
  label: string;
  color?: "slate" | "amber";
}) {
  const styles =
    color === "amber"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : "bg-slate-100 text-slate-700 border-slate-200";
  return (
    <span
      className={`rounded-lg border px-2.5 py-1 text-sm ${styles}`}
    >
      {label}
    </span>
  );
}

function Empty({
  text,
  children,
}: {
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
      <p>{text}</p>
      {children}
    </div>
  );
}
