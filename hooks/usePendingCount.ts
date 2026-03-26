"use client";

import { useAdminSummary } from "./useAdminSummary";

/** @deprecated Prefer useAdminSummary; kept for callers that only need service-request count. */
export function usePendingCount() {
  const s = useAdminSummary();
  return {
    pendingCount: s.pendingServiceRequests,
    isLoading: s.isLoading,
    error: s.error,
    refresh: s.refresh,
  };
}
