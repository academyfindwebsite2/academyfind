import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Catch the pathname being requested
  const path = request.nextUrl.pathname;

  // Log headers for standard pages (ignoring static assets / icons)
  if (!path.includes('.') && !path.startsWith('/_next')) {
    console.log(`\n--- [${request.method}] Request to: ${path} ---`);
    
    request.headers.forEach((value, key) => {
      console.log(`[Header] ${key}: ${value}`);
    });
  }

  return NextResponse.next();
}
