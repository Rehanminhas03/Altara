import type { MetadataRoute } from "next";
import { getAllVehicleSlugs } from "@/lib/queries";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/inventory",
    "/about",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const vehicles = await getAllVehicleSlugs();
  const vehicleRoutes = vehicles.map((v) => ({
    url: `${SITE_URL}/inventory/${v.slug}`,
    lastModified: new Date(v.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...vehicleRoutes];
}
