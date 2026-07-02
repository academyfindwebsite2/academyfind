// components/blog/author/AuthorStats.tsx

import {
  Eye,
  FileText,
  Heart,
  MessageCircle,
  Users,
  CalendarDays,
} from "lucide-react";

type AuthorStatsProps = {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  followerCount: number;
  joinedAt: Date;
};

export default function AuthorStats({
  totalPosts,
  totalViews,
  totalLikes,
  totalComments,
  followerCount,
  joinedAt,
}: AuthorStatsProps) {
  const stats = [
    {
      label: "Articles",
      value: totalPosts.toLocaleString(),
      icon: FileText,
      color: "bg-blue-50 text-blue-600 border-blue-100/50",
    },
    {
      label: "Views",
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
    },
    {
      label: "Likes",
      value: totalLikes.toLocaleString(),
      icon: Heart,
      color: "bg-rose-50 text-rose-600 border-rose-100/50",
    },
    {
      label: "Comments",
      value: totalComments.toLocaleString(),
      icon: MessageCircle,
      color: "bg-violet-50 text-violet-600 border-violet-100/50",
    },
    {
      label: "Followers",
      value: followerCount.toLocaleString(),
      icon: Users,
      color: "bg-amber-50 text-amber-600 border-amber-100/50",
    },
    {
      label: "Joined",
      value: joinedAt.toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      }),
      icon: CalendarDays,
      color: "bg-slate-50 text-slate-600 border-slate-100/50",
    },
  ];

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">
      <div className="mb-6">
        <h2 className="text-lg font-extrabold text-slate-800">
          Author Statistics
        </h2>

        <p className="mt-1 text-xs text-slate-400 leading-relaxed">
          Overall publishing performance and reader engagement.
        </p>
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-2">
        {stats.map((stat: any) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-100 bg-slate-50/20 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200 hover:bg-white hover:shadow-md hover:shadow-slate-100/50"
            >
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl border ${stat.color}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                {stat.value}
              </h3>

              <p className="mt-0.5 text-xs font-semibold text-slate-400 tracking-wide uppercase">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}