import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_KEY } from './constants/cookie';
import { pageList } from './constants/page-list';

const publicPaths = [
  pageList.logIn,
  pageList.signUp.root,
  pageList.signUp.verifyEmail,
  pageList.root,
  pageList.courses.root,
];

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  const isLoggedIn = request.cookies.get(COOKIE_KEY.refreshToken);

  if (
    isLoggedIn &&
    (url.pathname === pageList.logIn || url.pathname === pageList.root)
  ) {
    return NextResponse.redirect(new URL('/courses', url.origin), 307);
  }

  if (
    !isLoggedIn &&
    !publicPaths.includes(url.pathname) &&
    !url.pathname.startsWith(pageList.courses.root)
  ) {
    const newUrl = new URL(pageList.logIn, url.origin);
    newUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(newUrl, 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.png (favicon file)
     * - images (public images)
     * - / (the root path)
     */
    '/((?!api|_next/static|_next/image|favicon.png|images).*)',
  ],
};
