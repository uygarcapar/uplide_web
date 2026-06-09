"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { productCategories, productStatuses } from "@/lib/validations/productSchema";

export type SortKey =
  | "newest"
  | "name_asc"
  | "name_desc"
  | "price_asc"
  | "price_desc"
  | "stock_asc"
  | "stock_desc";

export type Filters = {
  search: string;
  category: string;
  status: string;
  sort: SortKey;
};

type Props = {
  value: Filters;
  onChange: (next: Filters) => void;
};

export function ProductFilters({ value, onChange }: Props) {
  const t = useTranslations("products");
  const tCat = useTranslations("products");
  const update = (patch: Partial<Filters>) => onChange({ ...value, ...patch });

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="relative flex-1 min-w-0">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-fg-muted)]" />
        <input
          type="search"
          placeholder={t("search")}
          value={value.search}
          onChange={(e) => update({ search: e.target.value })}
          className="h-10 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] pl-9 pr-3 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        />
      </label>

      <select
        value={value.category}
        onChange={(e) => update({ category: e.target.value })}
        aria-label={t("filterCategory")}
        className="h-10 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-fg)]"
      >
        <option value="">{t("filterAll")} — {t("filterCategory")}</option>
        {productCategories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={value.status}
        onChange={(e) => update({ status: e.target.value })}
        aria-label={t("filterStatus")}
        className="h-10 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-fg)]"
      >
        <option value="">{t("filterAll")} — {t("filterStatus")}</option>
        {productStatuses.map((s) => (
          <option key={s} value={s}>
            {tCat(`status.${s}`)}
          </option>
        ))}
      </select>

      <select
        value={value.sort}
        onChange={(e) => update({ sort: e.target.value as SortKey })}
        aria-label={t("sort")}
        className="h-10 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-fg)]"
      >
        <option value="newest">{t("sort")}</option>
        <option value="name_asc">{t("sortNameAsc")}</option>
        <option value="name_desc">{t("sortNameDesc")}</option>
        <option value="price_asc">{t("sortPriceAsc")}</option>
        <option value="price_desc">{t("sortPriceDesc")}</option>
        <option value="stock_asc">{t("sortStockAsc")}</option>
        <option value="stock_desc">{t("sortStockDesc")}</option>
      </select>
    </div>
  );
}
