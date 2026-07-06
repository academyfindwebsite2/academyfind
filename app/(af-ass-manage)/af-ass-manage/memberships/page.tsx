import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Check, X, Clock, BadgeCheck, Users, GraduationCap, BookOpen, Building2 } from "lucide-react";

export default async function AdminMembershipsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const [pending, recent] = await Promise.all([
    prisma.instituteMembership.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      take: 50,
      select: {
        id: true,
        role: true,
        status: true,
        createdAt: true,
        user: { select: { id: true, name: true, username: true, image: true, email: true } },
        institute: { select: { id: true, name: true, slug: true } },
        studentRecord: { select: { courseName: true, batchYear: true } },
        teacherRecord: { select: { designation: true, teachingSubjects: true } },
      },
    }),
    prisma.instituteMembership.findMany({
      where: { status: { in: ["ACTIVE", "ALUMNI", "REMOVED", "REJECTED"] } },
      orderBy: { updatedAt: "desc" },
      take: 30,
      select: {
        id: true,
        role: true,
        status: true,
        updatedAt: true,
        user: { select: { name: true, username: true, image: true } },
        institute: { select: { name: true, slug: true, id: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">All Memberships</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage student and teacher memberships across all institutes.
        </p>
      </div>

      {/* Pending */}
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
                className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-start gap-3">
                  <UserAvatar user={m.user} />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900">
                        {m.user.name ?? m.user.username}
                      </span>
                      <RoleBadge role={m.role} />
                      <span className="text-slate-400 text-xs">at</span>
                      <Link
                        href={`/institute/${m.institute.id}-${m.institute.slug}`}
                        className="text-sm font-semibold text-amber-700 hover:underline"
                      >
                        {m.institute.name}
                      </Link>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {m.user.email} · {m.createdAt.toLocaleDateString("en-IN")}
                    </p>
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
                  </div>
                </div>
                <div className="flex gap-3 sm:shrink-0">
                  <form
                    action={async () => {
                      "use server";
                      const { handleMembershipApproval } = await import(
                        "@/lib/membership/handleApproval"
                      );
                      await handleMembershipApproval(m.id, session.user.id);
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
                      const { prisma } = await import("@/lib/prisma");
                      await prisma.instituteMembership.update({
                        where: { id: m.id },
                        data: { status: "REJECTED", isActive: false },
                      });
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

      {/* Recent activity */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-slate-800">Recent Activity</h2>
        <div className="space-y-2">
          {recent.map((m: any) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3"
            >
              <div className="flex items-center gap-3">
                <UserAvatar user={m.user} size="sm" />
                <div>
                  <span className="font-medium text-slate-900">
                    {m.user.name ?? m.user.username}
                  </span>{" "}
                  <span className="text-slate-400">at</span>{" "}
                  <Link
                    href={`/institute/${m.institute.id}-${m.institute.slug}`}
                    className="text-sm font-medium text-amber-700 hover:underline"
                  >
                    {m.institute.name}
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RoleBadge role={m.role} />
                <StatusBadge status={m.status} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function UserAvatar({
  user,
  size = "md",
}: {
  user: { name: string | null; image: string | null };
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "size-8" : "size-10";
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-full bg-slate-100 ${dim}`}>
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700",
    ALUMNI: "bg-slate-100 text-slate-500",
    PENDING: "bg-amber-50 text-amber-700",
    REMOVED: "bg-rose-50 text-rose-600",
    REJECTED: "bg-rose-50 text-rose-600",
  };
  return (
    <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${styles[status] ?? ""}`}>
      {status}
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
