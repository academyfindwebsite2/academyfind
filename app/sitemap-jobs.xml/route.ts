import { prisma } from '@/lib/prisma';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://academyfind.com';
  
  // Sirf active jobs fetch karo
  const jobs = await prisma.jobPosting.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true, createdAt: true },
  });

  const urls = jobs.map((job: any) => `
  <url>
    <loc>${baseUrl}/careers/${job.slug}</loc>
    <lastmod>${job.updatedAt ? new Date(job.updatedAt).toISOString() : new Date(job.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  `).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}