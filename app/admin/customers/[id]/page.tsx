"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useIsMobile, useCustomer } from "@/lib/hooks";
import { LoadingState, ErrorState, DeleteModal } from "@/components/shared";
import { safeJson } from "@/lib/utils";
import { useToast } from "@/components/ToastProvider";

export default function ViewCustomer() {
  const params = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { customer, loading, error } = useCustomer(params.id as string);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const handleDelete = async () => {
    if (!customer) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: "DELETE",
      });
      const result = await safeJson(response);

      if (response.ok) {
        toast.success(
          "Customer Deleted",
          "Customer has been deleted successfully!",
        );
        router.push("/admin/customers");
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
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const formatAddress = () => {
    if (!customer) return "No address provided";

    const parts = [
      customer.addressLine1,
      customer.addressLine2,
      customer.city,
      customer.state,
      customer.postalCode,
    ].filter(Boolean);

    return parts.length > 0
      ? parts.join(", ")
      : customer.address || "No address provided";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <LoadingState message="Loading customer..." isMobile={isMobile} />;
  }

  if (error) {
    return <ErrorState message={error} isMobile={isMobile} />;
  }

  if (!customer) {
    return (
      <ErrorState
        message="Customer not found"
        isMobile={isMobile}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className={`${isMobile ? "p-4" : "p-6"} bg-gray-50 min-h-screen`}>
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div
          className={`flex justify-between items-center mb-8 ${isMobile ? "flex-col gap-4" : "flex-row"}`}
        >
          <div className={isMobile ? "text-center" : "text-left"}>
            <h1
              className={`${isMobile ? "text-2xl" : "text-3xl"} font-bold text-gray-900`}
            >
              Customer Details
            </h1>
            <p className="text-gray-600 mt-2 text-sm lg:text-base">
              {customer.name}
            </p>
          </div>
          <div className={`flex gap-3 ${isMobile ? "flex-col" : "flex-row"}`}>
            <Link
              href={`/admin/customers/${customer.id}/edit`}
              className={`px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors ${isMobile ? "w-full text-center" : "w-auto"}`}
            >
              Edit Customer
            </Link>
            <Link
              href="/admin/customers"
              className={`px-5 py-3 bg-transparent text-gray-600 border-2 border-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors ${isMobile ? "w-full text-center" : "w-auto"}`}
            >
              Back to Customers
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className={`px-5 py-3 bg-red-600 hover:bg-red-700 text-white border-none rounded-lg font-semibold cursor-pointer transition-colors ${isMobile ? "w-full text-center" : "w-auto"}`}
            >
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div
            className={`${isMobile ? "p-4" : "p-6"} border-b border-gray-200 bg-gray-50`}
          >
            <h2
              className={`${isMobile ? "text-xl" : "text-2xl"} font-semibold text-gray-900`}
            >
              Contact Information
            </h2>
          </div>

          <div className={`${isMobile ? "p-4" : "p-6"}`}>
            <div
              className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-6`}
            >
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Full Name
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-base text-gray-900">
                  {customer.name}
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Email Address
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-base text-gray-900">
                  {customer.email || "No email provided"}
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Phone Number
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-base text-gray-900">
                  {customer.phone || "No phone provided"}
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Address
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-base text-gray-900 min-h-[48px] flex items-center">
                  {formatAddress()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div
            className={`${isMobile ? "p-4" : "p-6"} border-b border-gray-200 bg-gray-50`}
          >
            <h2
              className={`${isMobile ? "text-xl" : "text-2xl"} font-semibold text-gray-900`}
            >
              System Information
            </h2>
          </div>

          <div className={`${isMobile ? "p-4" : "p-6"}`}>
            <div
              className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-6`}
            >
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Customer ID
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600 font-mono">
                  {customer.id}
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Created Date
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-base text-gray-900">
                  {formatDate(customer.createdAt)}
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Last Updated
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-base text-gray-900">
                  {formatDate(customer.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
        customerName={customer.name}
        isDeleting={deleting}
      />
    </div>
  );
}
