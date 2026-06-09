import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

const PUBLIC_PATTERNS = [/^\/(tr|en)?\/?$/, /^\/(tr|en)\/login\/?$/];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const intlResponse = intlMiddleware(request);
  const isPublic = PUBLIC_PATTERNS.some((re) => re.test(pathname));

  const sessionResponse = await updateSupabaseSession(request, intlResponse);

  if (isPublic) return sessionResponse;

  const hasSession = sessionResponse.headers.get("x-supabase-authenticated") === "1";
  if (!hasSession) {
    const localeMatch = pathname.match(/^\/(tr|en)\//);
    const locale = localeMatch?.[1] ?? routing.defaultLocale;
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  return sessionResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
