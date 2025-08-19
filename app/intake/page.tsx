"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "../../components/Footer";

export default function IntakePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    pickupDate: "",
    services: [] as string[],
    repairNotes: "",
    waterproofingNotes: "",
    allergies: "",
  });

  // Custom checkbox styles
  const getCheckboxStyle = (isChecked: boolean) => ({
    marginRight: "12px",
    transform: "scale(1.2)",
    width: "18px",
    height: "18px",
    cursor: "pointer",
    backgroundColor: isChecked ? "#7a6990" : "white",
    border: `2px solid ${isChecked ? "#7a6990" : "#d1d5db"}`,
    borderRadius: "4px",
    appearance: "none" as const,
    WebkitAppearance: "none" as const,
    MozAppearance: "none" as const,
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "12px",
    fontWeight: "bold",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
      alert("Failed to submit form. Please try again.");
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
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#7a6990",
              color: "white",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: "2.5rem",
                marginBottom: "16px",
                fontWeight: "700",
              }}
            >
              Service Request Form
            </h1>
            <p
              style={{
                fontSize: "1.1rem",
                opacity: "0.9",
                lineHeight: "1.6",
              }}
            >
              Let us know what services you need and we&apos;ll schedule your
              pickup
            </p>
          </div>

          {/* Service Area Information */}
          <div
            style={{
              backgroundColor: "#f8fafc",
              borderTop: "1px solid #e2e8f0",
              borderBottom: "1px solid #e2e8f0",
              padding: "30px 40px",
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <span style={{ fontSize: "2rem" }}>📍</span>
            </div>
            <h3
              style={{
                color: "#7a6990",
                fontSize: "1.25rem",
                marginBottom: "12px",
                fontWeight: "600",
              }}
            >
              Service Area
            </h3>
            <p
              style={{
                color: "#6b7280",
                fontSize: "1rem",
                margin: "0 0 16px 0",
                lineHeight: "1.5",
              }}
            >
              We proudly serve the <strong>Crystal Lake, IL</strong> area with a{" "}
              <strong>25-mile radius</strong> for pickup and delivery services.
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "rgba(122, 105, 144, 0.1)",
                color: "#7a6990",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "0.9rem",
                fontWeight: "500",
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>🚚</span>
              Free pickup & delivery within service area
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: "40px" }}>
            {/* Customer Information */}
            <div style={{ marginBottom: "40px" }}>
              <h2
                style={{
                  color: "#374151",
                  fontSize: "1.5rem",
                  marginBottom: "24px",
                  fontWeight: "600",
                }}
              >
                Customer Information
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
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "1rem",
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

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "1rem",
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

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "1rem",
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
            </div>

            {/* Pickup Information */}
            <div style={{ marginBottom: "40px" }}>
              <h2
                style={{
                  color: "#374151",
                  fontSize: "1.5rem",
                  marginBottom: "24px",
                  fontWeight: "600",
                }}
              >
                Pickup Information
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
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="Please provide your full address for pickup"
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

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Preferred Pickup Date
                </label>
                <input
                  type="date"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "1rem",
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
            </div>

            {/* Services Needed */}
            <div style={{ marginBottom: "40px" }}>
              <h2
                style={{
                  color: "#374151",
                  fontSize: "1.5rem",
                  marginBottom: "24px",
                  fontWeight: "600",
                }}
              >
                Services Needed *
              </h2>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "6px",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.services.includes("cleaning")}
                    onChange={(e) =>
                      handleCheckboxChange("cleaning", e.target.checked)
                    }
                    style={getCheckboxStyle(
                      formData.services.includes("cleaning"),
                    )}
                  />
                  <span style={{ fontWeight: "500", color: "#374151" }}>
                    Cleaning
                  </span>
                </label>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "6px",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.services.includes("repairs")}
                    onChange={(e) =>
                      handleCheckboxChange("repairs", e.target.checked)
                    }
                    style={getCheckboxStyle(
                      formData.services.includes("repairs"),
                    )}
                  />
                  <span style={{ fontWeight: "500", color: "#374151" }}>
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

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "6px",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.services.includes("waterproofing")}
                    onChange={(e) =>
                      handleCheckboxChange("waterproofing", e.target.checked)
                    }
                    style={getCheckboxStyle(
                      formData.services.includes("waterproofing"),
                    )}
                  />
                  <span style={{ fontWeight: "500", color: "#374151" }}>
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
            <div style={{ marginBottom: "40px" }}>
              <h2
                style={{
                  color: "#374151",
                  fontSize: "1.5rem",
                  marginBottom: "24px",
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
            </div>

            {/* Submit Button */}
            <div style={{ textAlign: "center" }}>
              <button
                type="submit"
                disabled={isSubmitting || formData.services.length === 0}
                style={{
                  backgroundColor:
                    isSubmitting || formData.services.length === 0
                      ? "#9ca3af"
                      : "#7a6990",
                  color: "white",
                  padding: "16px 32px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor:
                    isSubmitting || formData.services.length === 0
                      ? "not-allowed"
                      : "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting && formData.services.length > 0) {
                    e.currentTarget.style.backgroundColor = "#6b5b7a";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting && formData.services.length > 0) {
                    e.currentTarget.style.backgroundColor = "#7a6990";
                  }
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit Service Request"}
              </button>

              {formData.services.length === 0 && (
                <p
                  style={{
                    color: "#ef4444",
                    marginTop: "12px",
                    fontSize: "0.9rem",
                  }}
                >
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
