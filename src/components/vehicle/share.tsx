"use client";

import { useState } from "react";
import { Link2, Check, MessageCircle } from "lucide-react";
import { XIcon, FacebookIcon } from "@/components/layout/social-icons";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  const iconClass =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink-muted transition-colors hover:border-chrome-3 hover:text-ink";

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-sm text-ink-faint">Share</span>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Link copied" : "Copy link"}
        className={iconClass}
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-400" aria-hidden />
        ) : (
          <Link2 className="h-4 w-4" aria-hidden />
        )}
      </button>
      <a
        href={`https://wa.me/?text=${text}%20${enc}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className={iconClass}
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${enc}&text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={iconClass}
      >
        <XIcon className="h-3.5 w-3.5" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${enc}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className={iconClass}
      >
        <FacebookIcon className="h-4 w-4" />
      </a>
    </div>
  );
}
