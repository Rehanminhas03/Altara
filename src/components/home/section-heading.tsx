import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-faint">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 font-heading text-3xl font-semibold text-ink sm:text-4xl">
          {title}
        </h2>
        {description && <p className="mt-3 text-ink-muted">{description}</p>}
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-ink-muted transition-colors hover:text-ink"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
