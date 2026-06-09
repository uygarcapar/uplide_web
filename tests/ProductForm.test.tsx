import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductForm } from "@/components/products/ProductForm";
import { renderWithProviders, fullAccessUser } from "./test-utils";

const pushMock = vi.fn();
const refreshMock = vi.fn();
vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>(
    "next/navigation",
  );
  return {
    ...actual,
    useRouter: () => ({
      push: pushMock,
      replace: pushMock,
      refresh: refreshMock,
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
    }),
    useParams: () => ({ locale: "tr" }),
    usePathname: () => "/products/new",
  };
});

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={typeof href === "string" ? href : "#"}>{children}</a>
  ),
  usePathname: () => "/products/new",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  redirect: vi.fn(),
  getPathname: vi.fn(),
}));

const insertMock = vi.fn().mockResolvedValue({
  data: { id: "new-id" },
  error: null,
});

vi.mock("@/lib/supabase/client", () => ({
  createSupabaseBrowserClient: () => ({
    from: () => ({
      insert: () => ({
        select: () => ({
          single: () => insertMock(),
        }),
      }),
    }),
  }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("ProductForm (create mode)", () => {
  beforeEach(() => {
    pushMock.mockReset();
    refreshMock.mockReset();
    insertMock.mockClear();
  });

  it("renders all required fields", () => {
    const { container } = renderWithProviders(
      <ProductForm mode="create" locale="tr" />,
      { user: fullAccessUser },
    );
    expect(container.querySelector('input[name="name_tr"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="name_en"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="price"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="stock"]')).toBeInTheDocument();
  });

  it("shows validation errors when name fields are empty", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductForm mode="create" locale="tr" />, {
      user: fullAccessUser,
    });

    // Submit with empty name_tr / name_en
    await user.click(screen.getByRole("button", { name: /ürünü oluştur/i }));

    await waitFor(() => {
      const alerts = screen.getAllByRole("alert");
      expect(alerts.length).toBeGreaterThanOrEqual(2);
    });
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("submits when all required fields are valid", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(
      <ProductForm mode="create" locale="tr" />,
      { user: fullAccessUser },
    );

    const nameTr = container.querySelector('input[name="name_tr"]') as HTMLInputElement;
    const nameEn = container.querySelector('input[name="name_en"]') as HTMLInputElement;
    const price = container.querySelector('input[name="price"]') as HTMLInputElement;
    const stock = container.querySelector('input[name="stock"]') as HTMLInputElement;

    await user.type(nameTr, "Test Ürün");
    await user.type(nameEn, "Test Product");
    await user.clear(price);
    await user.type(price, "99.99");
    await user.clear(stock);
    await user.type(stock, "10");

    await user.click(screen.getByRole("button", { name: /ürünü oluştur/i }));

    await waitFor(() => expect(insertMock).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(pushMock).toHaveBeenCalled());
  });
});
