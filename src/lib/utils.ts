import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, locale: "tr" | "en") {
  return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-US", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(value: string | Date, locale: "tr" | "en") {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-US", {
    dateStyle: "medium",
  }).format(date);
}
