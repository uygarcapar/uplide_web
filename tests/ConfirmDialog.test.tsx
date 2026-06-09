import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { renderWithProviders } from "./test-utils";

describe("ConfirmDialog", () => {
  it("does not render when closed", () => {
    renderWithProviders(
      <ConfirmDialog
        open={false}
        title="Delete"
        description="Are you sure?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders title and description when open", () => {
    renderWithProviders(
      <ConfirmDialog
        open
        title="Ürünü sil"
        description="Bu ürün kalıcı olarak silinecek."
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Ürünü sil")).toBeInTheDocument();
    expect(screen.getByText(/kalıcı olarak silinecek/i)).toBeInTheDocument();
  });

  it("invokes onConfirm when the confirm button is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    renderWithProviders(
      <ConfirmDialog
        open
        title="Delete"
        description="Sure?"
        confirmLabel="Sil"
        cancelLabel="Vazgeç"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Sil" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("invokes onCancel when the cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    renderWithProviders(
      <ConfirmDialog
        open
        title="Delete"
        description="Sure?"
        confirmLabel="Sil"
        cancelLabel="Vazgeç"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Vazgeç" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("disables both buttons while busy", () => {
    renderWithProviders(
      <ConfirmDialog
        open
        busy
        title="Delete"
        description="Sure?"
        confirmLabel="Sil"
        cancelLabel="Vazgeç"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: "Sil" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Vazgeç" })).toBeDisabled();
  });
});
