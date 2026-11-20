import en, { type Dictionary } from "./en";
import fr from "./fr";
import type { Locale } from "@/lib/i18n";

const dictionaries: Record<Locale, Dictionary> = { en, fr };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
export type { Dictionary };

/** Replace {name} placeholders. */
export function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}
