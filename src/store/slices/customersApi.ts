import { createApi } from "@reduxjs/toolkit/query/react";
import { supabaseBaseQuery } from "../supabaseBaseQuery";
import type {
  CustomerInsert,
  CustomerRow,
  CustomerUpdate,
} from "@/types/database";

export const customersApi = createApi({
  reducerPath: "customersApi",
  baseQuery: supabaseBaseQuery,
  tagTypes: ["Customer"],
  endpoints: (build) => ({
    listCustomers: build.query<CustomerRow[], void>({
      query: () => ({
        fn: (client) =>
          client.from("customers").select("*").order("created_at", { ascending: false }),
      }),
      transformResponse: (response: unknown) => (response as CustomerRow[]) ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((c) => ({ type: "Customer" as const, id: c.id })),
              { type: "Customer" as const, id: "LIST" },
            ]
          : [{ type: "Customer" as const, id: "LIST" }],
    }),
    getCustomer: build.query<CustomerRow | null, string>({
      query: (id) => ({
        fn: (client) =>
          client.from("customers").select("*").eq("id", id).maybeSingle(),
      }),
      transformResponse: (response: unknown) => (response as CustomerRow | null) ?? null,
      providesTags: (_, __, id) => [{ type: "Customer", id }],
    }),
    createCustomer: build.mutation<CustomerRow, CustomerInsert>({
      query: (input) => ({
        fn: (client) =>
          client.from("customers").insert(input).select().single(),
      }),
      transformResponse: (response: unknown) => response as CustomerRow,
      invalidatesTags: [{ type: "Customer", id: "LIST" }],
    }),
    updateCustomer: build.mutation<CustomerRow, { id: string; patch: CustomerUpdate }>({
      query: ({ id, patch }) => ({
        fn: (client) =>
          client.from("customers").update(patch).eq("id", id).select().single(),
      }),
      transformResponse: (response: unknown) => response as CustomerRow,
      invalidatesTags: (_, __, { id }) => [
        { type: "Customer", id },
        { type: "Customer", id: "LIST" },
      ],
    }),
    deleteCustomer: build.mutation<{ id: string }, string>({
      query: (id) => ({
        fn: async (client) => {
          const res = await client.from("customers").delete().eq("id", id);
          return { data: res.error ? null : { id }, error: res.error };
        },
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Customer", id },
        { type: "Customer", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customersApi;
