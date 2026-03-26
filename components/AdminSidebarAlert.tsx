import Link from "next/link";

/** Compact alert strip below a sidebar nav item (primary brand styling). */
export function AdminSidebarAlert({
  href,
  label,
  title,
  onClose,
  isMobile = false,
}: {
  href: string;
  label: string;
  title?: string;
  onClose?: () => void;
  isMobile?: boolean;
}) {
  const gutter = isMobile ? "mx-3" : "mx-2";

  return (
    <Link
      href={href}
      onClick={onClose}
      title={title ?? label}
      aria-label={title ?? `Open: ${label}`}
      className={`${gutter} mb-1.5 flex min-h-[40px] items-center justify-between gap-2 rounded-lg border border-primary/20 bg-primary/[0.06] px-3 py-2 text-left text-[13px] font-medium leading-snug text-[#5f4b6a] shadow-[0_1px_2px_rgba(95,75,106,0.06)] transition-colors hover:border-primary/35 hover:bg-primary/[0.11] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
    >
      <span className="min-w-0 flex-1">{label}</span>
      <span className="shrink-0 rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
        View
      </span>
    </Link>
  );
}
