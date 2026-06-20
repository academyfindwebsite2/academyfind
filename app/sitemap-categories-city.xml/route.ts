import { prisma } from '@/lib/prisma';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://academyfind.com';
  
  const categories = await prisma.category.findMany({ select: { slug: true } });
  const cities = await prisma.city.findMany({ select: { slug: true } });

  let urls = '';

  // 1. Only Category pages (/jee-coaching)
  categories.forEach((cat: any) => {
    urls += `
  <url>
    <loc>${baseUrl}/${cat.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  // 2. Category + City pages (/jee-coaching/meerut)
  categories.forEach((cat: any) => {
    cities.forEach((city: any) => {
      urls += `
  <url>
    <loc>${baseUrl}/${cat.slug}/${city.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'text/xml' } });
}