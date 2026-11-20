"use client";

import { useActionState, useState, startTransition } from "react";
import { submitContact, type FormState } from "@/app/actions";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/i18n";
import { Field, FormStatus, Honeypot } from "./form-parts";

export default function ContactForm({ lang, t }: { lang: Locale; t: Dictionary }) {
  const c = t.contact;
  const [state, action, pending] = useActionState<FormState, FormData>(submitContact, { status: "idle" });
  const [topic, setTopic] = useState<keyof typeof c.topics>("custom");
  const err = state.errors ?? {};

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-3xl bg-white p-8 text-center ring-1 ring-night/10 sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-aurora">
          <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7 text-night-900" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </div>
        <h2 className="mt-6 text-2xl font-bold">{c.successTitle}</h2>
        <p className="mt-3 text-muted">{c.successText}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
      className="space-y-6 rounded-3xl bg-white p-6 ring-1 ring-night/10 sm:p-10"
    >
      <input type="hidden" name="lang" value={lang} />
      <Honeypot />
      <FormStatus state={state} />

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink">{c.topic}</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(c.topics) as (keyof typeof c.topics)[]).map((key) => (
            <label
              key={key}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition ${
                topic === key ? "border-deep-cyan bg-aurora-cyan/10 font-semibold text-night" : "border-night/15 hover:border-night/30"
              }`}
            >
              <input type="radio" name="topic" value={key} checked={topic === key} onChange={() => setTopic(key)} className="sr-only" />
              {c.topics[key]}
            </label>
          ))}
        </div>
      </fieldset>

      <Field label={c.fullName} name="fullName" autoComplete="name" required error={err.fullName} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={c.email} name="email" type="email" autoComplete="email" required error={err.email} />
        <Field label={c.phone} name="phone" type="tel" autoComplete="tel" optional={t.order.optional} error={err.phone} />
      </div>
      <Field label={c.message} name="message" textarea rows={6} hint={c.messageHint} required error={err.message} />

      <button type="submit" disabled={pending} className="btn btn-primary w-full !py-4 !text-base disabled:opacity-60 sm:w-auto">
        {pending ? c.sending : c.submit}
      </button>
    </form>
  );
}
