import type { PackageId } from "@/lib/packages";

/** Simple line icons for each package, drawn with the aurora gradient. */
export default function PackageIcon({ id, className = "h-12 w-12" }: { id: PackageId; className?: string }) {
  const gid = `pkg-grad-${id}`;
  const stroke = `url(#${gid})`;
  return (
    <svg aria-hidden viewBox="0 0 48 48" className={className} fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3FD0E0" />
          <stop offset="1" stopColor="#E04FB0" />
        </linearGradient>
      </defs>
      {id === "spider-web" && (
        <>
          <path d="M24 4v40M4 24h40M9.9 9.9l28.2 28.2M38.1 9.9 9.9 38.1" />
          <path d="M24 10l10 4 4 10-4 10-10 4-10-4-4-10 4-10z" />
          <path d="M24 17l5 2 2 5-2 5-5 2-5-2-2-5 2-5z" />
        </>
      )}
      {id === "beaver-dam" && (
        <>
          <rect x="6" y="10" width="36" height="7" rx="3.5" />
          <rect x="10" y="20.5" width="28" height="7" rx="3.5" />
          <rect x="6" y="31" width="36" height="7" rx="3.5" />
          <path d="M2 43c4-2.5 7-2.5 11 0s7 2.5 11 0 7-2.5 11 0 7 2.5 11 0" />
        </>
      )}
      {id === "bee-hive" && (
        <>
          <path d="M24 6l7 4v8l-7 4-7-4v-8z" />
          <path d="M15 21l7 4v8l-7 4-7-4v-8z" />
          <path d="M33 21l7 4v8l-7 4-7-4v-8z" />
          <path d="M24 36l7 4v2M17 42v-2l7-4" />
        </>
      )}
    </svg>
  );
}
