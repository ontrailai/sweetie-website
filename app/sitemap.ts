import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/catalog";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const pages = ["", "/shop", "/batches", "/about", "/find-us"].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const products = PRODUCTS.map((p) => ({ url: `${base}/shop/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.9 }));
  return [...pages, ...products];
}
