import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkServerSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies(); // <- треба await

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));

  const response = NextResponse.next();

  if (!accessToken && refreshToken) {
    const data = await checkServerSession();
    const setCookie = data.headers['set-cookie'];

    if (setCookie) {
      const cookiesArray = Array.isArray(setCookie) ? setCookie : [setCookie];

      for (const cookieStr of cookiesArray) {
        const [cookiePair] = cookieStr.split(';');
        const [name, value] = cookiePair.split('=');
        if (name && value) {
          response.cookies.set(name.trim(), value.trim());
        }
      }
    }
  }

  const hasAccess = Boolean(accessToken || response.cookies.get('accessToken'));

  if (!hasAccess) {
    if (isPrivateRoute) return NextResponse.redirect(new URL('/sign-in', request.url));
    return response;
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
