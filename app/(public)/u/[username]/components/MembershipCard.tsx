import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck } from "lucide-react";

import type { CompletePublicProfile } from "@/lib/profile/queries";

type Membership = any;

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ALUMNI: "bg-slate-100 text-slate-500 border-slate-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  REMOVED: "bg-rose-50 text-rose-600 border-rose-200",
  REJECTED: "bg-rose-50 text-rose-600 border-rose-200",
};

export function MembershipCard({ membership }: { membership: Membership }) {
  const record = membership.studentRecord ?? membership.teacherRecord;
  const title =
    membership.studentRecord?.courseName ??
    membership.teacherRecord?.designation ??
    null;
  const currentYear = new Date().getFullYear();
  const isCurrent =
    membership.studentRecord?.batchYear === currentYear &&
    membership.status === "ACTIVE";
  const batches =
    membership.studentRecord?.batchMemberships.map(( batch : any ) => batch) ??
    membership.teacherRecord?.batchMemberships.map(( batch : any) => batch) ??
    [];

  const statusStyle =
    STATUS_STYLES[membership.status] ?? STATUS_STYLES.ALUMNI;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Institute header */}
      <div className="flex items-start gap-3">
        <div className="relative size-11 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
          {membership.institute.logo ? (
            <Image
              src={membership.institute.logo}
              alt=""
              fill
              className="object-contain p-1"
            />
          ) : (
            <span className="flex h-full items-center justify-center text-lg">
              🏫
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-slate-950">
            {membership.institute.name}
          </h3>
          <p className="text-xs text-slate-500">
            {membership.institute.city.name}, {membership.institute.city.state}
          </p>
        </div>
        <span className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
          {membership.role}
        </span>
      </div>

      {/* Course / designation */}
      {title ? (
        <div className="mt-3 flex items-center gap-2">
          <span className="font-medium text-slate-800">{title}</span>
          {isCurrent ? (
            <span className="rounded-lg bg-amber-400 px-2 py-0.5 text-xs font-semibold text-slate-900">
              CURRENT
            </span>
          ) : null}
        </div>
      ) : isCurrent ? (
        <div className="mt-3">
          <span className="rounded-lg bg-amber-400 px-2 py-0.5 text-xs font-semibold text-slate-900">
            CURRENT
          </span>
        </div>
      ) : null}

      {/* Batch year for student */}
      {membership.studentRecord?.batchYear && (
        <p className="mt-1 text-xs text-slate-500">
          Batch {membership.studentRecord.batchYear}
          {membership.studentRecord.passoutYear &&
            ` → ${membership.studentRecord.passoutYear}`}
        </p>
      )}

      {/* Status + verified badges */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span
          className={`rounded-lg border px-2 py-0.5 text-xs font-semibold ${statusStyle}`}
        >
          {membership.status.charAt(0) +
            membership.status.slice(1).toLowerCase()}
        </span>
        {record?.isVerified ? (
          <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
            <BadgeCheck className="size-3" /> Verified
          </span>
        ) : null}
        {membership.joinedAt && (
          <span className="text-xs text-slate-400">
            Joined{" "}
            {membership.joinedAt.toLocaleDateString("en-IN", {
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
      </div>

      {/* Batches */}
      {batches.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {batches.map((batch: any) => (
            <span
              key={batch.id}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600"
            >
              {batch.name}
            </span>
          ))}
        </div>
      ) : null}

      {/* View Institute link */}
      <Link
        href={`/institute/${membership.institute.id}-${membership.institute.slug}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-amber-700 hover:text-amber-800"
      >
        View Institute <ArrowUpRight className="size-4" />
      </Link>
    </article>
  );
}
