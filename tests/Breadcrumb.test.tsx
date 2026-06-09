import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { renderWithProviders } from "./test-utils";

const mockUsePathname = vi.fn();

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => mockUsePathname(),
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={typeof href === "string" ? href : "#"} {...rest}>
      {children}
    </a>
  ),
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

describe("Breadcrumb", () => {
  beforeEach(() => {
    mockUsePathname.mockReset();
  });

  it("shows only home crumb on root dashboard route", () => {
    mockUsePathname.mockReturnValue("/dashboard");
    renderWithProviders(<Breadcrumb />);
    // "Ana Sayfa" is the TR home label
    expect(screen.getByText(/ana sayfa/i)).toBeInTheDocument();
    // Active segment for dashboard should also appear
    expect(screen.getByText(/pano/i)).toBeInTheDocument();
  });

  it("renders deep path with new segment on products/new", () => {
    mockUsePathname.mockReturnValue("/products/new");
    renderWithProviders(<Breadcrumb />);
    expect(screen.getByText(/ürünler/i)).toBeInTheDocument();
    expect(screen.getByText(/yeni/i)).toBeInTheDocument();
  });

  it("marks the last crumb with aria-current and renders previous ones as links", () => {
    mockUsePathname.mockReturnValue("/products/new");
    renderWithProviders(<Breadcrumb />);
    const current = screen.getByText(/yeni/i);
    expect(current).toHaveAttribute("aria-current", "page");
    const productsLink = screen.getByRole("link", { name: /ürünler/i });
    expect(productsLink).toHaveAttribute("href", "/products");
  });

  it("skips raw UUID segments and shows the edit label", () => {
    mockUsePathname.mockReturnValue(
      "/products/3b9a0c81-3b5d-4a8e-9a1c-9e2f4d6a0001/edit",
    );
    renderWithProviders(<Breadcrumb />);
    expect(screen.getByText(/düzenle/i)).toBeInTheDocument();
    // Raw UUID should not appear
    expect(screen.queryByText(/3b9a0c81/)).not.toBeInTheDocument();
  });
});
