// src/middleware.ts
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isLoginPage  = req.nextUrl.pathname === '/admin/login';

  if (isAdminRoute && !isLoginPage && !req.auth) {
    // Use req.url as the base — this preserves the actual host on the live site
    const loginUrl = new URL('/admin/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && req.auth) {
    const dashboardUrl = new URL('/admin', req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*'],
};