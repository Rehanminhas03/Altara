import { z } from "zod";

const emptyToUndef = (v: unknown) => (v === "" || v === null ? undefined : v);
const numOpt = z.preprocess(emptyToUndef, z.coerce.number().optional());
const intOpt = z.preprocess(emptyToUndef, z.coerce.number().int().optional());

export const vehicleFormSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(160),
  make: z.string().trim().min(1, "Make is required").max(60),
  model: z.string().trim().min(1, "Model is required").max(60),
  variant: z.string().trim().max(80).optional(),
  year: z.coerce
    .number()
    .int()
    .min(1950, "Check the year")
    .max(2027, "Check the year"),
  mileage: z.coerce.number().int().min(0).max(1_000_000),
  fuel: z.string().trim().min(1, "Fuel is required").max(40),
  transmission: z.string().trim().min(1, "Transmission is required").max(40),
  engine_size: numOpt,
  power_bhp: intOpt,
  colour: z.string().trim().max(40).optional(),
  body_type: z.string().trim().min(1, "Body type is required").max(40),
  doors: intOpt,
  seats: intOpt,
  price: z.coerce.number().min(0, "Price is required").max(100_000_000),
  previous_price: numOpt,
  description: z.string().trim().max(6000).optional(),
  features: z.array(z.string().trim().min(1)).default([]),
  status: z.enum(["available", "reserved", "sold"]),
  featured: z.boolean().default(false),
  reg_plate: z.string().trim().max(12).optional(),
  slug: z.string().trim().max(200).optional(),
});

export type VehicleFormValues = z.input<typeof vehicleFormSchema>;
export type VehicleFormParsed = z.output<typeof vehicleFormSchema>;
