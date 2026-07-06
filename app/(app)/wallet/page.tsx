import { getSession } from "@/lib/auth/getSession";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { WalletTransactionType, WalletTransactionSource } from "@/app/generated/prisma/client";
import { Coins, CheckCircle, TrendingUp, Download, ArrowRight, UserPlus, FileText, Calendar, PenTool } from "lucide-react";
import Link from "next/link";

function getLevelInfo(balance: number) {
  if (balance >= 5000) return { name: "Platinum Member", icon: "💎", next: null, currentProgress: 100 };
  if (balance >= 2000) return { name: "Gold Member", icon: "🥇", next: 5000, currentProgress: (balance / 5000) * 100 };
  if (balance >= 500) return { name: "Silver Member", icon: "🥈", next: 2000, currentProgress: (balance / 2000) * 100 };
  return { name: "Bronze Member", icon: "🥉", next: 500, currentProgress: (balance / 500) * 100 };
}

function getSourceIcon(source: WalletTransactionSource) {
  switch(source) {
    case "DAILY_LOGIN": return "☀️";
    case "PROFILE_COMPLETION": return "👤";
    case "REVIEW": return "⭐";
    case "BONUS": return "🎁";
    case "REFERRAL": return "👥";
    case "PURCHASE": return "🛒";
    default: return "🪙";
  }
}

export default async function WalletPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const wallet = await prisma.userWallet.findUnique({
    where: { userId: session.user.id },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
        take: 50,
      }
    }
  });

  if (!wallet) return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">My Wallet</h1>
      <Card>
        <CardContent className="py-10 text-center">
          <Coins className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">You haven't earned any coins yet.</p>
        </CardContent>
      </Card>
    </div>
  );

  const levelInfo = getLevelInfo(wallet.balance);
  const thisMonthEarned = wallet.transactions
    .filter((tx: any) => tx.type === "CREDIT" && tx.createdAt.getMonth() === new Date().getMonth())
    .reduce((sum: number, tx: any) => sum + tx.amount, 0);

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4 space-y-8">
      {/* Hero Card */}
      <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-5xl font-black text-amber-600 flex items-center gap-3">
                🪙 {wallet.balance.toLocaleString()}
              </div>
              <p className="text-amber-800 font-medium mt-1">AcademyFind Coins</p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-amber-100">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Earned</p>
                <p className="text-lg font-bold text-slate-800">{wallet.lifetimeEarned.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-amber-100">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Spent</p>
                <p className="text-lg font-bold text-slate-800">{wallet.lifetimeSpent.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-amber-100">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">This Month</p>
                <p className="text-lg font-bold text-green-600">+{thisMonthEarned.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100 min-w-[300px]">
            <p className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
              Level: {levelInfo.icon} {levelInfo.name}
            </p>
            <Progress value={levelInfo.currentProgress} className="h-3 mb-2 bg-slate-100" />
            <div className="flex justify-between text-xs font-medium text-slate-500 mb-4">
              <span>{wallet.balance.toLocaleString()} 🪙</span>
              {levelInfo.next && <span>{levelInfo.next.toLocaleString()} 🪙</span>}
            </div>
            {levelInfo.next && (
              <p className="text-xs text-amber-700 font-medium bg-amber-50 p-2 rounded-lg inline-block">
                {levelInfo.next - wallet.balance} coins to {getLevelInfo(levelInfo.next).name}
              </p>
            )}
            <p className="text-[10px] text-slate-400 mt-4 text-center">
              Tiers: Bronze(0) Silver(500) Gold(2000) Platinum(5000)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Transaction History */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Transaction History</h2>
          
          <div className="bg-white border rounded-2xl overflow-hidden">
            <div className="divide-y">
              {wallet.transactions.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No transactions yet.</div>
              ) : (
                wallet.transactions.map((tx: any) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${tx.type === "CREDIT" ? "bg-green-500" : "bg-red-500"}`} />
                      <div>
                        <p className="font-semibold text-slate-800 flex items-center gap-2">
                          <span>{getSourceIcon(tx.source)}</span> {tx.description || tx.source}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {tx.createdAt.toLocaleDateString()} at {tx.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className={`font-bold ${tx.type === "CREDIT" ? "text-green-600" : "text-slate-800"}`}>
                      {tx.type === "CREDIT" ? "+" : "-"}{tx.amount}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Earn & Spend */}
        <div className="lg:col-span-2 space-y-6">
          {/* Earn Card */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="bg-slate-50 border-b rounded-t-2xl pb-4">
              <CardTitle className="text-lg">Ways to Earn 🪙</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {[
                  { icon: PenTool, label: "Publish a blog", amount: "+50" },
                  { icon: UserPlus, label: "Refer a friend", amount: "+100" },
                  { icon: CheckCircle, label: "Complete your profile", amount: "+30", oneTime: true },
                  { icon: Calendar, label: "Attend a demo class", amount: "+15" },
                  { icon: TrendingUp, label: "Answer gets upvoted", amount: "+5" },
                  { icon: Coins, label: "Daily login", amount: "+2" },
                ].map((item: any, i: number) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{item.label}</p>
                        {item.oneTime && <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">One-time</p>}
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0">
                      {item.amount}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Spend Card */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="bg-slate-50 border-b rounded-t-2xl pb-4">
              <CardTitle className="text-lg">Redeem 🎁</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Featured in directory</p>
                      <p className="text-sm text-slate-600 mt-1">Appear higher in institute's member list.</p>
                      <p className="text-xs font-semibold text-amber-600 mt-2">Cost: 50 coins/month</p>
                      <button disabled className="mt-3 w-full bg-slate-100 text-slate-400 font-semibold text-sm py-2 rounded-lg cursor-not-allowed">
                        Coming Soon
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Unlock premium resources</p>
                      <p className="text-sm text-slate-600 mt-1">Download gated study materials and notes.</p>
                      <p className="text-xs font-semibold text-amber-600 mt-2">Cost: varies (10-50 coins)</p>
                      <button disabled className="mt-3 w-full bg-slate-100 text-slate-400 font-semibold text-sm py-2 rounded-lg cursor-not-allowed">
                        Coming Soon
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
