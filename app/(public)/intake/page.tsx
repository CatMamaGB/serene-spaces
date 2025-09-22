"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "../../../components/Footer";
import { useToast } from "@/components/ToastProvider";

export default function IntakePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    pickupMonth: "",
    pickupDay: "",
    services: [] as string[],
    repairNotes: "",
    waterproofingNotes: "",
    allergies: "",
  });


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);
  const [daySearchTerm, setDaySearchTerm] = useState("");
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [monthSearchTerm, setMonthSearchTerm] = useState("");
  const toast = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDaySelect = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      pickupDay: day,
    }));
    setIsDayDropdownOpen(false);
    setDaySearchTerm("");
  };

  const handleMonthSelect = (month: string) => {
    setFormData((prev) => ({
      ...prev,
      pickupMonth: month,
    }));
    setIsMonthDropdownOpen(false);
    setMonthSearchTerm("");
  };

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const filteredDays = Array.from({ length: 31 }, (_, i) => i + 1)
    .map((day) => day.toString().padStart(2, '0'))
    .filter((day) => day.includes(daySearchTerm));

  const filteredMonths = months.filter((month) =>
    month.label.toLowerCase().includes(monthSearchTerm.toLowerCase())
  );

  const handleCheckboxChange = (service: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      services: checked
        ? [...prev.services, service]
        : prev.services.filter((s) => s !== service),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit form");
      }

      const result = await response.json();
      console.log("Form submitted successfully:", result);
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        "Submission Failed",
        "Failed to submit form. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            maxWidth: "500px",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: "20px",
            }}
          >
            ✅
          </div>
          <h2
            style={{
              color: "#7a6990",
              marginBottom: "16px",
              fontSize: "1.75rem",
            }}
          >
            Thank You!
          </h2>
          <p
            style={{
              color: "#6b7280",
              marginBottom: "24px",
              lineHeight: "1.6",
            }}
          >
            Your service request has been submitted successfully. We&apos;ll
            contact you within 24 hours to confirm your pickup details and
            discuss your specific needs.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              backgroundColor: "#7a6990",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "500",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.backgroundColor = "#6b5b7a";
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.backgroundColor = "#7a6990";
            }}
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        input[type="checkbox"]:checked::after {
          content: "✓";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
          font-weight: bold;
          line-height: 1;
        }
      `}</style>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#7a6990] text-white p-6 sm:p-8 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              Service Request Form
            </h1>
            <p className="text-sm sm:text-base lg:text-lg opacity-90 leading-relaxed">
              Let us know what services you need and we&apos;ll schedule your
              pickup
            </p>
          </div>

          {/* Service Area Information */}
          <div className="bg-slate-50 border-t border-b border-slate-200 p-4 sm:p-6 text-center">
            <div className="mb-4">
              <span className="text-3xl">📍</span>
            </div>
            <h3 className="text-[#7a6990] text-lg sm:text-xl font-semibold mb-3">
              Service Area
            </h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4 leading-relaxed">
              We proudly serve the <strong>Crystal Lake, IL</strong> area with a{" "}
              <strong>25-mile radius</strong> for pickup and delivery services.
            </p>
            <div className="inline-flex items-center gap-2 bg-[#7a6990]/10 text-[#7a6990] px-4 py-2 rounded-full text-sm font-medium">
              <span className="text-lg">🚚</span>
              Free pickup & delivery within service area
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8">
            {/* Customer Information */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-gray-800 text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
                Customer Information
              </h2>

              <div className="mb-4 sm:mb-5">
                <label className="block mb-2 font-medium text-gray-800">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 text-gray-800 transition-all duration-200 min-h-[48px] focus:border-[#7a6990] focus:bg-white focus:ring-4 focus:ring-[#7a6990]/10 focus:outline-none"
                />
              </div>

              <div className="mb-4 sm:mb-5">
                <label className="block mb-2 font-medium text-gray-800">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 text-gray-800 transition-all duration-200 min-h-[48px] focus:border-[#7a6990] focus:bg-white focus:ring-4 focus:ring-[#7a6990]/10 focus:outline-none"
                />
              </div>

              <div className="mb-4 sm:mb-5">
                <label className="block mb-2 font-medium text-gray-800">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50 text-gray-800 transition-all duration-200 min-h-[48px] focus:border-[#7a6990] focus:bg-white focus:ring-4 focus:ring-[#7a6990]/10 focus:outline-none"
                />
              </div>
            </div>

            {/* Pickup Information */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-gray-800 text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
                Pickup Information
              </h2>

              <div className="mb-4 sm:mb-5">
                <label className="block mb-2 font-medium text-gray-800">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="Please provide your full address for pickup"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base resize-y bg-gray-50 text-gray-800 transition-all duration-200 min-h-[80px] focus:border-[#7a6990] focus:bg-white focus:ring-4 focus:ring-[#7a6990]/10 focus:outline-none"
                />
              </div>

              <div className="mb-4 sm:mb-5">
                <label className="block mb-2 font-medium text-gray-800">
                  Preferred Pickup (Month & Day)
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    {/* Custom Month Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                        className="w-full px-4 py-3 sm:py-3 border border-gray-300 rounded-lg text-base bg-white text-gray-800 transition-all duration-200 h-[48px] sm:min-h-[48px] focus:border-[#7a6990] focus:bg-white focus:ring-4 focus:ring-[#7a6990]/10 focus:outline-none text-left flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 touch-manipulation"
                      >
                        <span className={formData.pickupMonth ? "text-gray-800" : "text-gray-500"}>
                          {formData.pickupMonth 
                            ? months.find(m => m.value === formData.pickupMonth)?.label 
                            : "Select Month"
                          }
                        </span>
                        <svg
                          className={`w-5 h-5 transition-transform duration-200 ${
                            isMonthDropdownOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {isMonthDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                          {/* Search Input */}
                          <div className="p-2 border-b border-gray-200">
                            <input
                              type="text"
                              placeholder="Search months..."
                              value={monthSearchTerm}
                              onChange={(e) => setMonthSearchTerm(e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7a6990]/20 focus:border-[#7a6990]"
                              autoFocus
                            />
                          </div>

                          {/* Month Options */}
                          <div className="max-h-48 overflow-y-auto">
                            {filteredMonths.length > 0 ? (
                              filteredMonths.map((month) => (
                                <button
                                  key={month.value}
                                  type="button"
                                  onClick={() => handleMonthSelect(month.value)}
                                  className={`w-full px-4 py-2 text-left text-sm hover:bg-[#7a6990]/10 transition-colors duration-150 ${
                                    formData.pickupMonth === month.value
                                      ? "bg-[#7a6990]/20 text-[#7a6990] font-medium"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {month.label}
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-sm text-gray-500">
                                No months found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Click outside to close */}
                    {isMonthDropdownOpen && (
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsMonthDropdownOpen(false)}
                      />
                    )}
                  </div>
                  <div className="flex-1 relative">
                    {/* Custom Day Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsDayDropdownOpen(!isDayDropdownOpen)}
                        className="w-full px-4 py-3 sm:py-3 border border-gray-300 rounded-lg text-base bg-white text-gray-800 transition-all duration-200 h-[48px] sm:min-h-[48px] focus:border-[#7a6990] focus:bg-white focus:ring-4 focus:ring-[#7a6990]/10 focus:outline-none text-left flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 touch-manipulation"
                      >
                        <span className={formData.pickupDay ? "text-gray-800" : "text-gray-500"}>
                          {formData.pickupDay || "Select Day"}
                        </span>
                        <svg
                          className={`w-5 h-5 transition-transform duration-200 ${
                            isDayDropdownOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {isDayDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                          {/* Search Input */}
                          <div className="p-2 border-b border-gray-200">
                            <input
                              type="text"
                              placeholder="Search days..."
                              value={daySearchTerm}
                              onChange={(e) => setDaySearchTerm(e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7a6990]/20 focus:border-[#7a6990]"
                              autoFocus
                            />
                          </div>

                          {/* Day Options */}
                          <div className="max-h-48 overflow-y-auto">
                            {filteredDays.length > 0 ? (
                              filteredDays.map((day) => (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() => handleDaySelect(day)}
                                  className={`w-full px-4 py-2 text-left text-sm hover:bg-[#7a6990]/10 transition-colors duration-150 ${
                                    formData.pickupDay === day
                                      ? "bg-[#7a6990]/20 text-[#7a6990] font-medium"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {parseInt(day)}
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-sm text-gray-500">
                                No days found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Click outside to close */}
                    {isDayDropdownOpen && (
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsDayDropdownOpen(false)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Services Needed */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-gray-800 text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
                Services Needed *
              </h2>

              <div style={{ marginBottom: "20px" }}>
                <label className="flex items-center gap-3 cursor-pointer mb-3 p-2 rounded-md transition-colors duration-200 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.services.includes("cleaning")}
                    onChange={(e) =>
                      handleCheckboxChange("cleaning", e.target.checked)
                    }
                    className="appearance-none h-5 w-5 rounded-[4px] border border-gray-300 grid place-content-center checked:bg-[#7a6990] checked:border-[#7a6990] focus:ring-2 focus:ring-[#7a6990]/20 focus:outline-none"
                    style={{
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      appearance: 'none',
                      width: '20px',
                      height: '20px',
                      minWidth: '20px',
                      minHeight: '20px',
                      maxWidth: '20px',
                      maxHeight: '20px',
                      backgroundSize: '12px 12px',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      backgroundImage: formData.services.includes("cleaning") 
                        ? "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e\")" 
                        : "none"
                    }}
                  />
                  <span className="font-medium text-gray-800">
                    Cleaning
                  </span>
                </label>
              </div>

              <div className="mb-4 sm:mb-5">
                <label className="flex items-center gap-3 cursor-pointer mb-3 p-2 rounded-md transition-colors duration-200 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.services.includes("repairs")}
                    onChange={(e) =>
                      handleCheckboxChange("repairs", e.target.checked)
                    }
                    className="appearance-none h-5 w-5 rounded-[4px] border border-gray-300 grid place-content-center checked:bg-[#7a6990] checked:border-[#7a6990] focus:ring-2 focus:ring-[#7a6990]/20 focus:outline-none"
                    style={{
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      appearance: 'none',
                      width: '20px',
                      height: '20px',
                      minWidth: '20px',
                      minHeight: '20px',
                      maxWidth: '20px',
                      maxHeight: '20px',
                      backgroundSize: '12px 12px',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      backgroundImage: formData.services.includes("repairs") 
                        ? "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e\")" 
                        : "none"
                    }}
                  />
                  <span className="font-medium text-gray-800">
                    Repairs
                  </span>
                </label>

                {formData.services.includes("repairs") && (
                  <div style={{ marginLeft: "24px", marginTop: "12px" }}>
                    <textarea
                      name="repairNotes"
                      value={formData.repairNotes}
                      onChange={handleInputChange}
                      placeholder="Please describe what items need repairs and any specific issues..."
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        resize: "vertical",
                        backgroundColor: "#fafafa",
                        color: "#374151",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#7a6990";
                        e.target.style.backgroundColor = "#ffffff";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(122, 105, 144, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e5e7eb";
                        e.target.style.backgroundColor = "#fafafa";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="mb-4 sm:mb-5">
                <label className="flex items-center gap-3 cursor-pointer mb-3 p-2 rounded-md transition-colors duration-200 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.services.includes("waterproofing")}
                    onChange={(e) =>
                      handleCheckboxChange("waterproofing", e.target.checked)
                    }
                    className="appearance-none h-5 w-5 rounded-[4px] border border-gray-300 grid place-content-center checked:bg-[#7a6990] checked:border-[#7a6990] focus:ring-2 focus:ring-[#7a6990]/20 focus:outline-none"
                    style={{
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      appearance: 'none',
                      width: '20px',
                      height: '20px',
                      minWidth: '20px',
                      minHeight: '20px',
                      maxWidth: '20px',
                      maxHeight: '20px',
                      backgroundSize: '12px 12px',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      backgroundImage: formData.services.includes("waterproofing") 
                        ? "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e\")" 
                        : "none"
                    }}
                  />
                  <span className="font-medium text-gray-800">
                    Waterproofing
                  </span>
                </label>

                {formData.services.includes("waterproofing") && (
                  <div style={{ marginLeft: "24px", marginTop: "12px" }}>
                    <textarea
                      name="waterproofingNotes"
                      value={formData.waterproofingNotes}
                      onChange={handleInputChange}
                      placeholder="Please list the items that need waterproofing..."
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        resize: "vertical",
                        backgroundColor: "#fafafa",
                        color: "#374151",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#7a6990";
                        e.target.style.backgroundColor = "#ffffff";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(122, 105, 144, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e5e7eb";
                        e.target.style.backgroundColor = "#fafafa";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Additional Questions */}
            <div style={{ marginBottom: "32px" }}>
              <h2
                style={{
                  color: "#374151",
                  fontSize: "1.25rem",
                  marginBottom: "20px",
                  fontWeight: "600",
                }}
              >
                Additional Information
              </h2>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Does your horse have any known allergies to detergent?
                </label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  placeholder="Please describe any allergies or sensitivities..."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "16px 16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "16px",
                    resize: "vertical",
                    backgroundColor: "#fafafa",
                    color: "#374151",
                    transition: "all 0.2s ease",
                    minHeight: "80px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#7a6990";
                    e.target.style.backgroundColor = "#ffffff";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(122, 105, 144, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.backgroundColor = "#fafafa";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting || formData.services.length === 0}
                className={`w-full py-4 px-6 rounded-lg text-base font-semibold transition-all duration-200 min-h-[48px] ${
                  isSubmitting || formData.services.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#7a6990] hover:bg-[#6b5b7a] cursor-pointer"
                } text-white`}
              >
                {isSubmitting ? "Submitting..." : "Submit Service Request"}
              </button>

              {formData.services.length === 0 && (
                <p className="text-red-500 mt-3 text-sm">
                  Please select at least one service
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
