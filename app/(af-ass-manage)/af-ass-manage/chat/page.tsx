import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminChatPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const reports = await prisma.messageReport.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      reason: true,
      description: true,
      status: true,
      createdAt: true,
      message: {
        select: {
          id: true,
          content: true,
          type: true,
          sender: { select: { name: true, username: true } },
          conversation: {
            select: {
              title: true,
              channelType: true,
              type: true,
              institute: { select: { name: true, id: true, slug: true } },
            },
          },
        },
      },
      reporter: { select: { name: true, username: true } },
    },
  });

  const pending = reports.filter((r: any) => r.status === "PENDING");
  const resolved = reports.filter((r: any) => r.status !== "PENDING");

  const REASON_LABELS: Record<string, string> = {
    SPAM: "🚫 Spam",
    INAPPROPRIATE: "🔞 Inappropriate",
    HARASSMENT: "😡 Harassment",
    MISINFORMATION: "❌ Misinformation",
    OTHER: "❓ Other",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Chat Reports</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review and action reported messages across the platform.
        </p>
      </div>

      {/* Pending */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
          🚨 Pending Reports
          {pending.length > 0 && (
            <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-bold text-white">
              {pending.length}
            </span>
          )}
        </h2>
        {pending.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400">
            No pending reports. 🎉
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((r) => (
              <ReportCard key={r.id} report={r} reasonLabels={REASON_LABELS} />
            ))}
          </div>
        )}
      </section>

      {/* Resolved */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-slate-800">
          ✅ Resolved ({resolved.length})
        </h2>
        <div className="space-y-3">
          {resolved.slice(0, 20).map((r) => (
            <ReportCard key={r.id} report={r} reasonLabels={REASON_LABELS} compact />
          ))}
        </div>
      </section>
    </div>
  );
}

function ReportCard({
  report,
  reasonLabels,
  compact = false,
}: {
  report: any;
  reasonLabels: Record<string, string>;
  compact?: boolean;
}) {
  const { message, reporter } = report;
  const context = message.conversation;

  return (
    <div
      className={`rounded-2xl border p-5 ${
        report.status === "PENDING"
          ? "border-rose-200 bg-rose-50/30"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
              {reasonLabels[report.reason] ?? report.reason}
            </span>
            <span className="text-xs text-slate-400">
              in{" "}
              {context.institute ? (
                <Link
                  href={`/institute/${context.institute.id}-${context.institute.slug}`}
                  className="font-semibold text-amber-700 hover:underline"
                >
                  {context.institute.name}
                </Link>
              ) : (
                <span className="font-semibold text-slate-700">DM</span>
              )}{" "}
              #{context.channelType ?? "channel"}
            </span>
          </div>
          <div className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <p className="text-xs text-slate-400">
              @{message.sender.username} said:
            </p>
            <p className="mt-0.5 text-sm text-slate-700">
              &quot;{message.content?.slice(0, 200)}
              {(message.content?.length ?? 0) > 200 ? "…" : ""}&quot;
            </p>
          </div>
          {!compact && report.description && (
            <p className="mt-2 text-xs text-slate-500 italic">
              Reporter notes: {report.description}
            </p>
          )}
          <p className="mt-2 text-xs text-slate-400">
            Reported by @{reporter.username} ·{" "}
            {new Date(report.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-lg px-2 py-0.5 text-xs font-bold border ${
            report.status === "PENDING"
              ? "border-rose-200 bg-rose-50 text-rose-600"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {report.status}
        </span>
      </div>
    </div>
  );
}
