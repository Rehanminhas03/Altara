"use client";

import { useRecordRecentlyViewed } from "@/hooks/use-recently-viewed";

/** Records the current vehicle into localStorage recently-viewed on mount. */
export function RecordView(props: {
  slug: string;
  title: string;
  year: number;
  price: number;
}) {
  useRecordRecentlyViewed(props);
  return null;
}
