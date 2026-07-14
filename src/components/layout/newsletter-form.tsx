"use client";

import * as React from "react";
import { ArrowRight, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { submitEnquiry } from "@/lib/actions/enquiries";

/** Newsletter signup → persists as an `enquiries` row (kind: 'newsletter'). */
export function NewsletterForm() {
  const [email, setEmail] = React.useState("");
  const [company, setCompany] = React.useState(""); // honeypot
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "done" | "error"
  >("idle");
  const [error, setError] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setError("");
    const res = await submitEnquiry({
      kind: "newsletter",
      email,
      company,
      payload: { source: "footer" },
    });
    if (res.ok) setStatus("done");
    else {
      setStatus("error");
      setError(res.error);
    }
  }

  if (status === "done") {
    return (
      <p className="inline-flex items-center gap-2 text-sm text-ink-muted">
        <Check className="h-4 w-4 text-emerald-400" aria-hidden />
        Thanks — we&apos;ll be in touch with new arrivals.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-2">
      <div className="flex items-center gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <Input
          id="newsletter-email"
          type="email"
          required
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        {/* Honeypot */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="pointer-events-none absolute -left-[9999px] h-0 w-0"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          disabled={status === "loading"}
          className={buttonVariants({ variant: "chrome", size: "icon" })}
        >
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </form>
  );
}
