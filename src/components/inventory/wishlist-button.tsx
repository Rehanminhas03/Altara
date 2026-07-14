"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

export function WishlistButton({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const { has, toggle } = useWishlist();
  const active = has(id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from saved" : "Save this vehicle"}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-obsidian/60 text-ink-muted backdrop-blur transition-colors hover:text-ink",
        active && "border-accent/50 text-accent",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4", active && "fill-current")} aria-hidden />
    </button>
  );
}
