"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDate } from "@/components/service-requests";
import { useAdminSummary } from "@/hooks/useAdminSummary";
import { logger } from "@/lib/logger";

type ContactInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  readAt: string | null;
  createdAt: string;
};

export default function ContactInquiriesPage() {
  const { refresh: refreshSummary } = useAdminSummary();
  const [items, setItems] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const r = await fetch("/api/contact-inquiries", { cache: "no-store" });
      const data = await r.json().catch(() => []);
      if (!r.ok) {
        setError(
          typeof data?.error === "string"
            ? data.error
            : "Could not load messages.",
        );
        setItems([]);
        return;
      }
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      logger.errorFrom("contact inquiries load", e);
      setError("Could not load messages.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const markRead = async (id: string) => {
    setMarkingId(id);
    try {
      const r = await fetch(`/api/contact-inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      if (!r.ok) {
        setError("Could not update message.");
        return;
      }
      setItems((prev) =>
        prev.map((row) =>
          row.id === id
            ? { ...row, readAt: new Date().toISOString() }
            : row,
        ),
      );
      await refreshSummary();
    } catch (e) {
      logger.errorFrom("contact inquiry mark read", e);
      setError("Could not update message.");
    } finally {
      setMarkingId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-600">Loading messages…</div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contact messages</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Submissions from the public Contact form. Unread items appear in the
          sidebar badge.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl border bg-white p-8 text-center text-gray-600">
          No contact form messages yet.
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((row) => {
            const unread = !row.readAt;
            return (
              <li
                key={row.id}
                className={`rounded-2xl border bg-white p-4 sm:p-6 shadow-sm ${
                  unread ? "border-amber-200 ring-1 ring-amber-100" : ""
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {row.name}
                      </span>
                      {unread ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                          Unread
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                          Read
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      <a
                        href={`mailto:${encodeURIComponent(row.email)}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {row.email}
                      </a>
                      {row.phone ? (
                        <>
                          {" · "}
                          <a
                            href={`tel:${row.phone.replace(/\s/g, "")}`}
                            className="text-indigo-600 hover:underline"
                          >
                            {row.phone}
                          </a>
                        </>
                      ) : null}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(row.createdAt)}
                    </p>
                  </div>
                  {unread && (
                    <button
                      type="button"
                      onClick={() => void markRead(row.id)}
                      disabled={markingId === row.id}
                      className="shrink-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-60 min-h-[44px]"
                    >
                      {markingId === row.id ? "Saving…" : "Mark read"}
                    </button>
                  )}
                </div>
                <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-800 whitespace-pre-wrap">
                  {row.message}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
