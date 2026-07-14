"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { Input, Textarea, Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Honeypot } from "./honeypot";
import { submitEnquiry } from "@/lib/actions/enquiries";
import { contactSchema, type ContactValues } from "@/lib/validators/enquiry";

export function ContactForm() {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactValues) {
    setServerError("");
    const res = await submitEnquiry({
      kind: "general",
      name: values.name,
      email: values.email,
      phone: values.phone,
      message: values.message,
      payload: { source: "contact" },
      company: values.company,
    });
    if (res.ok) setDone(true);
    else setServerError(res.error);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-hairline bg-graphite p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-400" aria-hidden />
        <p className="font-heading text-lg font-semibold text-ink">
          Message sent
        </p>
        <p className="max-w-sm text-sm text-ink-muted">
          Thanks for getting in touch — we&apos;ll reply as soon as we can,
          usually within one working day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative flex flex-col gap-5"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" error={errors.name?.message} required>
          <Input {...register("name")} autoComplete="name" />
        </Field>
        <Field label="Phone" error={errors.phone?.message} required>
          <Input type="tel" {...register("phone")} autoComplete="tel" />
        </Field>
      </div>
      <Field label="Email" error={errors.email?.message}>
        <Input type="email" {...register("email")} autoComplete="email" />
      </Field>
      <Field label="Message" error={errors.message?.message} required>
        <Textarea
          {...register("message")}
          rows={5}
          placeholder="How can we help?"
        />
      </Field>

      <Honeypot field={register("company")} />

      {serverError && <p className="text-sm text-red-400">{serverError}</p>}

      <Button
        type="submit"
        variant="chrome"
        size="lg"
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
