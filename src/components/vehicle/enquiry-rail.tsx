"use client";

import { useState } from "react";
import { MessageCircle, Phone, CalendarDays, Car, Mail } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { buttonVariants } from "@/components/ui/button";
import { Badge, statusToTone } from "@/components/ui/badge";
import { BUSINESS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Kind = "general" | "viewing" | "test_drive";

const TITLES: Record<Kind, string> = {
  general: "Enquire about this car",
  viewing: "Book a viewing",
  test_drive: "Book a test drive",
};

export function EnquiryRail({
  vehicleId,
  vehicleTitle,
  price,
  previousPrice,
  status,
}: {
  vehicleId: string;
  vehicleTitle: string;
  price: number;
  previousPrice: number | null;
  status: string;
}) {
  const [open, setOpen] = useState<Kind | null>(null);
  const tone = statusToTone(status);
  const primary = BUSINESS.phones[0];
  const waText = encodeURIComponent(
    `Hi Altara, I'm interested in the ${vehicleTitle}.`,
  );

  const actions = (
    <div className="flex flex-col gap-2.5">
      <button
        type="button"
        onClick={() => setOpen("general")}
        className={buttonVariants({ variant: "chrome", size: "lg", className: "w-full" })}
      >
        <Mail className="h-4 w-4" aria-hidden />
        Make an enquiry
      </button>
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => setOpen("viewing")}
          className={buttonVariants({ variant: "ghost", size: "md" })}
        >
          <CalendarDays className="h-4 w-4" aria-hidden />
          Viewing
        </button>
        <button
          type="button"
          onClick={() => setOpen("test_drive")}
          className={buttonVariants({ variant: "ghost", size: "md" })}
        >
          <Car className="h-4 w-4" aria-hidden />
          Test drive
        </button>
      </div>
      <a
        href={`https://wa.me/${primary.whatsapp}?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: "ghost", size: "md", className: "w-full" })}
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
        WhatsApp us
      </a>
      <div className="grid grid-cols-2 gap-2.5">
        {BUSINESS.phones.map((p) => (
          <a
            key={p.tel}
            href={`tel:${p.tel}`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Phone className="h-3.5 w-3.5" aria-hidden />
            <span className="tnum">{p.display}</span>
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sticky card */}
      <div className="hidden rounded-2xl border border-hairline bg-graphite p-6 lg:block">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="chrome-text tnum font-heading text-3xl font-bold">
              {formatPrice(price)}
            </span>
            {previousPrice && previousPrice > price && (
              <span className="tnum text-sm text-ink-faint line-through">
                {formatPrice(previousPrice)}
              </span>
            )}
          </div>
          <Badge tone={tone.tone}>{tone.label}</Badge>
        </div>
        <p className="mt-1 text-xs text-ink-faint">
          HPI clear · Nationwide delivery available
        </p>
        <div className="mt-5">{actions}</div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="theme-dark fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-obsidian/95 px-4 py-3 text-ink backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="chrome-text tnum font-heading text-lg font-bold">
              {formatPrice(price)}
            </span>
            <span className="text-[0.65rem] text-ink-faint">{tone.label}</span>
          </div>
          <div className="ml-auto flex gap-2">
            <a
              href={`tel:${primary.tel}`}
              aria-label={`Call ${primary.display}`}
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <Phone className="h-4 w-4" aria-hidden />
            </a>
            <button
              type="button"
              onClick={() => setOpen("general")}
              className={buttonVariants({ variant: "chrome", size: "md" })}
            >
              Enquire
            </button>
          </div>
        </div>
      </div>
      {/* Spacer so the fixed bar doesn't cover content on mobile */}
      <div className={cn("h-20 lg:hidden")} aria-hidden />

      <Dialog
        open={open !== null}
        onClose={() => setOpen(null)}
        title={open ? TITLES[open] : ""}
        description={vehicleTitle}
      >
        {open && (
          <EnquiryForm
            kind={open}
            vehicleId={vehicleId}
            vehicleTitle={vehicleTitle}
          />
        )}
      </Dialog>
    </>
  );
}
