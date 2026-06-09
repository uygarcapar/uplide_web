"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useRole } from "@/lib/auth/useRole";
import { formatCurrency } from "@/lib/utils";
import type { ProductRow } from "@/types/database";

type Props = {
  products: ProductRow[];
  loading: boolean;
  onDelete: (product: ProductRow) => void;
};

export function ProductTable({ products, loading, onDelete }: Props) {
  const t = useTranslations("products");
  const tCommon = useTranslations("common");
  const tStatus = useTranslations("products.status");
  const locale = useLocale() as "tr" | "en";
  const { canWrite } = useRole();

  if (loading) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3 last:border-b-0">
            <Skeleton className="h-10 w-10 rounded" />
            <Skeleton className="h-4 w-40" />
            <div className="ml-auto flex gap-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
        <EmptyState title={t("empty")} />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
      <Table>
        <THead>
          <TR>
            <TH className="w-16">{t("table.image")}</TH>
            <TH>{t("table.name")}</TH>
            <TH>{t("table.category")}</TH>
            <TH className="text-right">{t("table.price")}</TH>
            <TH className="text-right">{t("table.stock")}</TH>
            <TH>{t("table.status")}</TH>
            <TH className="text-right">{tCommon("actions")}</TH>
          </TR>
        </THead>
        <TBody>
          {products.map((p) => (
            <TR key={p.id}>
              <TD>
                <div className="h-10 w-10 overflow-hidden rounded bg-[var(--color-surface-muted)]">
                  {p.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image_url}
                      alt={p.name[locale]}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
              </TD>
              <TD>
                <div className="font-medium text-[var(--color-fg)]">
                  {p.name[locale]}
                </div>
                {p.description?.[locale] && (
                  <div className="line-clamp-1 text-xs text-[var(--color-fg-muted)]">
                    {p.description[locale]}
                  </div>
                )}
              </TD>
              <TD className="text-[var(--color-fg-muted)]">{p.category}</TD>
              <TD className="text-right tabular-nums">
                {formatCurrency(p.price, locale)}
              </TD>
              <TD className="text-right tabular-nums">{p.stock}</TD>
              <TD>
                <Badge
                  tone={
                    p.status === "active"
                      ? "success"
                      : p.status === "draft"
                        ? "warning"
                        : "neutral"
                  }
                >
                  {tStatus(p.status)}
                </Badge>
              </TD>
              <TD>
                <div className="flex justify-end gap-1">
                  {canWrite ? (
                    <>
                      <Link href={`/products/${p.id}/edit`}>
                        <Button variant="ghost" size="sm" aria-label={tCommon("edit")}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={tCommon("delete")}
                        onClick={() => onDelete(p)}
                      >
                        <Trash2 className="h-4 w-4 text-[var(--color-danger)]" />
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs text-[var(--color-fg-muted)]">—</span>
                  )}
                </div>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
