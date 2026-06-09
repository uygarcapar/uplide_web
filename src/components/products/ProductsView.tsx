"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ProductFilters, type Filters } from "./ProductFilters";
import { ProductTable } from "./ProductTable";
import {
  useDeleteProductMutation,
  useListProductsQuery,
} from "@/store/slices/productsApi";
import { useRole } from "@/lib/auth/useRole";
import type { ProductRow } from "@/types/database";

const initialFilters: Filters = {
  search: "",
  category: "",
  status: "",
  sort: "newest",
};

export function ProductsView() {
  const t = useTranslations("products");
  const tCommon = useTranslations("common");
  const locale = useLocale() as "tr" | "en";
  const { canWrite } = useRole();
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [pendingDelete, setPendingDelete] = useState<ProductRow | null>(null);

  const { data, isLoading } = useListProductsQuery();
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (filters.category) list = list.filter((p) => p.category === filters.category);
    if (filters.status) list = list.filter((p) => p.status === filters.status);
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.tr.toLowerCase().includes(q) ||
          p.name.en.toLowerCase().includes(q),
      );
    }
    list = [...list];
    switch (filters.sort) {
      case "name_asc":
        list.sort((a, b) => a.name[locale].localeCompare(b.name[locale]));
        break;
      case "name_desc":
        list.sort((a, b) => b.name[locale].localeCompare(a.name[locale]));
        break;
      case "price_asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "stock_asc":
        list.sort((a, b) => a.stock - b.stock);
        break;
      case "stock_desc":
        list.sort((a, b) => b.stock - a.stock);
        break;
      case "newest":
      default:
        list.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
    }
    return list;
  }, [data, filters, locale]);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    try {
      await deleteProduct(pendingDelete.id).unwrap();
      toast.success(t("deleted"));
      setPendingDelete(null);
    } catch {
      toast.error(tCommon("error"));
    }
  }

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex justify-end">
        {canWrite && (
          <Link href="/products/new">
            <Button>
              <Plus className="h-4 w-4" />
              {t("new")}
            </Button>
          </Link>
        )}
      </div>
      <ProductFilters value={filters} onChange={setFilters} />
      <ProductTable
        products={filtered}
        loading={isLoading}
        onDelete={(p) => setPendingDelete(p)}
      />
      <ConfirmDialog
        open={pendingDelete !== null}
        title={t("delete")}
        description={t("deleteConfirm")}
        confirmLabel={t("delete")}
        cancelLabel={t("cancel")}
        busy={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
