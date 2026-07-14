import { z } from "zod";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const email = z
  .string()
  .trim()
  .max(200)
  .refine((v) => v === "" || EMAIL_RE.test(v), "Enter a valid email address");

const optionalShort = z.string().trim().max(120).optional().or(z.literal(""));
const phone = z.string().trim().max(40).optional().or(z.literal(""));
const requiredPhone = z
  .string()
  .trim()
  .min(6, "Please enter a phone number")
  .max(40);
const message = z.string().trim().max(2000).optional().or(z.literal(""));

/** Honeypot — real users never fill this; bots do. Must be empty. */
const honeypot = z.string().max(0).optional().or(z.literal(""));

/** Client schema: vehicle enquiry (general / viewing / test_drive). */
export const vehicleEnquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: email.optional().or(z.literal("")),
  phone: requiredPhone,
  message,
  preferredDate: z.string().trim().max(40).optional().or(z.literal("")),
  preferredTime: z.string().trim().max(40).optional().or(z.literal("")),
  company: honeypot,
});
export type VehicleEnquiryValues = z.infer<typeof vehicleEnquirySchema>;

/** Client schema: general contact form. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: email.optional().or(z.literal("")),
  phone: requiredPhone,
  message: z.string().trim().min(5, "Please add a short message").max(2000),
  company: honeypot,
});
export type ContactValues = z.infer<typeof contactSchema>;

/** Client schema: sell-your-car valuation intake. */
export const sellSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name").max(120),
    email: email.optional().or(z.literal("")),
    phone,
    reg: z.string().trim().min(2, "Enter your registration").max(12),
    make: optionalShort,
    model: optionalShort,
    year: z.string().trim().max(4).optional().or(z.literal("")),
    mileage: z.string().trim().max(9).optional().or(z.literal("")),
    condition: z
      .enum(["excellent", "good", "fair", "poor"])
      .optional()
      .or(z.literal("")),
    message,
    company: honeypot,
  })
  .refine((v) => Boolean(v.email) || Boolean(v.phone), {
    path: ["email"],
    message: "Provide an email or a phone number",
  });
export type SellValues = z.infer<typeof sellSchema>;

export const newsletterSchema = z.object({
  email,
  company: honeypot,
});
export type NewsletterValues = z.infer<typeof newsletterSchema>;

/** Server input schema — the authoritative shape passed to `submitEnquiry`. */
export const enquiryInputSchema = z
  .object({
    kind: z.enum(["general", "sell", "viewing", "test_drive", "newsletter"]),
    name: z.string().trim().max(120).optional().nullable(),
    email: z.string().trim().max(200).optional().nullable(),
    phone: z.string().trim().max(40).optional().nullable(),
    message: z.string().trim().max(2000).optional().nullable(),
    vehicle_id: z.string().uuid().optional().nullable(),
    payload: z.record(z.string(), z.unknown()).optional().nullable(),
    company: honeypot,
  })
  .superRefine((val, ctx) => {
    if (val.email && !EMAIL_RE.test(val.email)) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Invalid email",
      });
    }
    if (val.kind === "newsletter") {
      if (!val.email)
        ctx.addIssue({ code: "custom", path: ["email"], message: "Email required" });
      return;
    }
    if (!val.name)
      ctx.addIssue({ code: "custom", path: ["name"], message: "Name required" });
    if (!val.phone)
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Phone number required",
      });
  });
export type EnquiryInput = z.infer<typeof enquiryInputSchema>;
