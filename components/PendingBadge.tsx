import Link from "next/link";

interface PendingBadgeProps {
  count: number;
  isMobile?: boolean;
}

export function PendingBadge({ count, isMobile = false }: PendingBadgeProps) {
  if (count <= 0) return null;

  if (isMobile) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4 text-center">
        <div className="text-base font-semibold text-amber-800 mb-2">
          {count} Pending Request{count !== 1 ? "s" : ""}
        </div>
        <Link
          href="/admin/service-requests"
          className="inline-block px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-md transition-colors"
        >
          View All
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
      <span className="text-sm font-semibold text-amber-800">
        {count} Pending Request{count !== 1 ? "s" : ""}
      </span>
      <Link
        href="/admin/service-requests"
        className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded transition-colors"
      >
        View
      </Link>
    </div>
  );
}
