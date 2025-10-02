import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { localePrefix, localesConfig } from './utils/localesConfig';

export const protectedRoutes = ['/company', '/parking', '/'];

export default async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const [, base, ...segments] = pathname.split('/');

	const token = request.cookies.get('token');
	const role = request.cookies.get('role');
	if (token && role) {
		if (pathname === `/login` || pathname === '/') {
			// const url = request.nextUrl.clone();
			const url = `/${role?.value}`;
			request.nextUrl.pathname = url;
		} else {
			//no funciona, necesita bloquear rutas si no tiene rol
			request.nextUrl.pathname = pathname;
		}
	} else {
		const url = `/login`;
		request.nextUrl.pathname = url;
	}

	const handleI18nRouting = createIntlMiddleware({
		locales: localesConfig,
		localePrefix: localePrefix,
		defaultLocale: 'en',
	});
	const response = handleI18nRouting(request);
	return response;
}

export const config = {
	// Match only internationalized pathnames
	matcher: ['/', '/login', '/company/:path*', '/credits/:path*', '/parking/:path*', '/faq/:path*'],
};
