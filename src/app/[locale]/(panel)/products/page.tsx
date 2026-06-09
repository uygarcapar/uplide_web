import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductsView } from "@/components/products/ProductsView";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("products");

  return (
    <div>
      <PageHeader title={t("title")} />
      <ProductsView />
    </div>
  );
}
