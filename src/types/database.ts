export type UserRole = "full_access" | "reader";
export type ProductStatus = "active" | "draft" | "archived";
export type CustomerStatus = "active" | "inactive";

export type LocalizedText = {
  tr: string;
  en: string;
};

export type ProductRow = {
  id: string;
  name: LocalizedText;
  description: LocalizedText | null;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductInsert = Omit<ProductRow, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};
export type ProductUpdate = Partial<ProductInsert>;

export type CustomerRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  city: string | null;
  status: CustomerStatus;
  total_orders: number;
  created_at: string;
};

export type CustomerInsert = Omit<CustomerRow, "id" | "created_at" | "total_orders"> & {
  id?: string;
  created_at?: string;
  total_orders?: number;
};
export type CustomerUpdate = Partial<CustomerInsert>;

export type ProfileRow = {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
};

export type ProfileInsert = Omit<ProfileRow, "created_at"> & {
  created_at?: string;
};
export type ProfileUpdate = Partial<ProfileInsert>;

type EmptyMap = { [_ in never]: never };

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      products: {
        Row: ProductRow;
        Insert: ProductInsert;
        Update: ProductUpdate;
        Relationships: [];
      };
      customers: {
        Row: CustomerRow;
        Insert: CustomerInsert;
        Update: CustomerUpdate;
        Relationships: [];
      };
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
    };
    Views: EmptyMap;
    Functions: EmptyMap;
    Enums: {
      user_role: UserRole;
    };
    CompositeTypes: EmptyMap;
  };
};
