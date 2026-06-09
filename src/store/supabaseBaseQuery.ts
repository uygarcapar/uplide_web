import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { PostgrestError } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type SupabaseClient = ReturnType<typeof createSupabaseBrowserClient>;

export type SupabaseQueryArgs<T> = {
  fn: (client: SupabaseClient) => PromiseLike<{
    data: T | null;
    error: PostgrestError | null;
  }>;
};

export const supabaseBaseQuery: BaseQueryFn<
  SupabaseQueryArgs<unknown>,
  unknown,
  PostgrestError
> = async ({ fn }) => {
  const client = createSupabaseBrowserClient();
  const { data, error } = await fn(client);
  if (error) return { error };
  return { data: data ?? null };
};
