import { prisma } from '@/lib/prisma';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.academyfind.com';
  
  // Database se ab 'id' aur 'slug' dono fetch karenge
  const institutes = await prisma.institute.findMany({
    select: { id: true, slug: true, updatedAt: true },
  });

  
  const urls = institutes.map(inst => `
  <url>
    <loc>${baseUrl}/institute/${inst.id}-${inst.slug}</loc>
    <lastmod>${inst.updatedAt ? new Date(inst.updatedAt).toISOString() : new Date().toISOString()}</lastmod>
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