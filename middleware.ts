import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const userAgent = request.headers.get('user-agent') || '';
  const lowercaseUA = userAgent.toLowerCase();

  // 1. SECURITY BARRIER: Catch unverified malicious scrapers
  // Triggers if a desktop Chrome signature hardcodes trailing zeros (e.g., Chrome/142.0.0.0)
  const isFakeDesktopChrome = /Chrome\/\d+\.0\.0\.0/.test(userAgent);

  if (isFakeDesktopChrome) {
    // EXCEPTIONS: Always let genuine search engine bots pass safely
    const isVerifiedSearchEngine = lowercaseUA.includes('googlebot') || lowercaseUA.includes('bingbot');

    if (!isVerifiedSearchEngine) {
      console.warn(`\n[BLOCKED TRAFFIC] Prevented fake scraper bot at: ${path}`);
      console.warn(`User-Agent: ${userAgent}\n`);
      
      return new NextResponse(JSON.stringify({ error: "Access Denied" }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // 2. LOGGING UTILITY: Print standard web page headers to terminal
  if (!path.includes('.') && !path.startsWith('/_next')) {
    console.log(`\n--- [${request.method}] Request to: ${path} ---`);
    
    request.headers.forEach((value, key) => {
      console.log(`[Header] ${key}: ${value}`);
    });
    console.log(`---------------------------------------------------\n`);
  }

  return NextResponse.next();
}

// 3. OPTIMIZATION: Ensure the middleware runs only on targeted paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
