"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import {
  fetchServiceRequests,
  markServiceRequestHandled,
  updateServiceRequestNotes,
  type ServiceRequest,
} from "@/lib/api";
import {
  formatDate,
  StatusBadge,
  ActionButtons,
} from "@/components/service-requests";
import { useToast } from "@/components/ToastProvider";

export default function ServiceRequestsPage() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null,
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "new" | "pending" | "handled"
  >("all");
  const [query, setQuery] = useState("");
  const toast = useToast();

  // Centralized fetch logic
  const loadServiceRequests = async () => {
    try {
      const data = await fetchServiceRequests();
      setServiceRequests(data);
      setError(null);
    } catch (e) {
      console.error("Error fetching service requests:", e);
      setError("Couldn't load requests. Try Refresh.");
    } finally {
      setLoading(false);
    }
  };

  // Optimistic mark handled with rollback
  const markHandled = async (id: string) => {
    const previousRequests = serviceRequests;
    setServiceRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "handled" } : r)),
    );

    try {
      await markServiceRequestHandled(id);
    } catch {
      // Rollback on error
      setServiceRequests(previousRequests);
      toast.error(
        "Mark Handled Failed",
        "Failed to mark request as handled. Please try again.",
      );
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    loadServiceRequests();

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Modal escape handling
  useEffect(() => {
    if (!showDetailsModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowDetailsModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showDetailsModal]);

  // Filtered requests based on search and status filter
  const filteredRequests = serviceRequests
    .filter((r) => {
      if (statusFilter === "all") return true;
      return r.status === statusFilter;
    })
    .filter((r) => {
      const searchQuery = query.trim().toLowerCase();
      if (!searchQuery) return true;
      return (
        r.customer.name.toLowerCase().includes(searchQuery) ||
        r.customer.email.toLowerCase().includes(searchQuery) ||
        (r.address || "").toLowerCase().includes(searchQuery) ||
        (r.services ?? []).some((s) => s.toLowerCase().includes(searchQuery))
      );
    });

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <div className="text-lg text-gray-800 font-medium">
              Loading service requests...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 p-4 sm:p-6 lg:p-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Service Requests
              </h1>
              <p className="text-gray-800 text-sm sm:text-base">
                Manage incoming service requests from customers
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                aria-label="Search service requests"
                placeholder="Search name, email, service, address"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-72"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as "all" | "new" | "pending" | "handled",
                    )
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white min-h-[44px] w-full sm:w-auto"
                >
                  <option value="all">All Requests</option>
                  <option value="new">New Requests</option>
                  <option value="pending">Pending</option>
                  <option value="handled">Handled</option>
                </select>
                <button
                  onClick={() => {
                    setLoading(true);
                    loadServiceRequests();
                  }}
                  className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white border-none rounded-lg text-sm font-medium cursor-pointer transition-colors min-h-[44px] w-full sm:w-auto"
                >
                  Refresh
                </button>
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-decoration-none rounded-lg text-sm font-medium transition-colors min-h-[44px] w-full sm:w-auto"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Service Requests List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {serviceRequests.length === 0 ? (
            <div className="p-16 text-center text-gray-700">
              <div className="text-6xl mb-4 opacity-50">📋</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Service Requests
              </h3>
              <p>
                When customers submit intake forms, their requests will appear
                here.
              </p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Recent Requests ({filteredRequests.length})
                </h2>
              </div>

              {/* Requests List */}
              {isMobile ? (
                // Mobile card layout
                <div>
                  {filteredRequests.map((request, index) => (
                    <div
                      key={request.id}
                      className={`p-4 sm:p-6 ${index < filteredRequests.length - 1 ? "border-b border-gray-200" : ""} bg-white`}
                    >
                      <div className="flex flex-col gap-3 mb-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                              {request.customer.name}
                            </div>
                            <div className="text-sm sm:text-base text-gray-800 mb-2">
                              <a
                                href={`mailto:${request.customer.email}`}
                                className="text-indigo-600 hover:text-indigo-700"
                              >
                                {request.customer.email}
                              </a>
                            </div>
                            <div className="text-sm sm:text-base text-gray-800">
                              {request.address}
                            </div>
                          </div>
                          <StatusBadge value={request.status} />
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {(request.services ?? []).map((service, idx) => (
                            <span
                              key={`${service}-${idx}`}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                            >
                              {service}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-col gap-2">
                          <ActionButtons
                            request={request}
                            onViewDetails={() => {
                              setSelectedRequest(request);
                              setShowDetailsModal(true);
                            }}
                            onMarkHandled={() => markHandled(request.id)}
                            isMobile={true}
                          />
                        </div>

                        <div className="text-xs sm:text-sm text-gray-500">
                          Submitted: {formatDate(request.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Desktop table layout
                <div className="overflow-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">
                          Customer
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">
                          Services
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">
                          Address
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">
                          Submitted
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map((request) => (
                        <tr
                          key={request.id}
                          className="border-b border-gray-200 bg-white"
                        >
                          <td className="p-4 align-top">
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              {request.customer.name}
                            </div>
                            <div className="text-xs text-gray-600">
                              <a
                                href={`mailto:${request.customer.email}`}
                                className="text-indigo-600 hover:text-indigo-700"
                              >
                                {request.customer.email}
                              </a>
                            </div>
                            {request.customer.phone && (
                              <div className="text-xs text-gray-600">
                                <a
                                  href={`tel:${request.customer.phone}`}
                                  className="text-indigo-600 hover:text-indigo-700"
                                >
                                  {request.customer.phone}
                                </a>
                              </div>
                            )}
                          </td>
                          <td className="p-4 align-top">
                            <div className="flex flex-wrap gap-1">
                              {(request.services ?? []).map((service, idx) => (
                                <span
                                  key={`${service}-${idx}`}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                                >
                                  {service}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 align-top max-w-xs">
                            <div className="text-sm text-gray-700 leading-relaxed">
                              {request.address}
                            </div>
                          </td>
                          <td className="p-4 align-top">
                            <div className="text-sm text-gray-800">
                              {formatDate(request.createdAt)}
                            </div>
                          </td>
                          <td className="p-4 align-top">
                            <ActionButtons
                              request={request}
                              onViewDetails={() => {
                                setSelectedRequest(request);
                                setShowDetailsModal(true);
                              }}
                              onMarkHandled={() => markHandled(request.id)}
                              isMobile={false}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Service Request Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sr-modal-title"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold p-2 hover:bg-gray-100 rounded"
            >
              ×
            </button>

            {/* Header */}
            <div className="mb-8">
              <h2
                id="sr-modal-title"
                className="text-2xl font-semibold text-gray-900 mb-2"
              >
                Service Request Details
              </h2>
              <p className="text-gray-600 text-sm">
                Submitted on {formatDate(selectedRequest.createdAt)}
              </p>
            </div>

            {/* Customer Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                Customer Information
              </h3>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Name
                  </label>
                  <p className="text-gray-900">
                    {selectedRequest.customer.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">
                    <a
                      href={`mailto:${selectedRequest.customer.email}`}
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      {selectedRequest.customer.email}
                    </a>
                  </p>
                </div>
                {selectedRequest.customer.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Phone
                    </label>
                    <p className="text-gray-900">
                      <a
                        href={`tel:${selectedRequest.customer.phone}`}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        {selectedRequest.customer.phone}
                      </a>
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Full Address
                  </label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedRequest.address || "No address provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Requested */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                Services Requested
              </h3>
              <div className="flex flex-wrap gap-2">
                {(selectedRequest.services ?? []).map((service, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            {(selectedRequest.pickupDate ||
              selectedRequest.repairNotes ||
              selectedRequest.waterproofingNotes ||
              selectedRequest.allergies) && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                  Additional Details
                </h3>
                <div className="grid gap-4">
                  {selectedRequest.pickupDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Preferred Pickup Date
                      </label>
                      <p className="text-gray-900">
                        {(() => {
                          try {
                            const date = new Date(selectedRequest.pickupDate!);
                            if (isNaN(date.getTime())) {
                              return selectedRequest.pickupDate;
                            }
                            return date.toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            });
                          } catch {
                            return selectedRequest.pickupDate;
                          }
                        })()}
                      </p>
                    </div>
                  )}
                  {selectedRequest.repairNotes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Repair Notes
                      </label>
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {selectedRequest.repairNotes}
                      </p>
                    </div>
                  )}
                  {selectedRequest.waterproofingNotes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Waterproofing Notes
                      </label>
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {selectedRequest.waterproofingNotes}
                      </p>
                    </div>
                  )}
                  {selectedRequest.allergies && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Allergies
                      </label>
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {selectedRequest.allergies}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes Management */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                Notes & Management
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Internal Notes
                </label>
                <textarea
                  value={selectedRequest.notes || ""}
                  onChange={async (e) => {
                    try {
                      const newNotes = e.target.value;
                      await updateServiceRequestNotes(
                        selectedRequest.id,
                        newNotes,
                      );
                      setSelectedRequest({
                        ...selectedRequest,
                        notes: newNotes,
                      });
                    } catch (error) {
                      console.error("Error updating notes:", error);
                      toast.error(
                        "Update Failed",
                        "Failed to update notes. Please try again.",
                      );
                    }
                  }}
                  placeholder="Add internal notes about this request..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-y focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white border-none rounded-lg text-sm font-medium cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
