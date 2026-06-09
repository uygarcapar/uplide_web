"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearUser } from "@/store/slices/authSlice";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function UserMenu({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const tRoles = useTranslations("roles");
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (!user) return null;

  async function logout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    dispatch(clearUser());
    router.replace(`/${locale}/login`);
    router.refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-sm hover:bg-[var(--color-surface-muted)]"
      >
        <div className="hidden text-left sm:block">
          <div className="text-xs font-medium text-[var(--color-fg)]">{user.email}</div>
        </div>
        <Badge tone={user.role === "full_access" ? "success" : "info"}>
          {tRoles(user.role)}
        </Badge>
        <ChevronDown className="h-4 w-4 text-[var(--color-fg-muted)]" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-[var(--shadow-card)]">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--color-fg)] hover:bg-[var(--color-surface-muted)]"
          >
            <LogOut className="h-4 w-4" />
            {t("logout")}
          </button>
        </div>
      )}
    </div>
  );
}
