import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import { checkServerSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));

  let setCookieHeader: string[] | undefined;
  let refreshedAccessToken: string | undefined;

  if (!accessToken && refreshToken) {
    const data = await checkServerSession();
    const setCookie = data.headers['set-cookie'];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      setCookieHeader = cookieArray;

      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);
        if (parsed.accessToken) refreshedAccessToken = parsed.accessToken;
      }
    }
  }

  const hasAccess = Boolean(accessToken || refreshedAccessToken);

  // Якщо користувач не авторизований
  if (!hasAccess) {
    if (isPrivateRoute) {
      const response = NextResponse.redirect(new URL('/sign-in', request.url));
      if (setCookieHeader) response.headers.set('set-cookie', setCookieHeader.join(','));
      return response;
    }
    if (isPublicRoute) {
      const response = NextResponse.next();
      if (setCookieHeader) response.headers.set('set-cookie', setCookieHeader.join(','));
      return response;
    }
  }

  // Якщо користувач авторизований
  if (isPublicRoute) {
    const response = NextResponse.redirect(new URL('/', request.url));
    if (setCookieHeader) response.headers.set('set-cookie', setCookieHeader.join(','));
    return response;
  }

  if (isPrivateRoute) {
    const response = NextResponse.next();
    if (setCookieHeader) response.headers.set('set-cookie', setCookieHeader.join(','));
    return response;
  }

  // За замовчуванням
  const response = NextResponse.next();
  if (setCookieHeader) response.headers.set('set-cookie', setCookieHeader.join(','));
  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
