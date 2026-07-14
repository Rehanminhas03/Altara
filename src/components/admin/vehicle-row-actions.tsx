"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Star, Trash2, Loader2 } from "lucide-react";
import {
  setVehicleStatus,
  toggleFeatured,
  deleteVehicle,
} from "@/lib/actions/admin";
import { cn } from "@/lib/utils";

export function VehicleRowActions({
  id,
  featured,
  status,
}: {
  id: string;
  featured: boolean;
  status: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setOpen(false);
    startTransition(async () => {
      const res = await fn();
      if (res.ok) router.refresh();
      else alert(res.error ?? "Action failed.");
    });
  };

  const item =
    "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-ink-muted hover:bg-steel hover:text-ink";

  return (
    <div className="relative flex justify-end">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Row actions"
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-steel hover:text-ink"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <MoreHorizontal className="h-4 w-4" aria-hidden />
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="menu"
            className="absolute right-0 top-10 z-20 w-52 overflow-hidden rounded-xl border border-hairline bg-graphite py-1 shadow-xl"
          >
            <Link
              href={`/admin/vehicles/${id}/edit`}
              className={item}
              role="menuitem"
            >
              <Pencil className="h-4 w-4" aria-hidden />
              Edit
            </Link>
            <button
              type="button"
              className={item}
              role="menuitem"
              onClick={() => run(() => toggleFeatured(id, !featured))}
            >
              <Star className={cn("h-4 w-4", featured && "fill-chrome-1 text-chrome-1")} aria-hidden />
              {featured ? "Unfeature" : "Feature"}
            </button>
            <div className="my-1 border-t border-hairline" />
            {(["available", "reserved", "sold"] as const).map((s) => (
              <button
                key={s}
                type="button"
                role="menuitem"
                disabled={status === s}
                className={cn(item, status === s && "text-ink")}
                onClick={() => run(() => setVehicleStatus(id, s))}
              >
                <span className="w-4" aria-hidden />
                Mark {s}
              </button>
            ))}
            <div className="my-1 border-t border-hairline" />
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-red-400 hover:bg-steel"
              onClick={() => {
                if (confirm("Delete this vehicle and its photos? This cannot be undone."))
                  run(() => deleteVehicle(id));
              }}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
