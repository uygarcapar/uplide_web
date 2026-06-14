"use client";

import { Toaster } from "sonner";
import { useAppSelector } from "@/store/hooks";

export function ThemedToaster() {
  const theme = useAppSelector((s) => s.ui.theme);

  return (
    <Toaster
      theme={theme}
      position="top-right"
      offset={{ top: "16px", right: "16px" }}
      toastOptions={{
        classNames: {
          toast:
            "!rounded-2xl !border !border-[var(--color-border)] !bg-[var(--color-surface)] !text-[var(--color-fg)] !shadow-none !p-4 !gap-3",
          title: "!text-sm !font-semibold !text-[var(--color-fg)]",
          description: "!text-xs !text-[var(--color-fg-muted)]",
          icon: "!text-[var(--color-fg)] [&_svg]:!h-5 [&_svg]:!w-5",
          success: "[&>div>div[data-icon]]:!text-[var(--color-success)]",
          error: "[&>div>div[data-icon]]:!text-[var(--color-danger)]",
          warning: "[&>div>div[data-icon]]:!text-[var(--color-warning)]",
          info: "[&>div>div[data-icon]]:!text-[var(--color-primary)]",
          closeButton:
            "!rounded-full !border-[var(--color-border)] !bg-[var(--color-surface)] !text-[var(--color-fg-muted)] hover:!bg-[var(--color-surface-muted)] hover:!text-[var(--color-fg)]",
        },
      }}
    />
  );
}
