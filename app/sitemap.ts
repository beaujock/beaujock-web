import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { packageIds } from "@/lib/packages";
import { siteUrl } from "@/lib/site";

const paths = ["", "/web-presence", "/contact", ...packageIds.map((id) => `/web-presence/${id}`)];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${siteUrl}/${lang}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path === "/web-presence" ? 0.9 : 0.7,
      alternates: {
        languages: Object.fromEntries([
          ...locales.map((l) => [l === "en" ? "en-CA" : "fr-CA", `${siteUrl}/${l}${path}`]),
          ["x-default", `${siteUrl}/en${path}`],
        ]),
      },
    })),
  );
}
