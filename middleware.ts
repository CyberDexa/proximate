import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * ProxiMeet Middleware
 * Enforces age verification and safety requirements on all routes
 */

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Allow access to age verification, consent education, and static files
  const allowedPaths = [
    '/age-verification',
    '/consent-education',
    '/_next',
    '/favicon.ico',
    '/api/age-verify',
    '/api/consent'
  ];
  
  // Check if path is allowed without age verification
  const isAllowedPath = allowedPaths.some(path => pathname.startsWith(path));
  
  if (isAllowedPath) {
    return NextResponse.next();
  }
  
  // Check for age verification cookie
  const ageVerified = request.cookies.get('age_verified');
  
  if (!ageVerified) {
    // Redirect to age verification page
    const url = request.nextUrl.clone();
    url.pathname = '/age-verification';
    return NextResponse.redirect(url);
  }
  
  // Verify the age verification cookie is valid
  try {
    const verificationData = JSON.parse(ageVerified.value);
    const timestamp = new Date(verificationData.timestamp);
    const now = new Date();
    
    // Check if verification has expired (30 days)
    const expirationMs = 30 * 24 * 60 * 60 * 1000;
    const isExpired = now.getTime() - timestamp.getTime() > expirationMs;
    
    if (isExpired || !verificationData.verified) {
      // Clear expired cookie and redirect to age verification
      const response = NextResponse.redirect(new URL('/age-verification', request.url));
      response.cookies.delete('age_verified');
      return response;
    }
  } catch {
    // Invalid cookie, redirect to age verification
    const response = NextResponse.redirect(new URL('/age-verification', request.url));
    response.cookies.delete('age_verified');
    return response;
  }
  
  // Add security headers for adult content
  const response = NextResponse.next();
  
  // Prevent the site from being embedded in frames (clickjacking protection)
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Content-Security-Policy', "frame-ancestors 'none'");
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // Adult content headers
  response.headers.set('X-Adult-Content', '18+');
  response.headers.set('Age-Gate', 'required');
  
  return response;
}

export const config = {
  // Apply middleware to all routes except API routes that handle age verification
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes that don't require age verification)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
