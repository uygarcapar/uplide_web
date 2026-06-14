import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { CustomersView } from "@/components/customers/CustomersView";
import { ClearHighlightButton } from "@/components/layout/ClearHighlightButton";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CustomersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("customers");

  return (
    <div className="flex h-full min-h-0 flex-col px-4 pt-4 pb-4 lg:px-6 lg:pb-6">
      <PageHeader title={t("title")} actions={<ClearHighlightButton />} />
      <CustomersView />
    </div>
  );
}
