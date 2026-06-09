import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductForm } from "@/components/products/ProductForm";
import { requireRole } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProductRow } from "@/types/database";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  await requireRole(locale, "full_access");
  const t = await getTranslations("products");

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const product = data as ProductRow;

  return (
    <div>
      <PageHeader title={t("edit")} description={product.name[locale as "tr" | "en"]} />
      <ProductForm mode="update" initial={product} locale={locale} />
    </div>
  );
}
