import type { UseFormRegisterReturn } from "react-hook-form";

/** Off-screen honeypot field. Real users never fill it; bots do → dropped. */
export function Honeypot({ field }: { field: UseFormRegisterReturn }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden"
    >
      <label>
        Company
        <input tabIndex={-1} autoComplete="off" {...field} />
      </label>
    </div>
  );
}
