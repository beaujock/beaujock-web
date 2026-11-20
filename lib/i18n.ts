export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const localeNames: Record<Locale, string> = { en: "English", fr: "Français" };
export const ogLocales: Record<Locale, string> = { en: "en_CA", fr: "fr_CA" };

export function formatCAD(amount: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(amount);
}
