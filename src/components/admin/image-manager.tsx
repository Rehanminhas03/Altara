"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload, Trash2, ArrowUp, ArrowDown, Star, Loader2 } from "lucide-react";
import {
  uploadVehicleImages,
  deleteVehicleImage,
  reorderVehicleImage,
} from "@/lib/actions/admin";
import type { VehicleImage } from "@/types";
import { cn } from "@/lib/utils";

export function ImageManager({
  vehicleId,
  images,
}: {
  vehicleId: string;
  images: VehicleImage[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const sorted = [...images].sort((a, b) => a.display_order - b.display_order);

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    const res = await uploadVehicleImages(vehicleId, fd);
    setUploading(false);
    if (!res.ok) setError(res.error);
    else router.refresh();
    if (inputRef.current) inputRef.current.value = "";
  }

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) =>
    startTransition(async () => {
      setError("");
      const res = await fn();
      if (!res.ok) setError(res.error ?? "Action failed.");
      else router.refresh();
    });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-hairline bg-steel/40 px-6 py-10 text-center transition-colors hover:border-chrome-3"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-chrome-2" aria-hidden />
          ) : (
            <Upload className="h-6 w-6 text-chrome-2" aria-hidden />
          )}
          <span className="text-sm font-medium text-ink">
            {uploading ? "Uploading…" : "Upload photos"}
          </span>
          <span className="text-xs text-ink-faint">
            JPG, PNG or WebP — converted to WebP automatically
          </span>
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {sorted.length === 0 ? (
        <p className="rounded-xl border border-hairline bg-graphite p-4 text-sm text-ink-faint">
          No photos yet — a branded placeholder is shown on the site until you
          upload real images.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {sorted.map((img, i) => (
            <li
              key={img.id}
              className="group relative overflow-hidden rounded-xl border border-hairline bg-graphite"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="200px"
                  className="object-cover"
                />
                {i === 0 && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-obsidian/80 px-2 py-0.5 text-[0.65rem] text-chrome-1 backdrop-blur">
                    <Star className="h-3 w-3 fill-chrome-1" aria-hidden />
                    Primary
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 p-2">
                <div className="flex gap-1">
                  <IconBtn
                    label="Move up"
                    disabled={i === 0 || pending}
                    onClick={() => run(() => reorderVehicleImage(img.id, "up"))}
                  >
                    <ArrowUp className="h-4 w-4" aria-hidden />
                  </IconBtn>
                  <IconBtn
                    label="Move down"
                    disabled={i === sorted.length - 1 || pending}
                    onClick={() => run(() => reorderVehicleImage(img.id, "down"))}
                  >
                    <ArrowDown className="h-4 w-4" aria-hidden />
                  </IconBtn>
                </div>
                <IconBtn
                  label="Delete image"
                  disabled={pending}
                  onClick={() => {
                    if (confirm("Delete this photo?"))
                      run(() => deleteVehicleImage(img.id));
                  }}
                  danger
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </IconBtn>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-hairline text-ink-muted transition-colors hover:text-ink disabled:opacity-40",
        danger && "hover:border-red-500/50 hover:text-red-400",
      )}
    >
      {children}
    </button>
  );
}
