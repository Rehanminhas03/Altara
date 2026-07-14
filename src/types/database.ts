/**
 * Database types for the Altara schema.
 *
 * Hand-authored to match supabase/migrations/0001_init.sql (kept in sync
 * manually since we provision on a separate Supabase account). Shaped like
 * `supabase gen types` output so `createClient<Database>()` gives typed queries.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type VehicleStatus = "available" | "reserved" | "sold";
export type FuelType =
  | "petrol"
  | "diesel"
  | "hybrid"
  | "plug_in_hybrid"
  | "electric";
export type TransmissionType = "manual" | "automatic" | "semi_auto";
export type EnquiryKind =
  | "general"
  | "finance"
  | "sell"
  | "viewing"
  | "test_drive"
  | "newsletter";

export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: {
          id: string;
          slug: string;
          title: string;
          make: string;
          model: string;
          variant: string | null;
          year: number;
          mileage: number;
          fuel: string;
          transmission: string;
          engine_size: number | null;
          power_bhp: number | null;
          colour: string | null;
          body_type: string;
          doors: number | null;
          seats: number | null;
          price: number;
          previous_price: number | null;
          description: string | null;
          features: string[];
          status: VehicleStatus;
          featured: boolean;
          reg_plate: string | null;
          registered_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          make: string;
          model: string;
          variant?: string | null;
          year: number;
          mileage: number;
          fuel: string;
          transmission: string;
          engine_size?: number | null;
          power_bhp?: number | null;
          colour?: string | null;
          body_type: string;
          doors?: number | null;
          seats?: number | null;
          price: number;
          previous_price?: number | null;
          description?: string | null;
          features?: string[];
          status?: VehicleStatus;
          featured?: boolean;
          reg_plate?: string | null;
          registered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["vehicles"]["Insert"]>;
        Relationships: [];
      };
      vehicle_images: {
        Row: {
          id: string;
          vehicle_id: string;
          url: string;
          storage_path: string | null;
          is_placeholder: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          url: string;
          storage_path?: string | null;
          is_placeholder?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["vehicle_images"]["Insert"]
        >;
        Relationships: [];
      };
      enquiries: {
        Row: {
          id: string;
          kind: EnquiryKind;
          vehicle_id: string | null;
          name: string | null;
          email: string | null;
          phone: string | null;
          message: string | null;
          payload: Json | null;
          handled: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          kind: EnquiryKind;
          vehicle_id?: string | null;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          message?: string | null;
          payload?: Json | null;
          handled?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["enquiries"]["Insert"]>;
        Relationships: [];
      };
      admins: {
        Row: { user_id: string; email: string | null; created_at: string };
        Insert: { user_id: string; email?: string | null; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["admins"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      vehicle_status: VehicleStatus;
      fuel_type: FuelType;
      transmission: TransmissionType;
      enquiry_kind: EnquiryKind;
    };
    CompositeTypes: Record<string, never>;
  };
}
