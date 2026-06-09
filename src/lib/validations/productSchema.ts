import { z } from "zod";

export const productCategories = [
  "electronics",
  "home",
  "food",
  "sports",
  "fashion",
  "other",
] as const;

export const productStatuses = ["active", "draft", "archived"] as const;

export const productSchema = z.object({
  name_tr: z.string().trim().min(1, "required").max(120),
  name_en: z.string().trim().min(1, "required").max(120),
  description_tr: z.string().trim().max(1000).optional().or(z.literal("")),
  description_en: z.string().trim().max(1000).optional().or(z.literal("")),
  category: z.enum(productCategories),
  price: z
    .number({ error: "required" })
    .nonnegative("min0")
    .finite(),
  stock: z
    .number({ error: "required" })
    .int("integer")
    .nonnegative("min0"),
  status: z.enum(productStatuses),
  image_url: z
    .string()
    .trim()
    .url("invalidUrl")
    .optional()
    .or(z.literal("")),
});

export type ProductFormValues = z.infer<typeof productSchema>;
