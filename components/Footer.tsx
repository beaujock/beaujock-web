import Link from "next/link";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/i18n";
import { packageIds } from "@/lib/packages";

export default function Footer({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <footer className="bg-night-900 text-white/75">
      <div className="h-1 bg-aurora" />
      <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-horizontal-dark.svg" alt="Beaujock Enterprises" width={228} height={60} className="h-14 w-auto" />
          <p className="mt-4 max-w-sm text-sm">{t.footer.tagline}</p>
          <p className="mt-2 text-sm">{t.contact.location}</p>
        </div>
        <div>
          <h2 className="font-display text-sm font-bold text-white">{t.footer.services}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="hover:text-aurora-cyan" href={`/${lang}/web-presence`}>{t.nav.webPresence}</Link></li>
            {packageIds.map((id) => (
              <li key={id}><Link className="hover:text-aurora-cyan" href={`/${lang}/web-presence/${id}`}>{t.packages[id].name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-sm font-bold text-white">{t.footer.company}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="hover:text-aurora-cyan" href={`/${lang}`}>{t.nav.home}</Link></li>
            <li><Link className="hover:text-aurora-cyan" href={`/${lang}/contact`}>{t.nav.contact}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-1 py-6 text-xs text-white/55 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Beaujock Enterprises. {t.footer.rights}</p>
          <p>{t.footer.tradeName}</p>
        </div>
      </div>
    </footer>
  );
}
