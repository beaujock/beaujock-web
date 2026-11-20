"use client";

import type { ChangeEvent, InputHTMLAttributes } from "react";
import type { FormState } from "@/app/actions";

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  hint?: string;
  error?: string;
  optional?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
  autoComplete?: string;
  autoCapitalize?: string;
  spellCheck?: boolean;
  suffix?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
};

export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-red-700">
      {error}
    </p>
  );
}

export function Field({ label, name, type = "text", hint, error, optional, required, textarea, rows = 3, suffix, ...rest }: FieldProps) {
  const id = `f-${name}`;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: `field ${error ? "!border-red-600" : ""} ${suffix ? "!rounded-r-none" : ""}`,
    ...rest,
  };
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {required && <span aria-hidden className="ml-0.5 text-aurora-magenta">*</span>}
        {optional && <span className="ml-1.5 font-normal text-muted">({optional})</span>}
      </label>
      {textarea ? (
        <textarea rows={rows} {...common} />
      ) : suffix ? (
        <div className="flex">
          <input type={type} {...common} />
          <span className="flex max-w-[55%] items-center truncate rounded-r-xl border border-l-0 border-night/15 bg-cloud px-3 text-sm text-muted">{suffix}</span>
        </div>
      ) : (
        <input type={type} {...common} />
      )}
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

export function FormStatus({ state }: { state: FormState }) {
  if (state.status !== "error" || !state.message) return null;
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
      {state.message}
    </div>
  );
}

/** Hidden from people; bots that fill every field get silently dropped. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
