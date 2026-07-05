import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const userAgent = request.headers.get('user-agent') || '';
  const accept = request.headers.get('accept') || '';
  const lowercaseUA = userAgent.toLowerCase();

  // 1. TRUSTED EXCEPTION: Protect core search engines for SEO rankings
  const isSearchEngine = 
    lowercaseUA.includes('googlebot') || 
    lowercaseUA.includes('bingbot') || 
    lowercaseUA.includes('google-keyword-associator');

  if (!isSearchEngine) {
    const isPageRequest = !path.includes('.') && !path.startsWith('/_next');

    // TRAP A: Block ancient legacy OS versions used by primitive automated setups
    const isLegacyOS = userAgent.includes('Windows NT 6.1') || userAgent.includes('Windows NT 6.0');

    // TRAP B: Target specific programming packages and headless scripts
    const isHeadlessOrScraper = 
      lowercaseUA.includes('python') || 
      lowercaseUA.includes('axios') || 
      lowercaseUA.includes('curl') || 
      lowercaseUA.includes('headless');
    
    // SAFE TRAP C: ONLY flag naked accepts if they are verified to be paired with a script engine
    const isSuspiciousNakedAccept = isPageRequest && (accept.trim() === '*/*') && (isLegacyOS || isHeadlessOrScraper);

    // TRAP D: Catch strange proxy app loops (like the Mexico-WeChat bot mismatch)
    const isSuspiciousAppBrowser = userAgent.includes('MicroMessenger') && !userAgent.includes('Language/zh_CN');

    if (isSuspiciousNakedAccept || isLegacyOS || isHeadlessOrScraper || isSuspiciousAppBrowser) {
      console.warn(`\n🛑 [SECURITY BLOCK] Path: ${path} | Reason: Scraper Footprint | UA: ${userAgent}`);
      
      return new NextResponse(JSON.stringify({ error: "Access Forbidden" }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // 2. LIVE MONITORING: Log clean traffic to your Vercel runtime logs
  if (!path.includes('.') && !path.startsWith('/_next')) {
    console.log(`\n--- [${request.method}] Request to: ${path} ---`);
    request.headers.forEach((value, key) => {
      console.log(`[Header] ${key}: ${value}`);
    });
    console.log(`---------------------------------------------------\n`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
