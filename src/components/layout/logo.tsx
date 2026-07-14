import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Altara brand lockup — the transparent chrome mark from /public/logo.
 * The PNG has a real alpha channel, so it drops onto any surface cleanly.
 */
export function Logo({
  className,
  href = "/",
  priority = false,
}: {
  className?: string;
  href?: string | null;
  priority?: boolean;
}) {
  const img = (
    <Image
      src="/logo/logo.png"
      alt="Altara Automotive"
      width={327}
      height={219}
      priority={priority}
      className={cn("h-12 w-auto select-none object-contain", className)}
    />
  );

  if (!href) return img;

  return (
    <Link
      href={href}
      aria-label="Altara Automotive — home"
      className="inline-flex shrink-0 items-center"
    >
      {img}
    </Link>
  );
}
