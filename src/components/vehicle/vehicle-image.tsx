import Image from "next/image";
import type { ResolvedImage } from "@/types";
import { cn } from "@/lib/utils";
import { PlaceholderImage } from "./placeholder-image";

/**
 * Renders a resolved vehicle image — either a real photo (next/image, fill)
 * or the branded placeholder. Expects a positioned parent (relative + sized).
 */
export function VehicleImage({
  image,
  sizes,
  priority = false,
  className,
  compactPlaceholder = false,
}: {
  image: ResolvedImage;
  sizes: string;
  priority?: boolean;
  className?: string;
  compactPlaceholder?: boolean;
}) {
  if (image.isPlaceholder) {
    return (
      <PlaceholderImage
        bodyType={image.bodyType}
        compact={compactPlaceholder}
        className={className}
      />
    );
  }
  return (
    <Image
      src={image.url}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
