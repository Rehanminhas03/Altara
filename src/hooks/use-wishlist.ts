"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const KEY = "altara:wishlist";
const EVENT = "altara:wishlist-change";

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function getSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  return window.localStorage.getItem(KEY) ?? "[]";
}

const getServerSnapshot = () => "[]";

/**
 * localStorage-backed wishlist, synced across all instances and tabs via
 * useSyncExternalStore (snapshot is the raw JSON string — stable by value).
 */
export function useWishlist() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ids = useMemo<string[]>(() => {
    try {
      return JSON.parse(raw) as string[];
    } catch {
      return [];
    }
  }, [raw]);

  const toggle = useCallback((id: string) => {
    let current: string[] = [];
    try {
      current = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    } catch {
      current = [];
    }
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, toggle, has, count: ids.length };
}
