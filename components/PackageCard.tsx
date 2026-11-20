import Link from "next/link";
import { fmt, type Dictionary } from "@/dictionaries";
import { formatCAD, type Locale } from "@/lib/i18n";
import type { WebPackage } from "@/lib/packages";
import PackageIcon from "./PackageIcon";

export function packageFeatures(pkg: WebPackage, t: Dictionary) {
  const f = t.packages.features;
  const list = [f.domain];
  if (pkg.subdomains) list.push(fmt(f.subdomains, { n: pkg.subdomains }));
  list.push(fmt(f.pages, { n: pkg.maxPages }));
  list.push(pkg.databases === 0 ? f.noDatabase : pkg.databases === 1 ? fmt(f.databases, { n: 1 }) : fmt(f.databasesPlural, { n: pkg.databases }));
  if (pkg.adminSite) list.push(f.admin);
  list.push(f.seo, f.responsive);
  return list;
}

export default function PackageCard({ pkg, lang, t, highlight = false }: { pkg: WebPackage; lang: Locale; t: Dictionary; highlight?: boolean }) {
  const copy = t.packages[pkg.id];
  return (
    <article
      className={`relative flex flex-col rounded-3xl p-7 sm:p-8 ${
        highlight ? "bg-night text-white shadow-2xl shadow-night/30 ring-1 ring-white/10" : "bg-white text-ink shadow-sm ring-1 ring-night/10"
      }`}
    >
      <PackageIcon id={pkg.id} className="h-14 w-14" />
      <h3 className={`mt-5 text-2xl font-bold ${highlight ? "text-white" : ""}`}>{copy.name}</h3>
      <p className={`mt-2 text-sm ${highlight ? "text-white/75" : "text-muted"}`}>{copy.tagline}</p>

      <div className="mt-6">
        <p className="flex items-baseline gap-2">
          <span className={`font-display text-4xl font-bold ${highlight ? "text-aurora" : "text-night"}`}>{formatCAD(pkg.setup, lang)}</span>
          <span className={`text-sm ${highlight ? "text-white/70" : "text-muted"}`}>{t.packages.setup}</span>
        </p>
        <p className={`mt-1 text-sm ${highlight ? "text-white/70" : "text-muted"}`}>
          + {fmt(t.packages.maintenance, { price: formatCAD(pkg.maintenance, lang) })}
        </p>
      </div>

      <ul className="mt-6 flex-1 space-y-3 text-sm">
        {packageFeatures(pkg, t).map((item) => (
          <li key={item} className="flex items-start gap-3">
            <svg aria-hidden viewBox="0 0 20 20" className={`mt-0.5 h-4 w-4 shrink-0 ${highlight ? "text-aurora-cyan" : "text-deep-cyan"}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 10.5l4 4 8-9" />
            </svg>
            {item}
          </li>
        ))}
      </ul>

      <Link href={`/${lang}/web-presence/${pkg.id}`} className={`btn mt-8 w-full ${highlight ? "btn-aurora" : "btn-primary"}`}>
        {copy.button}
        <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 10h12M11 5l5 5-5 5" /></svg>
      </Link>
    </article>
  );
}
