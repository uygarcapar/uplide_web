import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "@/store/Providers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AuthUser } from "@/store/slices/authSlice";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Uplide Admin",
  description: "E-Commerce Admin Panel",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialUser: AuthUser | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile) initialUser = { id: profile.id, email: profile.email, role: profile.role };
  }

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('theme');
                if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                document.documentElement.dataset.theme = t;
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-bg text-fg">
        <NextIntlClientProvider>
          <Providers initialUser={initialUser}>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
