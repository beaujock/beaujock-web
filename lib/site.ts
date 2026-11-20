import type { Locale } from "./i18n";
import { locales } from "./i18n";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://beaujock.com").replace(/\/$/, "");
export const siteName = "Beaujock Enterprises";

/** Canonical + hreflang alternates for a path that exists in every language (path starts with "/" or is ""). */
export function alternatesFor(lang: Locale, path = "") {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l === "en" ? "en-CA" : "fr-CA"] = `/${l}${path}`;
  languages["x-default"] = `/en${path}`;
  return { canonical: `/${lang}${path}`, languages };
}
