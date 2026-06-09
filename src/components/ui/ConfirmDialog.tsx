"use client";

import { useTranslations } from "next-intl";
import { Modal } from "./Modal";
import { Button } from "./Button";

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  variant?: "primary" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  busy,
  variant = "danger",
  onConfirm,
  onCancel,
}: Props) {
  const t = useTranslations("common");
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onCancel} disabled={busy}>
            {cancelLabel ?? t("cancel")}
          </Button>
          <Button variant={variant} onClick={onConfirm} disabled={busy}>
            {confirmLabel ?? t("yes")}
          </Button>
        </>
      }
    >
      <p>{description}</p>
    </Modal>
  );
}
