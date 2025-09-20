"use client";
import { useEffect, useState, useCallback } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;
import Link from "next/link";
import { safeJson } from "@/lib/utils";
import { formatCurrency } from "@/lib/invoice-types";
import { useToast } from "@/components/ToastProvider";

type Invoice = {
  id: string;
  customerId: string;
  customer?: {
    name: string;
  };
  customerName?: string; // For backward compatibility with mock data
  invoiceNumber?: string;
  issueDate?: string;
  total: number;
  status: string;
  hostedUrl?: string;
  pdfUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  _saving?: boolean;
  statusBefore?: string;
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<{
    id: string;
    customerName: string;
  } | null>(null);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState<string | null>(
    null,
  );

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("active"); // Default to "active" (open + draft)
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [customerFilter, setCustomerFilter] = useState<string>("");

  const toast = useToast();

  // Export filtered invoices
  const exportFilteredInvoices = async () => {
    const params = new URLSearchParams();
    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        // For "active" filter, we need to export both open and draft invoices
        // We'll handle this on the backend by sending both statuses
        params.append("status", "open,draft");
      } else {
        params.append("status", statusFilter);
      }
    }
    if (yearFilter !== "all") params.append("year", yearFilter);
    if (monthFilter !== "all") params.append("month", monthFilter);
    if (customerFilter) params.append("customer", customerFilter);

    const queryString = params.toString();
    const exportUrl = `/api/export/invoices${queryString ? `?${queryString}` : ""}`;

    // Create a temporary link to trigger download
    const link = document.createElement("a");
    link.href = exportUrl;
    link.download = `invoices-filtered-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter invoices based on current filter settings
  const applyFilters = useCallback(
    (invoicesToFilter: Invoice[]) => {
      return invoicesToFilter.filter((invoice) => {
        // Status filter
        if (statusFilter !== "all") {
          if (statusFilter === "active") {
            // Show only open and draft invoices
            if (invoice.status !== "open" && invoice.status !== "draft") {
              return false;
            }
          } else if (invoice.status !== statusFilter) {
            return false;
          }
        }

        // Year filter
        if (yearFilter !== "all") {
          const invoiceYear = new Date(
            invoice.issueDate || invoice.createdAt || "",
          )
            .getFullYear()
            .toString();
          if (invoiceYear !== yearFilter) {
            return false;
          }
        }

        // Month filter
        if (monthFilter !== "all") {
          const invoiceMonth = (
            new Date(invoice.issueDate || invoice.createdAt || "").getMonth() +
            1
          ).toString();
          if (invoiceMonth !== monthFilter) {
            return false;
          }
        }

        // Customer name filter
        if (
          customerFilter &&
          !invoice.customerName
            ?.toLowerCase()
            .includes(customerFilter.toLowerCase())
        ) {
          return false;
        }

        return true;
      });
    },
    [statusFilter, yearFilter, monthFilter, customerFilter],
  );

  // Update filtered invoices when invoices or filters change
  useEffect(() => {
    setFilteredInvoices(applyFilters(invoices));
  }, [invoices, applyFilters]);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Mock data for now since the API might not be set up yet
    const mockInvoices: Invoice[] = [
      {
        id: "1",
        customerId: "mock-customer-1",
        customerName: "Sarah Johnson",
        invoiceNumber: "INV-001",
        issueDate: "2024-01-15",
        total: 24500, // $245.00 in cents
        status: "open",
      },
      {
        id: "2",
        customerId: "mock-customer-2",
        customerName: "Mike Chen",
        invoiceNumber: "INV-002",
        issueDate: "2024-01-14",
        total: 18050, // $180.50 in cents
        status: "paid",
      },
      {
        id: "3",
        customerId: "mock-customer-3",
        customerName: "Emily Rodriguez",
        invoiceNumber: "INV-003",
        issueDate: "2024-01-13",
        total: 32000, // $320.00 in cents
        status: "draft",
      },
    ];

    // Fetch real data from the API
    fetch("/api/invoices/list")
      .then((r) => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          // Normalize the data to ensure it has the expected structure
          const normalizedData = data.map((invoice) => ({
            ...invoice,
            customerName:
              invoice.customerName ||
              invoice.customer?.name ||
              "Unknown Customer",
            invoiceNumber:
              invoice.invoiceNumber || `INV-${invoice.id.slice(-6)}`,
            issueDate:
              invoice.issueDate ||
              invoice.createdAt ||
              new Date().toISOString(),
          }));
          setInvoices(normalizedData);
        } else {
          console.warn("API returned non-array data, using mock data");
          setInvoices(mockInvoices);
        }
      })
      .catch((error) => {
        console.error("Error fetching invoices, using mock data:", error);
        setInvoices(mockInvoices);
      })
      .finally(() => setLoading(false));

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const updateStatus = async (id: string, next: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: next, _saving: true } : inv,
      ),
    );
    try {
      const r = await fetch(`/api/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!r.ok) throw new Error();
    } catch {
      // revert
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === id
            ? { ...inv, status: inv.statusBefore ?? inv.status }
            : inv,
        ),
      );
      toast.error(
        "Status Update Failed",
        "Failed to update invoice status. Please try again.",
      );
    } finally {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === id
            ? { ...inv, _saving: undefined, statusBefore: undefined }
            : inv,
        ),
      );
    }
  };

  const handleDeleteInvoice = async (
    invoiceId: string,
    customerName: string,
  ) => {
    setInvoiceToDelete({ id: invoiceId, customerName });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!invoiceToDelete) return;

    console.log("Attempting to delete invoice:", invoiceToDelete);
    setDeletingInvoiceId(invoiceToDelete.id);
    try {
      const response = await fetch(`/api/invoices/${invoiceToDelete.id}`, {
        method: "DELETE",
      });

      console.log("Delete response status:", response.status);
      console.log("Delete response headers:", response.headers);

      const result = await safeJson(response);

      if (response.ok) {
        // Remove the invoice from the local state
        setInvoices((prev) =>
          prev.filter((invoice) => invoice.id !== invoiceToDelete.id),
        );
        setShowDeleteModal(false);
        setInvoiceToDelete(null);
        toast.success(
          "Invoice Deleted",
          "Invoice has been deleted successfully!",
        );
      } else {
        console.error("Delete failed with error:", result);
        toast.error(
          "Delete Failed",
          `Failed to delete invoice: ${result.error || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error(
        "Delete Failed",
        "Failed to delete invoice. Please try again.",
      );
    } finally {
      setDeletingInvoiceId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setInvoiceToDelete(null);
  };

  if (loading) {
    return (
      <div className={`${isMobile ? "p-4" : "p-6"} bg-gray-50 min-h-screen`}>
        <div className="max-w-6xl mx-auto">
          <div className={`text-center ${isMobile ? "py-10" : "py-16"}`}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <div
              className={`${isMobile ? "text-base" : "text-lg"} text-black font-medium`}
            >
              Loading invoices...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? "p-3" : "p-6"} bg-gray-50 min-h-screen`}>
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div
          className={`flex justify-between items-center ${isMobile ? "mb-6" : "mb-8"} ${isMobile ? "flex-col gap-4" : "flex-row"} ${isMobile ? "px-2" : ""}`}
        >
          <div className={isMobile ? "text-center" : "text-left"}>
            <h1
              className={`${isMobile ? "text-2xl" : "text-3xl"} font-bold text-black m-0`}
            >
              Invoice Management
            </h1>
            <p className="text-black mt-2 text-sm lg:text-base">
              Manage and track all customer invoices
            </p>
          </div>
          <Link
            href="/admin/invoices/new"
            className={`px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white no-underline rounded-lg font-semibold transition-colors ${isMobile ? "w-full text-center" : "w-auto"}`}
          >
            + New Invoice
          </Link>
        </div>

        {/* Filter Controls */}
        {invoices.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6">
            <div
              className={`${isMobile ? "p-4" : "p-6"} border-b border-gray-200 bg-gray-50`}
            >
              <h3
                className={`${isMobile ? "text-lg" : "text-xl"} font-semibold text-gray-900 m-0 ${isMobile ? "text-center" : "text-left"} mb-4`}
              >
                Filter Invoices
              </h3>

              <div
                className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"}`}
              >
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-700 cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="active">🟢 Active (Open + Draft)</option>
                    <option value="all">All Statuses</option>
                    <option value="draft">📝 Draft</option>
                    <option value="open">🔵 Open</option>
                    <option value="sent">📧 Sent (Pending Payment)</option>
                    <option value="paid">✅ Paid</option>
                    <option value="void">❌ Void</option>
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-700 cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Years</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>

                {/* Month Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Month
                  </label>
                  <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-700 cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Months</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>

                {/* Customer Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer
                  </label>
                  <input
                    type="text"
                    value={customerFilter}
                    onChange={(e) => setCustomerFilter(e.target.value)}
                    placeholder="Search by customer name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {filteredInvoices.length} of {invoices.length}{" "}
                  invoices
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setStatusFilter("active");
                      setYearFilter("all");
                      setMonthFilter("all");
                      setCustomerFilter("");
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Reset to Active
                  </button>
                  <button
                    onClick={exportFilteredInvoices}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                  >
                    📊 Export Filtered
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {invoices.length === 0 ? (
          <div
            className={`bg-white ${isMobile ? "p-10" : "p-16"} rounded-2xl shadow-lg border border-gray-200 text-center`}
          >
            <div
              className={`${isMobile ? "text-4xl" : "text-6xl"} mb-6 opacity-30`}
            >
              📄
            </div>
            <h3
              className={`${isMobile ? "text-xl" : "text-2xl"} font-semibold text-gray-900 mb-4`}
            >
              No Invoices Yet
            </h3>
            <p className="text-gray-800 mb-6 text-base lg:text-lg">
              Create your first invoice to get started
            </p>
            <Link
              href="/admin/invoices/new"
              className={`px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white no-underline rounded-lg font-semibold transition-colors ${isMobile ? "w-full" : "w-auto"} inline-block`}
            >
              Create Invoice
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div
              className={`${isMobile ? "p-4" : "p-6"} border-b border-gray-200 bg-gray-50`}
            >
              <h3
                className={`${isMobile ? "text-lg" : "text-xl"} font-semibold text-gray-900 m-0 ${isMobile ? "text-center" : "text-left"}`}
              >
                Invoice List ({filteredInvoices.length} invoices)
              </h3>
            </div>

            {/* Mobile Card Layout */}
            {isMobile ? (
              <div className="p-4">
                {filteredInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1 m-0">
                          {invoice.invoiceNumber || "N/A"}
                        </h4>
                        <p className="text-sm text-gray-800 m-0">
                          {invoice.customerName}
                        </p>
                      </div>
                      <select
                        disabled={(invoice as { _saving?: boolean })._saving}
                        value={invoice.status}
                        onChange={(e) =>
                          updateStatus(invoice.id, e.target.value)
                        }
                        className="px-2 py-1 border border-gray-300 rounded-md text-xs bg-white text-gray-700 cursor-pointer"
                      >
                        <option value="draft">📝 Draft</option>
                        <option value="open">🔵 Open</option>
                        <option value="sent">📧 Sent (Pending Payment)</option>
                        <option value="paid">✅ Paid</option>
                        <option value="void">❌ Void</option>
                      </select>
                    </div>

                    <div className="grid gap-2 text-sm mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800">Issue Date:</span>
                        <span className="text-gray-900 font-medium">
                          {invoice.issueDate
                            ? formatDate(invoice.issueDate)
                            : "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-800">Total:</span>
                        <span className="text-gray-900 font-semibold text-base">
                          {formatCurrency(Number(invoice.total))}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-center">
                      <Link
                        href={`/admin/invoices/${invoice.id}`}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white no-underline rounded-md text-sm font-medium flex-1 text-center"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/invoices/${invoice.id}/edit`}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white no-underline rounded-md text-sm font-medium flex-1 text-center"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Desktop Table Layout */
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-4 text-left border-b border-gray-200 text-gray-900 font-semibold text-sm">
                        Invoice #
                      </th>
                      <th className="p-4 text-left border-b border-gray-200 text-gray-900 font-semibold text-sm">
                        Customer
                      </th>
                      <th className="p-4 text-left border-b border-gray-200 text-gray-900 font-semibold text-sm">
                        Issue Date
                      </th>
                      <th className="p-4 text-right border-b border-gray-200 text-gray-900 font-semibold text-sm">
                        Total
                      </th>
                      <th className="p-4 text-center border-b border-gray-200 text-gray-900 font-semibold text-sm">
                        Status
                      </th>
                      <th className="p-4 text-center border-b border-gray-200 text-gray-900 font-semibold text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="p-4 text-gray-900 font-medium">
                          {invoice.invoiceNumber || "N/A"}
                        </td>
                        <td className="p-4 text-gray-900">
                          {invoice.customerName}
                        </td>
                        <td className="p-4 text-gray-800 text-sm">
                          {invoice.issueDate
                            ? formatDate(invoice.issueDate)
                            : "N/A"}
                        </td>
                        <td className="p-4 text-right text-gray-900 font-semibold">
                          {formatCurrency(Number(invoice.total))}
                        </td>
                        <td className="p-4 text-center">
                          <select
                            disabled={
                              (invoice as { _saving?: boolean })._saving
                            }
                            value={invoice.status}
                            onChange={(e) =>
                              updateStatus(invoice.id, e.target.value)
                            }
                            className="px-2 py-1 border border-gray-300 rounded-md text-xs bg-white text-gray-700 cursor-pointer"
                          >
                            <option value="draft">📝 Draft</option>
                            <option value="open">🔵 Open</option>
                            <option value="sent">
                              📧 Sent (Pending Payment)
                            </option>
                            <option value="paid">✅ Paid</option>
                            <option value="void">❌ Void</option>
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <Link
                              href={`/admin/invoices/${invoice.id}`}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white no-underline rounded text-sm font-medium"
                            >
                              View
                            </Link>
                            <Link
                              href={`/admin/invoices/${invoice.id}/edit`}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white no-underline rounded text-sm font-medium"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() =>
                                handleDeleteInvoice(
                                  invoice.id,
                                  invoice.customerName ||
                                    invoice.customer?.name ||
                                    "Unknown Customer",
                                )
                              }
                              disabled={deletingInvoiceId === invoice.id}
                              className={`px-3 py-1.5 text-white rounded text-sm font-medium transition-colors ${
                                deletingInvoiceId === invoice.id
                                  ? "bg-gray-400 cursor-not-allowed opacity-60"
                                  : "bg-red-600 hover:bg-red-700 cursor-pointer"
                              }`}
                            >
                              {deletingInvoiceId === invoice.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && invoiceToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-11/12 shadow-2xl">
            <div className="flex items-center mb-5">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mr-4">
                <span className="text-2xl text-red-600">⚠️</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 m-0">
                  Delete Invoice
                </h3>
                <p className="text-sm text-gray-700 mt-1 m-0">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-gray-800 mb-6 leading-relaxed">
              Are you sure you want to delete the invoice for{" "}
              <strong>{invoiceToDelete.customerName}</strong>?
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-5 py-2.5 bg-transparent text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingInvoiceId !== null}
                className={`px-5 py-2.5 text-white border-none rounded-lg text-sm font-semibold transition-all ${
                  deletingInvoiceId !== null
                    ? "bg-gray-500 cursor-not-allowed opacity-60"
                    : "bg-red-600 hover:bg-red-700 cursor-pointer"
                }`}
              >
                {deletingInvoiceId !== null ? "Deleting..." : "Delete Invoice"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
