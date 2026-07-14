import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-hairline bg-graphite p-5",
        className,
      )}
    >
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="chrome-text tnum mt-2 font-heading text-3xl font-bold">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}
