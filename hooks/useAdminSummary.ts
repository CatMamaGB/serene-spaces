"use client";

import useSWR from "swr";

const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(String(r.status));
  return r.json();
};

export type AdminSummary = {
  pendingServiceRequests: number;
  unreadContactInquiries: number;
};

export function useAdminSummary() {
  const { data, error, isLoading, mutate } = useSWR<AdminSummary>(
    "/api/admin/summary",
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  );

  return {
    pendingServiceRequests: data?.pendingServiceRequests ?? 0,
    unreadContactInquiries: data?.unreadContactInquiries ?? 0,
    isLoading,
    error,
    refresh: mutate,
  };
}
