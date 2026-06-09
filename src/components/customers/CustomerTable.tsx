"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useRole } from "@/lib/auth/useRole";
import type { CustomerRow } from "@/types/database";

type Props = {
  customers: CustomerRow[];
  loading: boolean;
  onDelete: (customer: CustomerRow) => void;
};

export function CustomerTable({ customers, loading, onDelete }: Props) {
  const t = useTranslations("customers");
  const tCommon = useTranslations("common");
  const tStatus = useTranslations("customers.status");
  const { canWrite } = useRole();

  if (loading) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3 last:border-b-0">
            <Skeleton className="h-4 w-40" />
            <div className="ml-auto flex gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (customers.length === 0) {
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
            <TH>{t("table.name")}</TH>
            <TH>{t("table.email")}</TH>
            <TH>{t("table.phone")}</TH>
            <TH>{t("table.city")}</TH>
            <TH className="text-right">{t("table.totalOrders")}</TH>
            <TH>{t("table.status")}</TH>
            <TH className="text-right">{tCommon("actions")}</TH>
          </TR>
        </THead>
        <TBody>
          {customers.map((c) => (
            <TR key={c.id}>
              <TD className="font-medium text-[var(--color-fg)]">{c.full_name}</TD>
              <TD className="text-[var(--color-fg-muted)]">{c.email}</TD>
              <TD className="text-[var(--color-fg-muted)]">{c.phone ?? "—"}</TD>
              <TD className="text-[var(--color-fg-muted)]">{c.city ?? "—"}</TD>
              <TD className="text-right tabular-nums">{c.total_orders}</TD>
              <TD>
                <Badge tone={c.status === "active" ? "success" : "neutral"}>
                  {tStatus(c.status)}
                </Badge>
              </TD>
              <TD>
                <div className="flex justify-end gap-1">
                  {canWrite ? (
                    <>
                      <Link href={`/customers/${c.id}/edit`}>
                        <Button variant="ghost" size="sm" aria-label={tCommon("edit")}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={tCommon("delete")}
                        onClick={() => onDelete(c)}
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
