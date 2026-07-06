import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Check, X, UserMinus, Clock, BadgeCheck, Users, GraduationCap, BookOpen } from "lucide-react";
import { InviteMemberModal } from "@/components/manager/InviteMemberModal";

import { approveMembership, rejectMembership, removeMember } from "./actions";

type Props = { params: Promise<{ instituteId: string }> };

export default async function ManagerMembersPage({ params }: Props) {
  const { instituteId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const institute = await prisma.institute.findUnique({
    where: { id: instituteId },
    select: { id: true, name: true, slug: true },
  });
  if (!institute) notFound();

  const [pending, students, teachers] = await Promise.all([
    prisma.instituteMembership.findMany({
      where: { instituteId, status: "PENDING" },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        role: true,
        createdAt: true,
        user: { select: { id: true, name: true, username: true, image: true, email: true } },
        studentRecord: { select: { id: true, courseName: true, batchYear: true, bio: true } },
        teacherRecord: { select: { id: true, designation: true, teachingSubjects: true, bio: true } },
      },
    }),
    prisma.instituteMembership.findMany({
      where: { instituteId, role: "STUDENT", status: { in: ["ACTIVE", "ALUMNI"] } },
      orderBy: { joinedAt: "desc" },
      select: {
        id: true,
        role: true,
        status: true,
        joinedAt: true,
        user: { select: { id: true, name: true, username: true, image: true } },
        studentRecord: {
          select: {
            id: true,
            courseName: true,
            batchYear: true,
            passoutYear: true,
            isVerified: true,
            bio: true,
          },
        },
      },
    }),
    prisma.instituteMembership.findMany({
      where: { instituteId, role: "TEACHER", status: { in: ["ACTIVE"] } },
      orderBy: { joinedAt: "desc" },
      select: {
        id: true,
        role: true,
        status: true,
        joinedAt: true,
        user: { select: { id: true, name: true, username: true, image: true } },
        teacherRecord: {
          select: {
            id: true,
            designation: true,
            department: true,
            teachingSubjects: true,
            isVerified: true,
            isFeatured: true,
            bio: true,
          },
        },
      },
    }),
  ]);

  const approveFn = approveMembership.bind(null);
  const rejectFn = rejectMembership.bind(null);
  const removeFn = removeMember.bind(null);

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Members</h1>
            <p className="mt-1 text-sm text-slate-500">
            Manage student and teacher memberships for {institute.name}.
            </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/institute/${institute.id}-${institute.slug}/members`}
            className="text-sm font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            View public directory →
          </Link>
          <InviteMemberModal instituteId={instituteId} />
        </div>
      </div>

      {/* ── PENDING REQUESTS ── */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
          <Clock className="size-5 text-amber-500" /> Pending Requests
          {pending.length > 0 && (
            <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-bold text-white">
              {pending.length}
            </span>
          )}
        </h2>
        {pending.length === 0 ? (
          <EmptyCard text="No pending requests." />
        ) : (
          <div className="space-y-3">
            {pending.map((m: any) => (
              <div
                key={m.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex items-start gap-3">
                  <UserAvatar user={m.user} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">
                        {m.user.name ?? m.user.username}
                      </span>
                      <RoleBadge role={m.role} />
                    </div>
                    <p className="text-xs text-slate-400">@{m.user.username} · {m.user.email}</p>
                    {m.studentRecord && (
                      <p className="mt-1 text-sm text-slate-600">
                        {[m.studentRecord.courseName, m.studentRecord.batchYear ? `${m.studentRecord.batchYear} Batch` : null].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    {m.teacherRecord && (
                      <p className="mt-1 text-sm text-slate-600">
                        {m.teacherRecord.designation} · {m.teacherRecord.teachingSubjects.join(", ")}
                      </p>
                    )}
                    {(m.studentRecord?.bio || m.teacherRecord?.bio) && (
                      <p className="mt-2 text-xs text-slate-500 italic line-clamp-2">
                        {m.studentRecord?.bio ?? m.teacherRecord?.bio}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-slate-400">
                      Requested {m.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <form
                    action={async () => {
                      "use server";
                      await approveMembership(m.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-600"
                    >
                      <Check className="size-4" /> Approve
                    </button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await rejectMembership(m.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 hover:bg-rose-100"
                    >
                      <X className="size-4" /> Reject
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── STUDENTS ── */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
          <GraduationCap className="size-5 text-blue-500" /> Students
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            {students.length}
          </span>
        </h2>
        {students.length === 0 ? (
          <EmptyCard text="No students yet." />
        ) : (
          <div className="space-y-3">
            {students.map((m: any) => (
              <div
                key={m.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <UserAvatar user={m.user} size="sm" />
                  <div>
                    <span className="font-semibold text-slate-900">
                      {m.user.name ?? m.user.username}
                    </span>
                    <p className="text-xs text-slate-500">
                      {[
                        m.studentRecord?.courseName,
                        m.studentRecord?.batchYear ? `${m.studentRecord.batchYear} Batch` : null,
                        m.status,
                      ].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {m.studentRecord?.isVerified && (
                    <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      <BadgeCheck className="size-3" /> Verified
                    </span>
                  )}
                  <form
                    action={async () => {
                      "use server";
                      await removeMember(m.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                    >
                      <UserMinus className="size-3" /> Remove
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── TEACHERS ── */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
          <BookOpen className="size-5 text-amber-500" /> Faculty
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            {teachers.length}
          </span>
        </h2>
        {teachers.length === 0 ? (
          <EmptyCard text="No faculty yet." />
        ) : (
          <div className="space-y-3">
            {teachers.map((m: any) => (
              <div
                key={m.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <UserAvatar user={m.user} size="sm" />
                  <div>
                    <span className="font-semibold text-slate-900">
                      {m.user.name ?? m.user.username}
                    </span>
                    <p className="text-xs text-slate-500">
                      {m.teacherRecord?.designation ?? "Faculty"}
                      {m.teacherRecord?.department ? ` · ${m.teacherRecord.department}` : ""}
                    </p>
                    {m.teacherRecord?.teachingSubjects.length ? (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {m.teacherRecord.teachingSubjects.slice(0, 3).map((s: any) => (
                          <span key={s} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {m.teacherRecord?.isVerified && (
                    <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      <BadgeCheck className="size-3" /> Verified
                    </span>
                  )}
                  {m.teacherRecord?.isFeatured && (
                    <span className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                      ⭐ Featured
                    </span>
                  )}
                  <form
                    action={async () => {
                      "use server";
                      await removeMember(m.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                    >
                      <UserMinus className="size-3" /> Remove
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function UserAvatar({
  user,
  size = "md",
}: {
  user: { name: string | null; image: string | null; username: string | null };
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "size-9" : "size-11";
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full bg-slate-100 ${dim}`}
    >
      {user.image ? (
        <Image src={user.image} alt="" fill className="object-cover" />
      ) : (
        <span className="flex h-full items-center justify-center text-sm font-bold text-slate-400">
          {(user.name ?? "U").charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    STUDENT: "bg-blue-50 text-blue-700 border-blue-200",
    TEACHER: "bg-amber-50 text-amber-700 border-amber-200",
    MANAGER: "bg-violet-50 text-violet-700 border-violet-200",
  };
  return (
    <span
      className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles[role] ?? "bg-slate-100 text-slate-600"}`}
    >
      {role}
    </span>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
      {text}
    </div>
  );
}
