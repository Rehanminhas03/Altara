"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, Check, RotateCcw, ChevronDown, Trash2 } from "lucide-react";
import { markEnquiryHandled, deleteEnquiry } from "@/lib/actions/admin";
import { Badge } from "@/components/ui/badge";
import { humanize } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Enquiry } from "@/types";

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EnquiryItem({ enquiry }: { enquiry: Enquiry }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const payloadEntries =
    enquiry.payload && typeof enquiry.payload === "object"
      ? Object.entries(enquiry.payload as Record<string, unknown>).filter(
          ([, v]) => v !== null && v !== "" && v !== undefined,
        )
      : [];

  const toggle = () =>
    startTransition(async () => {
      const res = await markEnquiryHandled(enquiry.id, !enquiry.handled);
      if (res.ok) router.refresh();
    });

  const remove = () => {
    if (!confirm("Delete this enquiry permanently?")) return;
    startTransition(async () => {
      const res = await deleteEnquiry(enquiry.id);
      if (res.ok) router.refresh();
      else alert(res.error ?? "Could not delete.");
    });
  };

  return (
    <div
      className={cn(
        "rounded-2xl border bg-graphite p-5 transition-colors",
        enquiry.handled ? "border-hairline opacity-70" : "border-hairline",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-ink">
              {enquiry.name || "Anonymous"}
            </span>
            <Badge tone="neutral">{humanize(enquiry.kind)}</Badge>
            {!enquiry.handled && <Badge tone="accent">New</Badge>}
          </div>
          <p className="mt-1 text-xs text-ink-faint">{fmt(enquiry.created_at)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-lg border border-hairline px-3 py-1.5 text-xs text-ink-muted transition-colors hover:text-ink disabled:opacity-50"
          >
            {enquiry.handled ? (
              <>
                <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                Reopen
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden />
                Mark handled
              </>
            )}
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            aria-label="Delete enquiry"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-hairline text-ink-muted transition-colors hover:border-red-500/50 hover:text-red-400 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
        {enquiry.email && (
          <a
            href={`mailto:${enquiry.email}`}
            className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden />
            {enquiry.email}
          </a>
        )}
        {enquiry.phone && (
          <a
            href={`tel:${enquiry.phone}`}
            className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden />
            {enquiry.phone}
          </a>
        )}
      </div>

      {enquiry.message && (
        <p className="mt-3 whitespace-pre-line text-sm text-ink-muted">
          {enquiry.message}
        </p>
      )}

      {payloadEntries.length > 0 && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-1 text-xs text-ink-faint hover:text-ink"
          >
            <ChevronDown
              className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
              aria-hidden
            />
            {open ? "Hide details" : "Show details"}
          </button>
          {open && (
            <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 rounded-lg border border-hairline bg-steel/40 p-3 text-xs">
              {payloadEntries.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="capitalize text-ink-faint">{k}</dt>
                  <dd className="text-right text-ink">{String(v)}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}
    </div>
  );
}
