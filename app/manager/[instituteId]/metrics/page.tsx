import AnalyticsDashboardClient from '@/components/manager/MetricsDashBoard';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function InstituteAnalyticsPage({ params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  const instituteId = params.id;

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

  // 2. Load past 30 days raw daily view data
  const rawDailyViews = await prisma.instituteDailyView.findMany({
    where: {
      instituteId,
      date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    },
    orderBy: { date: 'asc' }
  });

  // Data serialization for Client Component
  const serializedDailyViews = rawDailyViews.map(v => ({
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