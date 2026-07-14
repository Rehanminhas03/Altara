import * as React from "react";
import { cn } from "@/lib/utils";

/** Raised surface with a hairline border, on the graphite elevation. */
export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-hairline bg-graphite shadow-[0_2px_12px_-6px_rgba(0,0,0,0.55)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}
