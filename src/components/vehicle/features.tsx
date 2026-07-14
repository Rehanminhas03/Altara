import { Check } from "lucide-react";

export function Features({ features }: { features: string[] }) {
  if (!features || features.length === 0) return null;
  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
      {features.map((f) => (
        <li key={f} className="flex items-center gap-2.5 text-sm text-ink-muted">
          <Check className="h-4 w-4 shrink-0 text-chrome-2" aria-hidden />
          {f}
        </li>
      ))}
    </ul>
  );
}
