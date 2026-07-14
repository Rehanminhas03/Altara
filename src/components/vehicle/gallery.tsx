"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import type { ResolvedImage } from "@/types";
import { VehicleImage } from "./vehicle-image";
import { cn } from "@/lib/utils";

export function Gallery({ images }: { images: ResolvedImage[] }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = images.length;
  const current = images[active] ?? images[0];
  const canZoom = !current.isPlaceholder;

  const go = useCallback(
    (dir: number) => setActive((a) => (a + dir + count) % count),
    [count],
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, go]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  return (
    <div>
      <div
        className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-hairline bg-graphite"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <VehicleImage
          image={current}
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
        />

        {count > 1 && (
          <>
            <GalleryNav side="left" onClick={() => go(-1)} />
            <GalleryNav side="right" onClick={() => go(1)} />
            <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-obsidian/70 px-3 py-1 text-xs text-ink backdrop-blur">
              {active + 1} / {count}
            </div>
          </>
        )}

        {canZoom && (
          <button
            type="button"
            onClick={() => setLightbox(true)}
            aria-label="Expand image"
            className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-obsidian/70 text-ink backdrop-blur transition-colors hover:bg-obsidian"
          >
            <Expand className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-lg border transition-colors",
                i === active
                  ? "border-chrome-2"
                  : "border-hairline opacity-70 hover:opacity-100",
              )}
            >
              <VehicleImage
                image={img}
                sizes="120px"
                compactPlaceholder
              />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setLightbox(false)}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-steel text-ink"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
          {count > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                className="absolute left-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-steel text-ink"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-steel text-ink"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </>
          )}
          <div
            className="relative h-[80vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <VehicleImage
              image={current}
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function GalleryNav({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous image" : "Next image"}
      className={cn(
        "absolute top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-obsidian/60 text-ink opacity-0 backdrop-blur transition-opacity hover:bg-obsidian group-hover:opacity-100",
        side === "left" ? "left-3" : "right-3",
      )}
    >
      <Icon className="h-5 w-5" aria-hidden />
    </button>
  );
}
