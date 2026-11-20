"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export default function LanguageSwitcher({
  lang,
  label,
  title,
  className = "",
}: {
  lang: Locale;
  label: string;
  title: string;
  className?: string;
}) {
  const pathname = usePathname() || `/${lang}`;
  const target: Locale = lang === "en" ? "fr" : "en";
  const href = pathname.replace(/^\/(en|fr)(?=\/|$)/, `/${target}`);
  return (
    <Link
      href={href}
      hrefLang={target}
      lang={target}
      title={title}
      aria-label={title}
      onClick={() => {
        document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000; samesite=lax`;
      }}
      className={`inline-flex items-center gap-1.5 rounded-full border border-night/15 px-3 py-1.5 font-display text-xs font-bold text-night transition hover:border-deep-cyan hover:text-deep-cyan ${className}`}
    >
      <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
      {label}
    </Link>
  );
}
