import { setRequestLocale, getTranslations } from "next-intl/server";
import { Boxes } from "lucide-react";
import { LoginForm } from "./LoginForm";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("app");

  return (
    <main className="flex min-h-dvh flex-col items-center overflow-hidden bg-[var(--color-bg)] px-4 pt-12 pb-6 sm:pt-32 sm:pb-12">
      <span
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-[var(--color-border)] bg-[var(--color-primary)] text-[var(--color-primary-fg)] sm:mb-10 sm:h-24 sm:w-24"
        aria-label={t("name")}
      >
        <Boxes className="h-10 w-10 sm:h-12 sm:w-12" />
      </span>
      <LoginForm />
    </main>
  );
}
