export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.academyfind.com';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-static.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-categories-city.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-institutes.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-jobs.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}