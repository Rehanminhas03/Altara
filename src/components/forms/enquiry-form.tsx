"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { Input, Textarea, Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Honeypot } from "./honeypot";
import { submitEnquiry } from "@/lib/actions/enquiries";
import {
  vehicleEnquirySchema,
  type VehicleEnquiryValues,
} from "@/lib/validators/enquiry";

type Kind = "general" | "viewing" | "test_drive";

const CTA: Record<Kind, string> = {
  general: "Send enquiry",
  viewing: "Request viewing",
  test_drive: "Request test drive",
};

export function EnquiryForm({
  kind,
  vehicleId,
  vehicleTitle,
}: {
  kind: Kind;
  vehicleId?: string;
  vehicleTitle?: string;
}) {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VehicleEnquiryValues>({
    resolver: zodResolver(vehicleEnquirySchema),
  });

  const schedule = kind === "viewing" || kind === "test_drive";

  async function onSubmit(values: VehicleEnquiryValues) {
    setServerError("");
    const res = await submitEnquiry({
      kind,
      vehicle_id: vehicleId ?? null,
      name: values.name,
      email: values.email,
      phone: values.phone,
      message: values.message,
      payload: {
        vehicle: vehicleTitle ?? null,
        preferredDate: values.preferredDate || null,
        preferredTime: values.preferredTime || null,
      },
      company: values.company,
    });
    if (res.ok) setDone(true);
    else setServerError(res.error);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-400" aria-hidden />
        <p className="font-heading text-lg font-semibold text-ink">
          Thanks — we&apos;ll be in touch shortly.
        </p>
        <p className="max-w-xs text-sm text-ink-muted">
          Your{" "}
          {kind === "test_drive"
            ? "test-drive request"
            : kind === "viewing"
              ? "viewing request"
              : "enquiry"}{" "}
          has been received. We aim to respond within one working day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative flex flex-col gap-4"
      noValidate
    >
      <Field label="Your name" error={errors.name?.message} required>
        <Input {...register("name")} autoComplete="name" placeholder="Jane Smith" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" error={errors.email?.message}>
          <Input
            type="email"
            {...register("email")}
            autoComplete="email"
            placeholder="jane@example.com"
          />
        </Field>
        <Field label="Phone" error={errors.phone?.message} required>
          <Input
            type="tel"
            {...register("phone")}
            autoComplete="tel"
            placeholder="07000 000000"
          />
        </Field>
      </div>

      {schedule && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Preferred date">
            <Input type="date" {...register("preferredDate")} />
          </Field>
          <Field label="Preferred time">
            <Input type="time" {...register("preferredTime")} />
          </Field>
        </div>
      )}

      <Field
        label="Message"
        error={errors.message?.message}
        help={vehicleTitle ? `Regarding the ${vehicleTitle}` : undefined}
      >
        <Textarea
          {...register("message")}
          placeholder="Anything you'd like to know?"
        />
      </Field>

      <Honeypot field={register("company")} />

      <p className="text-xs text-ink-faint">
        We&apos;ll call or WhatsApp you back — email is optional.
      </p>
      {serverError && <p className="text-sm text-red-400">{serverError}</p>}

      <Button
        type="submit"
        variant="chrome"
        size="lg"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Sending…" : CTA[kind]}
      </Button>
    </form>
  );
}
