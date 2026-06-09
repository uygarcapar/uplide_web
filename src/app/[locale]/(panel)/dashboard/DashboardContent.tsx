"use client";

import { Package, Users, CheckCircle2, AlertTriangle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardBody } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { useListProductsQuery } from "@/store/slices/productsApi";
import { useListCustomersQuery } from "@/store/slices/customersApi";
import { formatCurrency } from "@/lib/utils";

const LOW_STOCK_THRESHOLD = 10;

export function DashboardContent() {
  const t = useTranslations("dashboard");
  const tStatus = useTranslations("products.status");
  const locale = useLocale() as "tr" | "en";

  const products = useListProductsQuery();
  const customers = useListCustomersQuery();

  const totalProducts = products.data?.length ?? 0;
  const totalCustomers = customers.data?.length ?? 0;
  const activeProducts = products.data?.filter((p) => p.status === "active").length ?? 0;
  const lowStockCount =
    products.data?.filter((p) => p.stock <= LOW_STOCK_THRESHOLD).length ?? 0;
  const recent = (products.data ?? []).slice(0, 5);

  const stats = [
    {
      label: t("stats.totalProducts"),
      value: totalProducts,
      icon: Package,
      tone: "info" as const,
    },
    {
      label: t("stats.totalCustomers"),
      value: totalCustomers,
      icon: Users,
      tone: "neutral" as const,
    },
    {
      label: t("stats.activeProducts"),
      value: activeProducts,
      icon: CheckCircle2,
      tone: "success" as const,
    },
    {
      label: t("stats.lowStock"),
      value: lowStockCount,
      icon: AlertTriangle,
      tone: "warning" as const,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardBody className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs text-[var(--color-fg-muted)]">{s.label}</div>
                {products.isLoading || customers.isLoading ? (
                  <Skeleton className="mt-2 h-7 w-16" />
                ) : (
                  <div className="mt-1 text-2xl font-semibold text-[var(--color-fg)]">
                    {s.value}
                  </div>
                )}
              </div>
              <div className="rounded-lg bg-[var(--color-surface-muted)] p-2 text-[var(--color-fg)]">
                <s.icon className="h-5 w-5" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
          <div className="text-sm font-semibold text-[var(--color-fg)]">
            {t("recentProducts")}
          </div>
          <Link href="/products">
            <Button variant="ghost" size="sm">
              {t("viewAll")}
            </Button>
          </Link>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {products.isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="h-10 w-10 rounded" />
                <Skeleton className="h-4 w-40" />
                <div className="ml-auto">
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))
          ) : recent.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-[var(--color-fg-muted)]">
              {t("noData")}
            </div>
          ) : (
            recent.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-[var(--color-surface-muted)]">
                  {p.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image_url}
                      alt={p.name[locale]}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-[var(--color-fg)]">
                    {p.name[locale]}
                  </div>
                  <div className="text-xs text-[var(--color-fg-muted)]">{p.category}</div>
                </div>
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
                <div className="hidden text-sm text-[var(--color-fg)] sm:block">
                  {formatCurrency(p.price, locale)}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
