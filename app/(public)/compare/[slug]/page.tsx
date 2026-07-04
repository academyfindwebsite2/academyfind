import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  Trophy,
  Sparkles,
  Star,
  MapPin,
  Calendar,
  Users,
  Building2,
  GraduationCap,
  Banknote,
  Medal,
  HelpCircle,
  ArrowRight,
  Minus,
} from 'lucide-react';

// ==========================================
// DATA FETCHING
// ==========================================

async function getComparison(slug: string) {
  return prisma.instituteComparisonCache.findUnique({
    where: { slug },
    include: {
      institute1: {
        include: {
          city: { select: { name: true } },
          facilities: { orderBy: { order: 'asc' } },
          batches: { orderBy: { fee: 'asc' } },
          highlightStats: { orderBy: { order: 'asc' } },
          achievements: { orderBy: { year: 'desc' }, take: 5 },
          faqs: { orderBy: { order: 'asc' } },
          teachers: { take: 3 },
          notablepersons: { take: 3, orderBy: { batchYear: 'desc' } },
        },
      },
      institute2: {
        include: {
          city: { select: { name: true } },
          facilities: { orderBy: { order: 'asc' } },
          batches: { orderBy: { fee: 'asc' } },
          highlightStats: { orderBy: { order: 'asc' } },
          achievements: { orderBy: { year: 'desc' }, take: 5 },
          faqs: { orderBy: { order: 'asc' } },
          teachers: { take: 3 },
          notablepersons: { take: 3, orderBy: { batchYear: 'desc' } },
        },
      },
    },
  });
}

type ComparisonData = NonNullable<Awaited<ReturnType<typeof getComparison>>>;
type InstituteData = ComparisonData['institute1'];

// ==========================================
// METADATA
// ==========================================

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comparison = await prisma.instituteComparisonCache.findUnique({
    where: { slug },
    select: {
      metaTitle: true,
      metaDescription: true,
      institute1: { select: { name: true } },
      institute2: { select: { name: true } },
    },
  });

  if (!comparison) return { title: 'Comparison Not Found' };

  return {
    title:
      comparison.metaTitle ||
      `${comparison.institute1.name} vs ${comparison.institute2.name} — Fees, Reviews & Facilities Compared`,
    description:
      comparison.metaDescription ||
      `Compare ${comparison.institute1.name} and ${comparison.institute2.name} on fees, ratings, facilities, faculty, and student results — side by side.`,
  };
}

// ==========================================
// SMALL HELPERS
// ==========================================

function unionByKey<T extends Record<string, any>>(a: T[], b: T[], key: keyof T) {
  const seen = new Set<string>();
  const order: string[] = [];
  [...a, ...b].forEach((item: any) => {
    const k = String(item[key]);
    if (!seen.has(k)) {
      seen.add(k);
      order.push(k);
    }
  });
  return order;
}

function formatFee(min?: number | null, max?: number | null) {
  if (!min && !max) return null;
  if (min && max && min !== max) return `₹${min.toLocaleString('en-IN')} – ₹${max.toLocaleString('en-IN')}`;
  return `₹${(min ?? max)!.toLocaleString('en-IN')}`;
}

function Winner({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <span className="ml-1.5 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
      Better
    </span>
  );
}

