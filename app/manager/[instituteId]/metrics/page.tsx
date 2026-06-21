import AnalyticsDashboardClient from '@/components/manager/MetricsDashBoard';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { Lock } from 'lucide-react';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function InstituteAnalyticsPage({ 
  params 
}: { 
  params: Promise<{ instituteId: string }> 
}) {
const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  const { instituteId } = await params;

    if (!instituteId) {
        return <div className="p-8 font-bold text-red-500">Error: Invalid URL, ID is missing!</div>;
      }
  // 1. Fetch Institute with counts to verify ownership and tier
  const institute = await prisma.institute.findUnique({
    where: { id: instituteId },
    select: {
      id: true,
      name: true,
      subscriptionPlan: true,
      viewCount: true,
      _count: {
        select: {
          shortlistedBy: true,
          enquiries: true,
          reviews: true,
        }
      }
    }
  });

  if (!institute) return <div className="p-8 text-center font-bold">Institute not found!</div>;

  if (institute.subscriptionPlan === "BASIC" || institute.subscriptionPlan === "VERIFIED") {
        return (
            <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                    <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Audience Analytics Locked</h2>
                <p className="text-slate-500 max-w-md mb-6">
                    Want to see exactly how many students view and save your academy profile? Upgrade to the <b>Ultra Plan</b> for deep insights.
                </p>
                <Link href={`/manager/${instituteId}/subscription`} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition">
                    Get Ultra Plan
                </Link>
            </div>
        );
    }

  // 2. Load past 30 days raw daily view data
  const rawDailyViews = await prisma.instituteDailyView.findMany({
    where: {
      instituteId,
      date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    },
    orderBy: { date: 'asc' }
  });

  // Data serialization for Client Component
  const serializedDailyViews = rawDailyViews.map((v: any) => ({
    date: v.date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
    views: v.viewCount
  }));

  const stats = {
    totalViews: institute.viewCount,
    shortlists: institute._count.shortlistedBy,
    enquiries: institute._count.enquiries,
    reviews: institute._count.reviews
  };

  const isPremium = ['PREMIUM', 'ULTRA', 'VERIFIED'].includes(institute.subscriptionPlan);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Performance Analytics</h1>
          <p className="text-gray-500 mt-1">{institute.name} — Manager Control Panel</p>
        </div>
        <div className="mt-3 md:mt-0">
          <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase ${
            isPremium ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-gray-100 text-gray-600'
          }`}>
            Current Tier: {institute.subscriptionPlan}
          </span>
        </div>
      </div>

      <AnalyticsDashboardClient
        initialDailyViews={serializedDailyViews} 
        stats={stats} 
        isPremium={isPremium}
        instituteId={instituteId}
      />
    </div>
  );
}