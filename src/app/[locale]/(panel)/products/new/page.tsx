import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductForm } from "@/components/products/ProductForm";
import { requireRole } from "@/lib/auth/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function NewProductPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireRole(locale, "full_access");
  const t = await getTranslations("products");

  return (
    <div>
      <PageHeader title={t("new")} />
      <ProductForm mode="create" locale={locale} />
    </div>
  );
}
