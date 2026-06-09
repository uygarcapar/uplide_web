import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { requireRole } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CustomerRow } from "@/types/database";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function EditCustomerPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  await requireRole(locale, "full_access");
  const t = await getTranslations("customers");

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const customer = data as CustomerRow;

  return (
    <div>
      <PageHeader title={t("edit")} description={customer.full_name} />
      <CustomerForm mode="update" initial={customer} locale={locale} />
    </div>
  );
}
