"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useIsMobile, useCustomer } from "@/lib/hooks";
import {
  InputField,
  LoadingButton,
  LoadingState,
  ErrorState,
} from "@/components/shared";
import {
  cleanFormData,
  isValidEmail,
  isValidZipCode,
  toNull,
  safeJson,
} from "@/lib/utils";
import { useToast } from "@/components/ToastProvider";

export default function EditCustomer() {
  const params = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { customer, loading, error } = useCustomer(params.id as string);
  const toast = useToast();

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
  });

  // Update form data when customer is loaded
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        addressLine1: customer.addressLine1 || "",
        addressLine2: customer.addressLine2 || "",
        city: customer.city || "",
        state: customer.state || "",
        postalCode: customer.postalCode || "",
      });
    }
  }, [customer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer) return;

    setSaving(true);

    try {
      // Clean and validate form data
      const cleaned = cleanFormData(formData);

      // Basic validation
      if (!cleaned.name.trim()) {
        toast.error("Validation Error", "Customer name is required");
        setSaving(false);
        return;
      }

      if (cleaned.email && !isValidEmail(cleaned.email)) {
        toast.error("Validation Error", "Please enter a valid email address");
        setSaving(false);
        return;
      }

      if (cleaned.postalCode && !isValidZipCode(cleaned.postalCode)) {
        toast.error(
          "Validation Error",
          "Please enter a valid ZIP code (e.g., 60014 or 60014-1234)",
        );
        setSaving(false);
        return;
      }

      // Prepare payload with null conversion for optional fields
      const payload = {
        ...cleaned,
        email: toNull(cleaned.email),
        phone: toNull(cleaned.phone),
        address: toNull(cleaned.address),
        addressLine2: toNull(cleaned.addressLine2),
        city: toNull(cleaned.city),
        state: toNull(cleaned.state),
        postalCode: toNull(cleaned.postalCode),
      };

      const response = await fetch(`/api/customers/${customer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await safeJson(response);

      if (response.ok) {
        toast.success(
          "Customer Updated",
          "Customer information has been updated successfully!",
        );
        router.push(`/admin/customers/${customer.id}`);
      } else {
        toast.error(
          "Update Failed",
          result.error || "Unknown error occurred while updating customer",
        );
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error(
        "Update Failed",
        "Failed to update customer. Please try again.",
      );
    } finally {
      setSaving(false);
    }
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
              Edit Customer
            </h1>
            <p className="text-gray-600 mt-2 text-sm lg:text-base">
              {customer.name}
            </p>
          </div>
          <div className={`flex gap-3 ${isMobile ? "flex-col" : "flex-row"}`}>
            <Link
              href={`/admin/customers/${customer.id}`}
              className={`px-5 py-3 bg-transparent text-gray-600 border-2 border-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors ${isMobile ? "w-full text-center" : "w-auto"}`}
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit}>
          {/* Contact Information Section */}
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
                <InputField
                  label="Full Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter customer name"
                  required
                />

                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />

                <InputField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />

                <InputField
                  label="Address (Legacy)"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter full address"
                />
              </div>
            </div>
          </div>

          {/* Address Details Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
            <div
              className={`${isMobile ? "p-4" : "p-6"} border-b border-gray-200 bg-gray-50`}
            >
              <h2
                className={`${isMobile ? "text-xl" : "text-2xl"} font-semibold text-gray-900`}
              >
                Address Details
              </h2>
            </div>

            <div className={`${isMobile ? "p-4" : "p-6"}`}>
              <div
                className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-6`}
              >
                <InputField
                  label="Address Line 1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  placeholder="Street address, P.O. box, etc."
                />

                <InputField
                  label="Address Line 2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, unit, etc."
                />

                <InputField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                />

                <InputField
                  label="State/Province"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter state or province"
                />

                <InputField
                  label="Postal Code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Enter postal code"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center gap-4 mt-8">
            <LoadingButton
              type="submit"
              isLoading={saving}
              className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-lg font-semibold transition-colors w-full sm:w-auto min-h-[48px] min-w-[150px]"
            >
              Save Changes
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}
