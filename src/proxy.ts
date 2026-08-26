import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './routing';
import { updateSession } from './utils/supabase/middleware';

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);
  // Segarkan token sesi Supabase dan tulis cookie barunya ke response i18n.
  await updateSession(request, response);
  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(id|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
