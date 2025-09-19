"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Customer } from "@/lib/hooks";
import { formatAddress, safeJson } from "@/lib/utils";
import { useToast } from "@/components/ToastProvider";

// Mobile Card Layout
const MobileCardLayout = ({
  customers,
  onDelete,
  deletingCustomerId,
}: {
  customers: Customer[];
  onDelete: (id: string) => void;
  deletingCustomerId: string | null;
}) => (
  <div className="lg:hidden space-y-4">
    {customers.map((customer) => (
      <div
        key={customer.id}
        className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-lg font-semibold text-gray-900">
            {customer.name}
          </h4>
          <div className="flex gap-2">
            <Link
              href={`/admin/customers/${customer.id}`}
              className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              View
            </Link>
            <Link
              href={`/admin/customers/${customer.id}/edit`}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete(customer.id)}
              disabled={deletingCustomerId === customer.id}
              className={`px-3 py-1 rounded-lg text-sm font-medium text-white transition-colors ${
                deletingCustomerId === customer.id
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {deletingCustomerId === customer.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
        <div className="text-gray-600 space-y-1">
          <div>
            <span className="font-medium">Email:</span>{" "}
            {customer.email || "N/A"}
          </div>
          <div>
            <span className="font-medium">Phone:</span>{" "}
            {customer.phone || "N/A"}
          </div>
          <div>
            <span className="font-medium">Address:</span>{" "}
            {formatAddress(customer)}
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Desktop Table Layout
const DesktopTableLayout = ({
  customers,
  onDelete,
  deletingCustomerId,
}: {
  customers: Customer[];
  onDelete: (id: string) => void;
  deletingCustomerId: string | null;
}) => (
  <div className="hidden lg:block">
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">
              Customer Name
            </th>
            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">
              Email
            </th>
            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">
              Phone
            </th>
            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">
              Address
            </th>
            <th className="py-4 px-6 text-center text-sm font-semibold text-gray-900">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-6 text-sm font-medium text-gray-900">
                {customer.name}
              </td>
              <td className="py-4 px-6 text-sm text-gray-600">
                {customer.email || "N/A"}
              </td>
              <td className="py-4 px-6 text-sm text-gray-600">
                {customer.phone || "N/A"}
              </td>
              <td className="py-4 px-6 text-sm text-gray-600">
                {formatAddress(customer)}
              </td>
              <td className="py-4 px-6 text-center">
                <div className="flex gap-2 justify-center">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/customers/${customer.id}/edit`}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete(customer.id)}
                    disabled={deletingCustomerId === customer.id}
                    className={`px-3 py-1 rounded-lg text-sm font-medium text-white transition-colors ${
                      deletingCustomerId === customer.id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {deletingCustomerId === customer.id
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
  </div>
);

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(
    null,
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null,
  );
  const toast = useToast();

  useEffect(() => {
    fetch("/api/customers")
      .then((r) => (r.ok ? r.json() : Promise.reject("Failed to fetch")))
      .then((data) => setCustomers(Array.isArray(data) ? data : []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteCustomer = async (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;

    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const confirmDeleteCustomer = async () => {
    if (!customerToDelete) return;

    setDeletingCustomerId(customerToDelete.id);
    setShowDeleteModal(false);

    try {
      const response = await fetch(`/api/customers/${customerToDelete.id}`, {
        method: "DELETE",
      });
      const result = await safeJson(response);

      if (response.ok) {
        setCustomers((prev) =>
          prev.filter((customer) => customer.id !== customerToDelete.id),
        );
        toast.success(
          "Customer Deleted",
          "Customer has been deleted successfully!",
        );
      } else {
        toast.error(
          "Delete Failed",
          `Failed to delete customer: ${result.error || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error(
        "Delete Failed",
        "Failed to delete customer. Please try again.",
      );
    } finally {
      setDeletingCustomerId(null);
      setCustomerToDelete(null);
    }
  };

  const cancelDeleteCustomer = () => {
    setShowDeleteModal(false);
    setCustomerToDelete(null);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <div className="text-lg text-gray-800 font-medium">
              Loading customers...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Customer Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your customer database and information
              </p>
            </div>
            <Link
              href="/admin/customers/new"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              + Add New Customer
            </Link>
          </div>
        </div>

        {customers.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <div className="text-gray-500 mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No customers found
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by adding your first customer.
            </p>
            <Link
              href="/admin/customers/new"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Add Customer
            </Link>
          </div>
        ) : (
          <>
            <MobileCardLayout
              customers={customers}
              onDelete={handleDeleteCustomer}
              deletingCustomerId={deletingCustomerId}
            />
            <DesktopTableLayout
              customers={customers}
              onDelete={handleDeleteCustomer}
              deletingCustomerId={deletingCustomerId}
            />
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && customerToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Delete Customer
                </h3>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete{" "}
                <strong>{customerToDelete.name}</strong>? This action cannot be
                undone.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                If this customer has associated invoices or service requests,
                you&apos;ll need to delete those first.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDeleteCustomer}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCustomer}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Delete Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