// ==========================================
// PAGE
// ==========================================

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comparison = await getComparison(slug);
  if (!comparison) notFound();

  const a = comparison.institute1;
  const b = comparison.institute2;

  const ratingA = a.googleRating ?? a.averageRating ?? 0;
  const ratingB = b.googleRating ?? b.averageRating ?? 0;
  const reviewsA = a.googleReviewCount ?? a.reviewCount ?? 0;
  const reviewsB = b.googleReviewCount ?? b.reviewCount ?? 0;
  const feeA = formatFee(a.feeMin, a.feeMax);
  const feeB = formatFee(b.feeMin, b.feeMax);

  const facilityNames = unionByKey(a.facilities, b.facilities, 'name');
  const statLabels = unionByKey(a.highlightStats, b.highlightStats, 'label');

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ==========================================
          1. HERO — quick-scan "VS" header
          ========================================== */}
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
            AcademyFind Comparison
          </p>
          <h1 className="text-center text-3xl font-black leading-tight tracking-tight text-stone-900 sm:text-5xl">
            {a.name} <span className="text-amber-500">vs</span> {b.name}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-center text-stone-500">
            Side-by-side comparison of fees, ratings, facilities, faculty and results — updated{' '}
            {new Date(comparison.updatedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}.
          </p>

          {/* VS scoreboard */}
          <div className="mt-10 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
            <InstituteHeroCard institute={a} align="right" />
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-black text-white shadow-lg shadow-amber-200 sm:h-16 sm:w-16 sm:text-base">
              VS
            </div>
            <InstituteHeroCard institute={b} align="left" />
          </div>

          {(comparison.viewCount > 0 || a.compareCount + b.compareCount > 0) && (
            <p className="mt-6 text-center text-xs text-stone-400">
              {comparison.viewCount.toLocaleString('en-IN')} people viewed this comparison
            </p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        {/* ==========================================
            2. AI VERDICT
            ========================================== */}
        {comparison.summary && (
          <section className="relative overflow-hidden rounded-2xl border border-amber-100 bg-white p-6 shadow-sm md:p-8">
            <Sparkles className="absolute right-4 top-4 h-20 w-20 text-amber-50" />
            <h2 className="relative mb-4 flex items-center gap-2 text-xl font-bold text-stone-900">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Quick Verdict
            </h2>
            <p className="relative max-w-3xl text-lg leading-relaxed text-stone-700">{comparison.summary}</p>

            {comparison.verdict && (
              <div className="relative mt-6 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 font-bold text-white">
                <Trophy className="h-5 w-5" />
                {comparison.verdict === 'Tie' ? "It's a close tie" : `Edge: ${comparison.verdict}`}
              </div>
            )}
            {comparison.verdictReason && (
              <p className="relative mt-3 max-w-3xl text-sm text-stone-500">{comparison.verdictReason}</p>
            )}
          </section>
        )}

        {/* ==========================================
            3. AT-A-GLANCE STAT STRIP
            ========================================== */}
        <section>
          <SectionHeading title="At a Glance" />
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <ComparisonRow
              icon={<Star className="h-4 w-4" />}
              label="Rating"
              valueA={
                <span className="inline-flex items-center gap-1">
                  ⭐ {ratingA ? ratingA.toFixed(1) : 'N/A'}
                  <Winner active={ratingA > ratingB} />
                </span>
              }
              valueB={
                <span className="inline-flex items-center gap-1">
                  ⭐ {ratingB ? ratingB.toFixed(1) : 'N/A'}
                  <Winner active={ratingB > ratingA} />
                </span>
              }
            />
            <ComparisonRow
              label="Reviews"
              valueA={reviewsA ? reviewsA.toLocaleString('en-IN') : 'N/A'}
              valueB={reviewsB ? reviewsB.toLocaleString('en-IN') : 'N/A'}
            />
            <ComparisonRow
              icon={<Banknote className="h-4 w-4" />}
              label="Fees (approx.)"
              valueA={
                <span className="inline-flex items-center gap-1">
                  {feeA ?? 'Contact institute'}
                  <Winner active={!!a.feeMin && (!b.feeMin || a.feeMin < b.feeMin)} />
                </span>
              }
              valueB={
                <span className="inline-flex items-center gap-1">
                  {feeB ?? 'Contact institute'}
                  <Winner active={!!b.feeMin && (!a.feeMin || b.feeMin < a.feeMin)} />
                </span>
              }
            />
            <ComparisonRow
              icon={<Calendar className="h-4 w-4" />}
              label="Established"
              valueA={a.establishedYear ?? 'N/A'}
              valueB={b.establishedYear ?? 'N/A'}
            />
            <ComparisonRow
              icon={<Building2 className="h-4 w-4" />}
              label="Mode"
              valueA={<span className="capitalize">{a.mode.toLowerCase()}</span>}
              valueB={<span className="capitalize">{b.mode.toLowerCase()}</span>}
            />
            <ComparisonRow
              icon={<Users className="h-4 w-4" />}
              label="Students taught"
              valueA={a.totalStudents ? `${a.totalStudents.toLocaleString('en-IN')}+` : 'N/A'}
              valueB={b.totalStudents ? `${b.totalStudents.toLocaleString('en-IN')}+` : 'N/A'}
            />
            <ComparisonRow
              label="Branches"
              valueA={a.totalBranches ?? 'N/A'}
              valueB={b.totalBranches ?? 'N/A'}
              last
            />
          </div>
        </section>

        {/* ==========================================
            4. QUICK TOGGLES (checkbox-style rows)
            ========================================== */}
        <section>
          <SectionHeading title="What Each Offers" />
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            {[
              { label: 'Online classes', a: a.hasOnlineClasses, b: b.hasOnlineClasses },
              { label: 'Hostel facility', a: a.hasHostelFacility, b: b.hasHostelFacility },
              { label: 'Free demo classes', a: a.hasDemoClasses, b: b.hasDemoClasses },
              { label: 'Scholarships available', a: a.hasScholarship, b: b.hasScholarship },
              { label: 'Completion certificate', a: a.hasCertification, b: b.hasCertification },
            ].map((row: any, i: any, arr: any) => (
              <ComparisonRow
                key={row.label}
                label={row.label}
                valueA={<BoolIcon value={row.a} />}
                valueB={<BoolIcon value={row.b} />}
                last={i === arr.length - 1}
              />
            ))}
          </div>
        </section>

        {/* ==========================================
            5. FACILITIES CHECKLIST
            ========================================== */}
        {facilityNames.length > 0 && (
          <section>
            <SectionHeading title="Facilities" />
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              {facilityNames.map((name: any, i: any) => {
                const fa = a.facilities.find((f: any) => f.name === name)?.available ?? false;
                const fb = b.facilities.find((f: any) => f.name === name)?.available ?? false;
                return (
                  <ComparisonRow
                    key={name}
                    label={name}
                    valueA={<BoolIcon value={fa} />}
                    valueB={<BoolIcon value={fb} />}
                    last={i === facilityNames.length - 1}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* ==========================================
            6. DYNAMIC HIGHLIGHT STATS (domain-specific)
            ========================================== */}
        {statLabels.length > 0 && (
          <section>
            <SectionHeading title="Standout Numbers" />
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              {statLabels.map((label: any, i: any) => {
                const sa = a.highlightStats.find((s: any) => s.label === label);
                const sb = b.highlightStats.find((s: any) => s.label === label);
                return (
                  <ComparisonRow
                    key={label}
                    label={label}
                    valueA={sa?.value ?? <Minus className="h-4 w-4 text-stone-300" />}
                    valueB={sb?.value ?? <Minus className="h-4 w-4 text-stone-300" />}
                    last={i === statLabels.length - 1}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* ==========================================
            7. BATCHES & FEES — side-by-side cards
            ========================================== */}
        {(a.batches.length > 0 || b.batches.length > 0) && (
          <section>
            <SectionHeading title="Batches & Fees" />
            <div className="grid gap-6 md:grid-cols-2">
              <BatchList institute={a} accent />
              <BatchList institute={b} />
            </div>
          </section>
        )}

        {/* ==========================================
            8. FACULTY
            ========================================== */}
        {(a.teachers.length > 0 || b.teachers.length > 0) && (
          <section>
            <SectionHeading title="Faculty" />
            <div className="grid gap-6 md:grid-cols-2">
              <FacultyList institute={a} />
              <FacultyList institute={b} />
            </div>
          </section>
        )}

        {/* ==========================================
            9. RESULTS / ACHIEVEMENTS
            ========================================== */}
        {(a.achievements.length > 0 || b.achievements.length > 0) && (
          <section>
            <SectionHeading title="Recent Results" />
            <div className="grid gap-6 md:grid-cols-2">
              <AchievementList institute={a} />
              <AchievementList institute={b} />
            </div>
          </section>
        )}

        {/* ==========================================
            10. NOTABLE ALUMNI
            ========================================== */}
        {(a.notablepersons.length > 0 || b.notablepersons.length > 0) && (
          <section>
            <SectionHeading title="Notable Alumni" />
            <div className="grid gap-6 md:grid-cols-2">
              <AlumniList institute={a} />
              <AlumniList institute={b} />
            </div>
          </section>
        )}

        {/* ==========================================
            11. PROS & CONS
            ========================================== */}
        <section>
          <SectionHeading title="Pros & Cons" />
          <div className="grid gap-6 md:grid-cols-2">
            <ProsConsCard institute={a} accent />
            <ProsConsCard institute={b} />
          </div>
        </section>

        {/* ==========================================
            12. FAQs (per institute)
            ========================================== */}
        {(a.faqs.length > 0 || b.faqs.length > 0) && (
          <section>
            <SectionHeading title="Frequently Asked Questions" />
            <div className="grid gap-6 md:grid-cols-2">
              <FaqList institute={a} />
              <FaqList institute={b} />
            </div>
          </section>
        )}

        {/* ==========================================
            13. FINAL CTA
            ========================================== */}
        <section className="rounded-2xl bg-stone-900 px-6 py-10 text-center sm:px-10">
          <h2 className="text-2xl font-black text-white sm:text-3xl">Still can&apos;t decide?</h2>
          <p className="mx-auto mt-2 max-w-xl text-stone-300">
            Send an enquiry to both institutes and compare their replies, fees and seat availability directly.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={`/institute/${a.id}-${a.slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-bold text-white transition hover:bg-amber-400"
            >
              Enquire {a.name} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/institute/${b.id}-${b.slug}`}
              className="inline-flex items-center gap-2 rounded-lg border border-stone-600 px-6 py-3 font-bold text-white transition hover:bg-stone-800"
            >
              Enquire {b.name} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

// ==========================================
// SUBCOMPONENTS
// ==========================================

function InstituteHeroCard({ institute, align }: { institute: InstituteData; align: 'left' | 'right' }) {
  const rating = institute.googleRating ?? institute.averageRating ?? 0;
  return (
    <div className={`flex flex-col ${align === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
      <div className={`flex items-center gap-3 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-stone-200 bg-stone-100 sm:h-16 sm:w-16">
          {institute.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={institute.logo} alt={institute.name} className="h-full w-full object-cover" />
          ) : (
            <Building2 className="h-6 w-6 text-stone-400" />
          )}
        </div>
        <div>
          <p className="font-bold text-stone-900 sm:text-lg">{institute.name}</p>
          {institute.city?.name && (
            <p className={`flex items-center gap-1 text-xs text-stone-400 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
              <MapPin className="h-3 w-3" /> {institute.city.name}
            </p>
          )}
        </div>
      </div>
      {rating > 0 && (
        <p className="mt-2 text-sm font-semibold text-amber-600">⭐ {rating.toFixed(1)}</p>
      )}
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return <h2 className="mb-3 text-lg font-bold text-stone-900 sm:text-xl">{title}</h2>;
}

function BoolIcon({ value }: { value: boolean }) {
  return value ? (
    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
  ) : (
    <XCircle className="h-5 w-5 text-stone-300" />
  );
}

function ComparisonRow({
  label,
  icon,
  valueA,
  valueB,
  last,
}: {
  label: string;
  icon?: React.ReactNode;
  valueA: React.ReactNode;
  valueB: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[1fr_1fr_1fr] items-center gap-2 px-4 py-3.5 sm:grid-cols-[180px_1fr_1fr] sm:gap-4 sm:px-6 ${
        last ? '' : 'border-b border-stone-100'
      }`}
    >
      <span className="hidden items-center gap-2 text-sm font-medium text-stone-500 sm:flex">
        {icon}
        {label}
      </span>
      <span className="col-span-3 mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-stone-400 sm:hidden">
        {icon}
        {label}
      </span>
      <span className="col-start-1 text-sm font-semibold tabular-nums text-stone-900 sm:col-start-2">{valueA}</span>
      <span className="text-sm font-semibold tabular-nums text-stone-900">{valueB}</span>
    </div>
  );
}

function BatchList({ institute, accent }: { institute: InstituteData; accent?: boolean }) {
  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm ${
        accent ? 'border-amber-200' : 'border-stone-200'
      }`}
    >
      <p className="mb-4 font-bold text-stone-900">{institute.name}</p>
      {institute.batches.length === 0 ? (
        <p className="text-sm text-stone-400">Batch details not added yet.</p>
      ) : (
        <ul className="space-y-3">
          {institute.batches.map((batch: any) => (
            <li key={batch.id} className="rounded-lg bg-stone-50 p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-stone-800">{batch.name}</p>
                <div className="text-right">
                  {batch.fee != null ? (
                    <p className="text-sm font-bold tabular-nums text-amber-600">
                      ₹{batch.fee.toLocaleString('en-IN')}
                    </p>
                  ) : (
                    <p className="text-xs text-stone-400">On request</p>
                  )}
                  {batch.originalFee && batch.originalFee > (batch.fee ?? 0) && (
                    <p className="text-xs tabular-nums text-stone-400 line-through">
                      ₹{batch.originalFee.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              </div>
              <p className="mt-1 text-xs text-stone-500">
                {[batch.duration, batch.batchType, batch.timing].filter(Boolean).join(' · ') || '—'}
              </p>
              {batch.seatsLeft != null && (
                <p className="mt-1 text-xs font-medium text-emerald-600">{batch.seatsLeft} seats left</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FacultyList({ institute }: { institute: InstituteData }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="mb-4 font-bold text-stone-900">{institute.name}</p>
      {institute.teachers.length === 0 ? (
        <p className="text-sm text-stone-400">Faculty details not added yet.</p>
      ) : (
        <ul className="space-y-4">
          {institute.teachers.map((t: any) => (
            <li key={t.id} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-amber-50">
                {t.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.imageUrl} alt={t.name} className="h-full w-full object-cover" />
                ) : (
                  <GraduationCap className="h-5 w-5 text-amber-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-800">{t.name}</p>
                <p className="text-xs text-stone-500">{[t.subject, t.experience].filter(Boolean).join(' · ')}</p>
                {t.qualification && <p className="text-xs text-stone-400">{t.qualification}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AchievementList({ institute }: { institute: InstituteData }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="mb-4 font-bold text-stone-900">{institute.name}</p>
      {institute.achievements.length === 0 ? (
        <p className="text-sm text-stone-400">No results added yet.</p>
      ) : (
        <ul className="space-y-3">
          {institute.achievements.map((ach: any) => (
            <li key={ach.id} className="flex items-start gap-3">
              <Medal className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <div>
                <p className="text-sm font-semibold text-stone-800">{ach.title}</p>
                <p className="text-xs text-stone-500">
                  {[ach.studentName, ach.achievementType, String(ach.year)].filter(Boolean).join(' · ')}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AlumniList({ institute }: { institute: InstituteData }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="mb-4 font-bold text-stone-900">{institute.name}</p>
      {institute.notablepersons.length === 0 ? (
        <p className="text-sm text-stone-400">No alumni highlights yet.</p>
      ) : (
        <ul className="space-y-4">
          {institute.notablepersons.map((p: any) => (
            <li key={p.id} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-stone-100">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <Users className="h-5 w-5 text-stone-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-800">{p.name}</p>
                <p className="text-xs text-stone-500">
                  {[p.placedAt, p.package, p.batchYear ? `Batch ${p.batchYear}` : null].filter(Boolean).join(' · ')}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProsConsCard({ institute, accent }: { institute: InstituteData; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border bg-white p-5 shadow-sm ${accent ? 'border-amber-200' : 'border-stone-200'}`}>
      <p className="mb-4 font-bold text-stone-900">{institute.name}</p>
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600">Pros</p>
          {institute.pros.length === 0 ? (
            <p className="text-sm text-stone-400">Not added yet.</p>
          ) : (
            <ul className="space-y-1.5">
              {institute.pros.map((pro: any, i: any) => (
                <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {pro}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-rose-500">Cons</p>
          {institute.cons.length === 0 ? (
            <p className="text-sm text-stone-400">Not added yet.</p>
          ) : (
            <ul className="space-y-1.5">
              {institute.cons.map((con: any, i: any) => (
                <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" /> {con}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function FaqList({ institute }: { institute: InstituteData }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="mb-4 font-bold text-stone-900">{institute.name}</p>
      {institute.faqs.length === 0 ? (
        <p className="text-sm text-stone-400">No FAQs added yet.</p>
      ) : (
        <ul className="space-y-4">
          {institute.faqs.map((faq: any) => (
            <li key={faq.id}>
              <p className="flex items-start gap-2 text-sm font-semibold text-stone-800">
                <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" /> {faq.question}
              </p>
              <p className="ml-6 mt-1 text-sm text-stone-500">{faq.answer}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}