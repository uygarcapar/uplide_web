"use client";

import { useAppSelector } from "@/store/hooks";
import type { UserRole } from "@/types/database";

export function useRole() {
  const user = useAppSelector((state) => state.auth.user);
  const role: UserRole | null = user?.role ?? null;
  return {
    user,
    role,
    canWrite: role === "full_access",
    isReader: role === "reader",
  };
}
