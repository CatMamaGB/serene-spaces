import Link from "next/link";

interface PendingBadgeProps {
  count: number;
  isMobile?: boolean;
  onClose?: () => void;
  /** Defaults to service-requests list */
  href?: string;
  /** Override label, e.g. "2 unread contact messages" */
  title?: string;
}

export function PendingBadge({
  count,
  isMobile = false,
  onClose,
  href = "/admin/service-requests",
  title,
}: PendingBadgeProps) {
  if (count <= 0) return null;

  const label =
    title ?? `${count} Pending Request${count !== 1 ? "s" : ""}`;

  if (isMobile) {
    return (
      <div className="mx-3 mb-4">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
          <div className="text-sm font-semibold text-amber-800 mb-2">
            {label}
          </div>
          <Link
            href={href}
            onClick={onClose}
            className="inline-block px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-md transition-colors min-h-[40px] flex items-center justify-center"
          >
            View All
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
      <span className="text-sm font-semibold text-amber-800">{label}</span>
      <Link
        href={href}
        className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded transition-colors"
      >
        View
      </Link>
    </div>
  );
}
