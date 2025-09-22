"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/lib/hooks";
import {
  cleanFormData,
  isValidEmail,
  isValidZipCode,
  toNull,
  safeJson,
} from "@/lib/utils";
import { useToast } from "@/components/ToastProvider";

type CustomerFormData = {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  notes: string;
};

export default function NewCustomerPage() {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();
  const toast = useToast();

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      if (!isValidEmail(cleaned.email)) {
        toast.error("Validation Error", "Please enter a valid email address");
        setSaving(false);
        return;
      }

      if (!isValidZipCode(cleaned.postalCode)) {
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
        addressLine2: toNull(cleaned.addressLine2),
        phone: toNull(cleaned.phone),
        notes: toNull(cleaned.notes),
      };

      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await safeJson(response);

      if (response.ok) {
        toast.success(
          "Customer Created",
          "Customer has been created successfully!",
        );
        setSaved(true);
        router.push("/admin/customers");
      } else {
        const errorMessage = result.error || "Unknown error";
        const errorDetails = result.details
          ? `\n\nDetails: ${result.details}`
          : "";
        toast.error(
          "Creation Failed",
          `Error saving customer: ${errorMessage}${errorDetails}`,
        );
        console.error("Customer creation failed:", result);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        "Network Error",
        "Unable to connect to server. Please check your internet connection and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className={`${isMobile ? "p-4" : "p-6"} bg-gray-50 min-h-screen`}>
      <div className="max-w-4xl mx-auto">
        <div
          className={`flex justify-between items-center mb-8 ${isMobile ? "flex-col gap-4" : "flex-row"}`}
        >
          <h1
            className={`${isMobile ? "text-2xl" : "text-3xl"} font-bold text-gray-900 ${isMobile ? "text-center" : "text-left"}`}
          >
            New Customer Intake
          </h1>
          <Link
            href="/admin/customers"
            className={`px-6 py-3 bg-transparent text-indigo-600 border-2 border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors ${isMobile ? "w-full text-center" : "w-auto"}`}
          >
            View All Customers
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            className={`bg-white ${isMobile ? "p-5" : "p-8"} rounded-2xl shadow-lg border border-gray-200`}
          >
            {/* Personal Information */}
            <div className="mb-8">
              <h2
                className={`${isMobile ? "text-xl" : "text-2xl"} font-semibold text-indigo-600 mb-6 pb-3 border-b-2 border-gray-200`}
              >
                Personal Information
              </h2>

              <div
                className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-5 mb-5`}
              >
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div
                className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-5 mb-5`}
              >
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>{/* Empty div to maintain grid layout on desktop */}</div>
              </div>
            </div>

            {/* Address Information */}
            <div className="mb-8">
              <h2
                className={`${isMobile ? "text-xl" : "text-2xl"} font-semibold text-indigo-500 mb-6 pb-3 border-b-2 border-gray-200`}
              >
                Address Information
              </h2>

              <div className="mb-5">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.addressLine1}
                  onChange={(e) =>
                    handleInputChange("addressLine1", e.target.value)
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="mb-5">
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) =>
                    handleInputChange("addressLine2", e.target.value)
                  }
                  placeholder="Apartment, suite, unit, etc."
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div
                className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-3"} gap-5`}
              >
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">
                    State *
                  </label>
                  <select
                    required
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="">Select state</option>
                    <option value="IL">Illinois</option>
                    <option value="WI">Wisconsin</option>
                    <option value="IN">Indiana</option>
                    <option value="MI">Michigan</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) =>
                      handleInputChange("postalCode", e.target.value)
                    }
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="mb-8">
              <h2
                className={`${isMobile ? "text-xl" : "text-2xl"} font-semibold text-purple-600 mb-6 pb-3 border-b-2 border-gray-200`}
              >
                Additional Information
              </h2>

              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Special Instructions or Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Any special instructions, preferences, or additional information..."
                  rows={4}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div
              className={`flex gap-4 justify-center pt-6 border-t border-gray-200 ${isMobile ? "flex-col" : "flex-row"}`}
            >
              <Link
                href="/admin/customers"
                className={`px-8 py-4 bg-transparent text-indigo-600 border-2 border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors ${isMobile ? "w-full text-center" : "w-auto"}`}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className={`inline-flex items-center justify-center px-8 py-4 ${saved ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"} text-white border-none rounded-lg font-semibold transition-colors ${saving ? "cursor-not-allowed opacity-60" : "cursor-pointer"} w-full sm:w-auto min-h-[48px]`}
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </span>
                ) : saved ? (
                  "Customer Saved!"
                ) : (
                  "Save Customer"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
