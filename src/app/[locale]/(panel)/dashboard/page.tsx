import { setRequestLocale } from "next-intl/server";
import { DashboardContent } from "./DashboardContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <DashboardContent />
    </div>
  );
}
