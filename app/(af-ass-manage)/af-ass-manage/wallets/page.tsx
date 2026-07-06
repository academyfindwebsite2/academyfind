import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import Image from "next/image";

export default async function AdminWalletsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const wallets = await prisma.userWallet.findMany({
    orderBy: { balance: "desc" },
    take: 100,
    select: {
      id: true,
      balance: true,
      lifetimeEarned: true,
      lifetimeSpent: true,
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          email: true,
        },
      },
    },
  });

  const totalBalance = wallets.reduce((sum: number, w: any) => sum + w.balance, 0);
  const totalEarned = wallets.reduce((sum: number, w: any) => sum + w.lifetimeEarned, 0);
  const totalSpent = wallets.reduce((sum: number, w: any) => sum + w.lifetimeSpent, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Wallets</h1>
        <p className="mt-1 text-sm text-slate-500">
          Platform-wide wallet balances and transaction overview.
        </p>
      </div>

      {/* Platform stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Coins Circulating"
          value={totalBalance.toLocaleString("en-IN")}
          icon={<Wallet className="size-5 text-amber-600" />}
          color="amber"
        />
        <StatCard
          label="Total Ever Earned"
          value={totalEarned.toLocaleString("en-IN")}
          icon={<ArrowDownLeft className="size-5 text-emerald-600" />}
          color="emerald"
        />
        <StatCard
          label="Total Ever Spent"
          value={totalSpent.toLocaleString("en-IN")}
          icon={<ArrowUpRight className="size-5 text-rose-600" />}
          color="rose"
        />
      </div>

      {/* Wallet table */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-slate-800">
          Top Wallets ({wallets.length})
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-bold uppercase text-slate-400">
                  User
                </th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase text-slate-400">
                  Balance
                </th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase text-slate-400">
                  Earned
                </th>
                <th className="px-5 py-3 text-right text-xs font-bold uppercase text-slate-400">
                  Spent
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {wallets.map((w: any) => (
                <tr key={w.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="flex items-center gap-3 px-5 py-3">
                    <div className="relative size-8 shrink-0 overflow-hidden rounded-full bg-slate-100">
                      {w.user.image ? (
                        <Image
                          src={w.user.image}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-xs font-bold text-slate-400">
                          {(w.user.name ?? "U").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {w.user.name ?? w.user.username}
                      </p>
                      <p className="text-xs text-slate-400">{w.user.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-slate-900">
                    {w.balance.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3 text-right text-emerald-600 font-semibold">
                    +{w.lifetimeEarned.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3 text-right text-rose-500 font-semibold">
                    −{w.lifetimeSpent.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: "amber" | "emerald" | "rose";
}) {
  const bg = {
    amber: "bg-amber-50 border-amber-100",
    emerald: "bg-emerald-50 border-emerald-100",
    rose: "bg-rose-50 border-rose-100",
  };
  return (
    <div className={`rounded-2xl border p-5 ${bg[color]}`}>
      <div className="mb-3">{icon}</div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}
