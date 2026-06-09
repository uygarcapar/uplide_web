import { z } from "zod";

export const customerStatuses = ["active", "inactive"] as const;

export const customerSchema = z.object({
  full_name: z.string().trim().min(2, "minLength").max(120),
  email: z.string().trim().email("invalidEmail"),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  status: z.enum(customerStatuses),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
