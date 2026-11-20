"use client";

import Link from "next/link";
import { useActionState, useState, startTransition } from "react";
import { submitOrder, type FormState } from "@/app/actions";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { WebPackage } from "@/lib/packages";
import { Field, FieldError, FormStatus, Honeypot } from "./form-parts";

const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));

export default function OrderForm({
  pkg,
  lang,
  t,
  suggestions,
  subdomainSuggestions,
}: {
  pkg: WebPackage;
  lang: Locale;
  t: Dictionary;
  suggestions: string[];
  subdomainSuggestions: string[];
}) {
  const o = t.order;
  const [state, action, pending] = useActionState<FormState, FormData>(submitOrder, { status: "idle" });
  const [picked, setPicked] = useState<string[]>(["home", "contact"].filter((p) => suggestions.includes(p)));
  const [other, setOther] = useState("");
  const [domain, setDomain] = useState("");
  const otherCount = other.split(/[,\n;]/).map((s) => s.trim()).filter(Boolean).length;
  const count = picked.length + otherCount;
  const over = count > pkg.maxPages;
  const err = state.errors ?? {};

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-3xl bg-white p-8 text-center ring-1 ring-night/10 sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-aurora">
          <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7 text-night-900" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </div>
        <h2 className="mt-6 text-2xl font-bold">{o.successTitle}</h2>
        <p className="mt-3 text-muted">{o.successText}</p>
        <Link href={`/${lang}/web-presence`} className="btn btn-primary mt-8">{o.another}</Link>
      </div>
    );
  }

  return (
    <form
      noValidate={false}
      onSubmit={(e) => {
        e.preventDefault();
        if (over) return;
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
      className="space-y-8 rounded-3xl bg-white p-6 ring-1 ring-night/10 sm:p-10"
    >
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="package" value={pkg.id} />
      <Honeypot />
      <FormStatus state={state} />

      <fieldset className="space-y-5">
        <legend className="font-display text-lg font-bold text-night">{o.contactLegend}</legend>
        <Field label={o.fullName} name="fullName" autoComplete="name" required error={err.fullName} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={o.email} name="email" type="email" autoComplete="email" required error={err.email} />
          <Field label={o.phone} name="phone" type="tel" autoComplete="tel" required error={err.phone} />
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-display text-lg font-bold text-night">{o.domainLegend}</legend>
        <Field label={o.domain} name="domain" placeholder={lang === "fr" ? "votreentreprise.ca" : "yourbusiness.ca"} hint={o.domainHint} autoCapitalize="none" spellCheck={false} required error={err.domain} value={domain} onChange={(e) => setDomain(e.target.value)} />
      </fieldset>

      <fieldset aria-describedby="pages-hint pages-count" className="space-y-4">
        <legend className="font-display text-lg font-bold text-night">{o.pagesLegend}</legend>
        <p id="pages-hint" className="text-sm text-muted">{fill(o.pagesHint, { n: pkg.maxPages })}</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {suggestions.map((key) => {
            const checked = picked.includes(key);
            return (
              <label
                key={key}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                  checked ? "border-deep-cyan bg-aurora-cyan/10 font-semibold text-night" : "border-night/15 hover:border-night/30"
                }`}
              >
                <input
                  type="checkbox"
                  name="pages"
                  value={key}
                  checked={checked}
                  onChange={(e) => setPicked((p) => (e.target.checked ? [...p, key] : p.filter((x) => x !== key)))}
                  className="h-4 w-4 accent-[#0B7C8A]"
                />
                {t.pageOptions[key as keyof typeof t.pageOptions]}
              </label>
            );
          })}
        </div>
        <Field
          label={o.pagesOther}
          name="pagesOther"
          optional={o.optional}
          hint={o.pagesOtherHint}
          value={other}
          onChange={(e) => setOther(e.target.value)}
        />
        <p id="pages-count" aria-live="polite" className={`text-sm font-semibold ${over ? "text-red-700" : "text-deep-cyan"}`}>
          {fill(o.pagesCount, { count, max: pkg.maxPages })}
          {over && <span className="block font-normal">{fill(t.errors.pagesMax, { n: pkg.maxPages })}</span>}
        </p>
        <FieldError id="pages-error" error={err.pages} />
      </fieldset>

      {pkg.databases > 0 && (
        <fieldset className="space-y-5">
          <legend className="font-display text-lg font-bold text-night">{o.databaseLegend}</legend>
          <Field
            label={pkg.databases > 1 ? o.databaseLabelPlural : o.databaseLabel}
            name="database"
            textarea
            rows={4}
            hint={o.databaseHint}
            required
            error={err.database}
          />
        </fieldset>
      )}

      {pkg.subdomains > 0 && (
        <fieldset className="space-y-4">
          <legend className="font-display text-lg font-bold text-night">{o.subdomainsLegend}</legend>
          <p className="text-sm text-muted">{fill(o.subdomainsHint, { n: pkg.subdomains })}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: pkg.subdomains }, (_, i) => (
              <Field
                key={i}
                label={fill(o.subdomain, { n: i + 1 })}
                name={`subdomain${i}`}
                optional={o.optional}
                placeholder={subdomainSuggestions[i] ?? ""}
                autoCapitalize="none"
                spellCheck={false}
                suffix={`.${domain.trim().replace(/^https?:\/\//, "").replace(/^www\./, "") || (lang === "fr" ? "votredomaine.ca" : "yourdomain.ca")}`}
                error={err[`subdomain${i}`]}
              />
            ))}
          </div>
        </fieldset>
      )}

      <Field label={o.notes} name="notes" textarea rows={4} optional={o.optional} />

      <button type="submit" disabled={pending || over} className="btn btn-primary w-full !py-4 !text-base disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
        {pending ? o.sending : o.submit}
      </button>
    </form>
  );
}
