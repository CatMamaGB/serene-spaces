"use client";
import useSWR from "swr";

const fetcher = async (
  url: string,
  { signal }: { signal?: AbortSignal } = {},
) => {
  const controller = new AbortController();
  const merged = signal ? signal : controller.signal;
  const r = await fetch(url, { cache: "no-store", signal: merged });
  if (!r.ok) throw new Error(`Failed ${r.status}`);
  return r.json();
};

export function usePendingCount() {
  const { data, error, isLoading, mutate } = useSWR<number>(
    "/api/service-requests?status=pending&select=count",
    async (url) => {
      // If your API returns an array, map to data.length instead
      const res = await fetcher(url);
      return typeof res?.count === "number"
        ? res.count
        : Array.isArray(res)
          ? res.length
          : 0;
    },
    {
      refreshInterval: 0,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  );
  return { pendingCount: data ?? 0, isLoading, error, refresh: mutate };
}
