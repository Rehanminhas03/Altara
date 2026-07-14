"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";

const KEY = "altara:recently-viewed";
const EVENT = "altara:recent-change";
const MAX = 8;

export type RecentVehicle = {
  slug: string;
  title: string;
  year: number;
  price: number;
};

function read(): RecentVehicle[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as RecentVehicle[]) : [];
  } catch {
    return [];
  }
}

/** Records a vehicle view (call once on the detail page) — most-recent first. */
export function useRecordRecentlyViewed(vehicle: RecentVehicle | null) {
  useEffect(() => {
    if (!vehicle) return;
    const list = read().filter((v) => v.slug !== vehicle.slug);
    list.unshift(vehicle);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
      window.dispatchEvent(new Event(EVENT));
    } catch {
      /* quota / disabled — ignore */
    }
  }, [vehicle]);
}

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

/** Reads the recently-viewed list, optionally excluding one slug. */
export function useRecentlyViewed(excludeSlug?: string): RecentVehicle[] {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => {
    let list: RecentVehicle[] = [];
    try {
      list = JSON.parse(raw) as RecentVehicle[];
    } catch {
      list = [];
    }
    return list.filter((v) => v.slug !== excludeSlug);
  }, [raw, excludeSlug]);
}
