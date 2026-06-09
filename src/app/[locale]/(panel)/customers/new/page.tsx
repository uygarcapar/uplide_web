import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { requireRole } from "@/lib/auth/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function NewCustomerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireRole(locale, "full_access");
  const t = await getTranslations("customers");

  return (
    <div>
      <PageHeader title={t("new")} />
      <CustomerForm mode="create" locale={locale} />
    </div>
  );
}
