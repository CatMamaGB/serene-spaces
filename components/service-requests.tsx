import React from "react";

// Stable date formatter
const dt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? dateString : dt.format(date);
}

// Status badge component with consistent styling
export function StatusBadge({ value }: { value?: string }) {
  const status = (value ?? "new").toLowerCase();

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "new":
        return "bg-indigo-50 border-indigo-200 text-indigo-800";
      case "pending":
        return "bg-orange-50 border-orange-200 text-orange-800";
      case "handled":
        return "bg-green-50 border-green-200 text-green-800";
      default:
        return "bg-orange-50 border-orange-200 text-orange-800";
    }
  };

  return (
    <span
      className={`px-2 py-1 border rounded text-xs font-medium min-w-[100px] text-center ${getStatusClasses(status)}`}
    >
      {value || "New"}
    </span>
  );
}

// Action buttons component for consistent behavior
interface ActionButtonsProps {
  request: {
    id: string;
    customer: { name: string; email: string; phone: string };
    services: string[];
    address: string;
    status: string;
    createdAt: string;
  };
  onViewDetails: () => void;
  onMarkHandled: () => void;
  isMobile?: boolean;
}

export function ActionButtons({
  request,
  onViewDetails,
  onMarkHandled,
  isMobile = false,
}: ActionButtonsProps) {
  return (
    <div
      className={`flex gap-2 ${isMobile ? "flex-row items-center" : "flex-col items-start"}`}
    >
      <button
        onClick={onViewDetails}
        className={`px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-md text-sm font-medium cursor-pointer transition-colors ${
          isMobile ? "w-auto" : "w-full"
        }`}
      >
        View Details
      </button>
      {request.status === "pending" && (
        <button
          onClick={onMarkHandled}
          className={`px-3 py-2 bg-green-600 hover:bg-green-700 text-white border-none rounded-md text-sm font-medium cursor-pointer transition-colors ${
            isMobile ? "w-auto" : "w-full"
          }`}
        >
          Mark Handled
        </button>
      )}
    </div>
  );
}
