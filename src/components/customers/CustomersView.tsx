"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { CustomerTable } from "./CustomerTable";
import {
  useDeleteCustomerMutation,
  useListCustomersQuery,
} from "@/store/slices/customersApi";
import { useRole } from "@/lib/auth/useRole";
import type { CustomerRow } from "@/types/database";

export function CustomersView() {
  const t = useTranslations("customers");
  const tCommon = useTranslations("common");
  const { canWrite } = useRole();
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<CustomerRow | null>(null);

  const { data, isLoading } = useListCustomersQuery();
  const [deleteCustomer, { isLoading: deleting }] = useDeleteCustomerMutation();

  const filtered = useMemo(() => {
    const list = data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (c) =>
        c.full_name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q),
    );
  }, [data, search]);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    try {
      await deleteCustomer(pendingDelete.id).unwrap();
      toast.success(t("deleted"));
      setPendingDelete(null);
    } catch {
      toast.error(tCommon("error"));
    }
  }

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-fg-muted)]" />
          <input
            type="search"
            placeholder={t("search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] pl-9 pr-3 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          />
        </label>
        {canWrite && (
          <Link href="/customers/new">
            <Button>
              <Plus className="h-4 w-4" />
              {t("new")}
            </Button>
          </Link>
        )}
      </div>
      <CustomerTable
        customers={filtered}
        loading={isLoading}
        onDelete={(c) => setPendingDelete(c)}
      />
      <ConfirmDialog
        open={pendingDelete !== null}
        title={tCommon("delete")}
        description={t("deleteConfirm")}
        confirmLabel={tCommon("delete")}
        cancelLabel={tCommon("cancel")}
        busy={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
