import { createApi } from "@reduxjs/toolkit/query/react";
import { supabaseBaseQuery } from "../supabaseBaseQuery";
import type {
  ProductInsert,
  ProductRow,
  ProductUpdate,
} from "@/types/database";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: supabaseBaseQuery,
  tagTypes: ["Product"],
  endpoints: (build) => ({
    listProducts: build.query<ProductRow[], void>({
      query: () => ({
        fn: (client) =>
          client.from("products").select("*").order("created_at", { ascending: false }),
      }),
      transformResponse: (response: unknown) => (response as ProductRow[]) ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({ type: "Product" as const, id: p.id })),
              { type: "Product" as const, id: "LIST" },
            ]
          : [{ type: "Product" as const, id: "LIST" }],
    }),
    getProduct: build.query<ProductRow | null, string>({
      query: (id) => ({
        fn: (client) =>
          client.from("products").select("*").eq("id", id).maybeSingle(),
      }),
      transformResponse: (response: unknown) => (response as ProductRow | null) ?? null,
      providesTags: (_, __, id) => [{ type: "Product", id }],
    }),
    createProduct: build.mutation<ProductRow, ProductInsert>({
      query: (input) => ({
        fn: (client) =>
          client.from("products").insert(input).select().single(),
      }),
      transformResponse: (response: unknown) => response as ProductRow,
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: build.mutation<ProductRow, { id: string; patch: ProductUpdate }>({
      query: ({ id, patch }) => ({
        fn: (client) =>
          client.from("products").update(patch).eq("id", id).select().single(),
      }),
      transformResponse: (response: unknown) => response as ProductRow,
      invalidatesTags: (_, __, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
    deleteProduct: build.mutation<{ id: string }, string>({
      query: (id) => ({
        fn: async (client) => {
          const res = await client.from("products").delete().eq("id", id);
          return { data: res.error ? null : { id }, error: res.error };
        },
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
