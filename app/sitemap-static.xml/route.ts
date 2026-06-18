export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.academyfind.com';
  
  const staticPages = ['', '/about', '/categories', '/cities', '/blog', '/contact', '/careers', '/user/life-coach','/privacy-policy','/terms-condition'];
  
  const urls = staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>
  `).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'text/xml' } });
}