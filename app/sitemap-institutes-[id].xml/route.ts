// app/sitemap-institutes-[id].xml/route.ts
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.academyfind.com';
  
  // URL se id nikal lo (e.g., sitemap-institutes-0.xml -> id=0)
  const { id } = await params;
  const pageId = parseInt(id) || 0;
  
  const limit = 6000;
  const skip = pageId * limit;

  // Sirf 5000 institutes ek baar mein fetch honge (Lag 100% khatam!)
  const institutes = await prisma.institute.findMany({
    where: { isActive: true },
    select: { id: true, slug: true, updatedAt: true },
    skip: skip,
    take: limit,
    orderBy: { id: 'asc' } // Order by id bohot zaroori hai pagination ke liye
  });

  const urls = institutes.map((inst: any) => `
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
      // CDN Cache isko aur fast bana dega
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}