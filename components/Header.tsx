import Link from "next/link";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({ lang, t }: { lang: Locale; t: Dictionary }) {
  const links = [
    { href: `/${lang}/web-presence`, label: t.nav.webPresence },
    { href: `/${lang}#packages`, label: t.nav.packages },
    { href: `/${lang}/contact`, label: t.nav.contact },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-night/10 bg-white/85 backdrop-blur-md">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded focus:bg-white focus:px-3 focus:py-2">
        {t.nav.skip}
      </a>
      <div className="container-site flex h-16 items-center justify-between gap-4 sm:h-18">
        <Link href={`/${lang}`} className="shrink-0" aria-label={`Beaujock Enterprises, ${t.nav.home}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-horizontal-light.svg" alt="Beaujock Enterprises" width={190} height={50} className="h-10 w-auto sm:h-12" />
        </Link>

        <nav aria-label={t.nav.menu} className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="font-display text-sm font-medium text-night/80 transition hover:text-deep-cyan">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher lang={lang} label={t.nav.switchTo} title={t.nav.switchLabel} />
          <Link href={`/${lang}/web-presence`} className="btn btn-primary hidden !py-2.5 lg:inline-flex">
            {t.nav.cta}
          </Link>
          <details className="group relative md:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-night/15 text-night [&::-webkit-details-marker]:hidden" aria-label={t.nav.menu}>
              <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 group-open:hidden" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
              <svg aria-hidden viewBox="0 0 24 24" className="hidden h-5 w-5 group-open:block" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </summary>
            <nav aria-label={t.nav.menu} className="absolute right-0 top-12 w-60 rounded-2xl border border-night/10 bg-white p-2 shadow-xl">
              {[{ href: `/${lang}`, label: t.nav.home }, ...links].map((l) => (
                <Link key={l.href} href={l.href} className="block rounded-xl px-4 py-3 font-display text-sm font-medium text-night hover:bg-cloud">
                  {l.label}
                </Link>
              ))}
              <Link href={`/${lang}/web-presence`} className="btn btn-primary mt-2 w-full">{t.nav.cta}</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
