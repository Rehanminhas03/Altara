"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { enquiryInputSchema } from "@/lib/validators/enquiry";
import type { Json } from "@/types/database";

export type EnquiryResult = { ok: true } | { ok: false; error: string };

/**
 * Persists any lead (enquiry, viewing, test-drive, sell, newsletter) to the
 * `enquiries` table. RLS allows anonymous inserts. Honeypot-guarded.
 */
export async function submitEnquiry(input: unknown): Promise<EnquiryResult> {
  const parsed = enquiryInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the details and try again." };
  }
  const d = parsed.data;

  // Honeypot tripped — silently accept and drop.
  if (d.company) return { ok: true };

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "Online enquiries aren't enabled yet — please call us.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("enquiries").insert({
    kind: d.kind,
    vehicle_id: d.vehicle_id ?? null,
    name: d.name || null,
    email: d.email || null,
    phone: d.phone || null,
    message: d.message || null,
    payload: (d.payload ?? null) as unknown as Json,
  });

  if (error) {
    return {
      ok: false,
      error: "Something went wrong. Please try again or give us a call.",
    };
  }

  // Fire-and-forget email notification (only if configured). Never blocks or
  // fails the enquiry.
  await notifyByEmail(d).catch(() => {});

  return { ok: true };
}

async function notifyByEmail(
  d: ReturnType<typeof enquiryInputSchema.parse>,
): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_NOTIFY_EMAIL;
  if (!key || !to) return; // not configured — silently skip

  const from = process.env.ENQUIRY_FROM_EMAIL || "Altara <onboarding@resend.dev>";
  const body = [
    `New "${d.kind}" enquiry`,
    "",
    d.name && `Name: ${d.name}`,
    d.email && `Email: ${d.email}`,
    d.phone && `Phone: ${d.phone}`,
    d.message && `Message: ${d.message}`,
    d.payload && `Details: ${JSON.stringify(d.payload)}`,
  ]
    .filter(Boolean)
    .join("\n");

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `New ${d.kind} enquiry — Altara Automotive`,
      text: body,
    }),
  });
}
