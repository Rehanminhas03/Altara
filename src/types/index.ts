import type { Database } from "./database";

export type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];
export type VehicleInsert = Database["public"]["Tables"]["vehicles"]["Insert"];
export type VehicleUpdate = Database["public"]["Tables"]["vehicles"]["Update"];
export type VehicleImage =
  Database["public"]["Tables"]["vehicle_images"]["Row"];
export type Enquiry = Database["public"]["Tables"]["enquiries"]["Row"];
export type EnquiryInsert =
  Database["public"]["Tables"]["enquiries"]["Insert"];

/** A vehicle with its images joined (as returned by the list/detail queries). */
export type VehicleWithImages = Vehicle & {
  vehicle_images: VehicleImage[];
};

/** A resolved image for rendering — either a real DB row or a placeholder. */
export type ResolvedImage = {
  url: string;
  alt: string;
  isPlaceholder: boolean;
  /** Present only for real (non-placeholder) images. */
  bodyType?: string;
};
