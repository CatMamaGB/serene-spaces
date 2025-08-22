"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ServiceRequest {
  id: string;
  customerId: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  services: string[];
  address: string;
  status: string;
  createdAt: string;
  pickupDate?: string;
  estimatedCost?: number;
  scheduledPickupDate?: string;
  repairNotes?: string;
  waterproofingNotes?: string;
  allergies?: string;
  notes?: string;
}

export default function ServiceRequestsPage() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null,
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showHandled, setShowHandled] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const fetchServiceRequests = async () => {
      try {
        const response = await fetch("/api/service-requests");
        console.log("Service requests response status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("Service requests data:", data);
          console.log("Number of service requests:", data.length);
          setServiceRequests(data);
        } else {
          console.log("Failed to fetch service requests");
        }
      } catch (error) {
        console.error("Error fetching service requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequests();

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "24px",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", padding: "60px" }}>
            <div style={{ fontSize: "1.2rem", color: "#666" }}>
              Loading service requests...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: isMobile ? "0" : "0",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: "2rem",
            padding: isMobile ? "1.5rem" : "2rem",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            border: "1px solid #f3f4f6",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "1rem" : "0",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: isMobile ? "1.75rem" : "2.25rem",
                  marginBottom: "0.5rem",
                  color: "#1f2937",
                  fontWeight: "700",
                }}
              >
                Service Requests
              </h1>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: isMobile ? "0.875rem" : "1rem",
                  margin: 0,
                }}
              >
                Manage incoming service requests from customers
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => setShowHandled(!showHandled)}
                style={{
                  padding: isMobile ? "0.75rem 1rem" : "0.5rem 1rem",
                  backgroundColor: showHandled ? "#6b7280" : "#7a6990",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: isMobile ? "0.875rem" : "0.875rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = showHandled
                    ? "#4b5563"
                    : "#6b5b7a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = showHandled
                    ? "#6b7280"
                    : "#7a6990";
                }}
              >
                {showHandled ? "Hide Handled" : "Show Handled"}
              </button>
              <button
                onClick={() => {
                  setLoading(true);
                  const fetchServiceRequests = async () => {
                    try {
                      const response = await fetch("/api/service-requests");
                      console.log(
                        "Service requests response status:",
                        response.status,
                      );
                      if (response.ok) {
                        const data = await response.json();
                        console.log("Service requests data:", data);
                        console.log("Number of service requests:", data.length);
                        setServiceRequests(data);
                      } else {
                        console.log("Failed to fetch service requests");
                      }
                    } catch (error) {
                      console.error("Error fetching service requests:", error);
                    } finally {
                      setLoading(false);
                    }
                  };
                  fetchServiceRequests();
                }}
                style={{
                  padding: isMobile ? "0.75rem 1rem" : "0.5rem 1rem",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: isMobile ? "0.875rem" : "0.875rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#059669";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#10b981";
                }}
              >
                Refresh
              </button>
              <Link
                href="/admin"
                style={{
                  padding: isMobile ? "0.75rem 1rem" : "0.5rem 1rem",
                  backgroundColor: "#7a6990",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontSize: isMobile ? "0.875rem" : "0.875rem",
                  fontWeight: "500",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#6b5b7a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#7a6990";
                }}
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Service Requests List */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            border: "1px solid #f3f4f6",
            overflow: "hidden",
          }}
        >
          {serviceRequests.length === 0 ? (
            <div
              style={{
                padding: "60px 24px",
                textAlign: "center",
                color: "#6b7280",
              }}
            >
              <div
                style={{
                  fontSize: "3rem",
                  marginBottom: "16px",
                  opacity: "0.5",
                }}
              >
                📋
              </div>
              <h3 style={{ marginBottom: "8px", color: "#374151" }}>
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
              <div
                style={{
                  padding: isMobile ? "1rem" : "1.5rem",
                  borderBottom: "1px solid #f3f4f6",
                  backgroundColor: "#f9fafb",
                }}
              >
                <h2
                  style={{
                    fontSize: isMobile ? "1.125rem" : "1.25rem",
                    color: "#1f2937",
                    fontWeight: "600",
                    margin: 0,
                  }}
                >
                  Recent Requests ({serviceRequests.length})
                </h2>
              </div>

              {/* Requests List */}
              {isMobile ? (
                // Mobile card layout
                <div style={{ padding: "0" }}>
                  {serviceRequests
                    .filter(
                      (request) => showHandled || request.status !== "handled",
                    )
                    .map((request, index) => (
                      <div
                        key={request.id}
                        style={{
                          padding: "1rem",
                          borderBottom:
                            index < serviceRequests.length - 1
                              ? "1px solid #f3f4f6"
                              : "none",
                          backgroundColor: "white",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "0.75rem",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: "1rem",
                                fontWeight: "600",
                                color: "#1f2937",
                                marginBottom: "0.25rem",
                              }}
                            >
                              {request.customer.name}
                            </div>
                            <div
                              style={{
                                fontSize: "0.875rem",
                                color: "#6b7280",
                                marginBottom: "0.5rem",
                              }}
                            >
                              {request.customer.email}
                            </div>
                            <div
                              style={{
                                fontSize: "0.875rem",
                                color: "#6b7280",
                              }}
                            >
                              {request.address}
                            </div>
                          </div>
                          <div
                            style={{
                              padding: "0.25rem 0.5rem",
                              border: "1px solid #d1d5db",
                              borderRadius: "4px",
                              fontSize: "0.75rem",
                              backgroundColor: "#f3f4f6",
                              color: "#6b7280",
                              minWidth: "100px",
                              textAlign: "center",
                            }}
                          >
                            {request.status || "New"}
                          </div>
                          {request.status === "pending" && (
                            <button
                              onClick={async () => {
                                try {
                                  const response = await fetch(
                                    "/api/service-requests",
                                    {
                                      method: "PUT",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        id: request.id,
                                        status: "handled",
                                      }),
                                    },
                                  );
                                  if (response.ok) {
                                    // Update local state
                                    setServiceRequests((prev) =>
                                      prev.map((req) =>
                                        req.id === request.id
                                          ? { ...req, status: "handled" }
                                          : req,
                                      ),
                                    );
                                  }
                                } catch (error) {
                                  console.error(
                                    "Error marking as handled:",
                                    error,
                                  );
                                }
                              }}
                              style={{
                                padding: "0.25rem 0.5rem",
                                backgroundColor: "#10b981",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                cursor: "pointer",
                                marginTop: "0.25rem",
                              }}
                            >
                              Mark Handled
                            </button>
                          )}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                            marginBottom: "0.75rem",
                          }}
                        >
                          {request.services.map((service, idx) => (
                            <span
                              key={idx}
                              style={{
                                padding: "0.25rem 0.5rem",
                                backgroundColor: "#f3f4f6",
                                color: "#374151",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                fontWeight: "500",
                              }}
                            >
                              {service}
                            </span>
                          ))}
                        </div>

                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#6b7280",
                          }}
                        >
                          Submitted: {formatDate(request.createdAt)}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                // Desktop table layout
                <div style={{ overflow: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "#f9fafb",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <th
                          style={{
                            padding: "1rem 1.5rem",
                            textAlign: "left",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: "#374151",
                          }}
                        >
                          Customer
                        </th>
                        <th
                          style={{
                            padding: "1rem 1.5rem",
                            textAlign: "left",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: "#374151",
                          }}
                        >
                          Services
                        </th>
                        <th
                          style={{
                            padding: "1rem 1.5rem",
                            textAlign: "left",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: "#374151",
                          }}
                        >
                          Address
                        </th>

                        <th
                          style={{
                            padding: "1rem 1.5rem",
                            textAlign: "left",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: "#374151",
                          }}
                        >
                          Submitted
                        </th>
                        <th
                          style={{
                            padding: "1rem 1.5rem",
                            textAlign: "left",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: "#374151",
                          }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceRequests
                        .filter(
                          (request) =>
                            showHandled || request.status !== "handled",
                        )
                        .map((request) => (
                          <tr
                            key={request.id}
                            style={{
                              borderBottom: "1px solid #f3f4f6",
                              backgroundColor: "white",
                            }}
                          >
                            <td
                              style={{
                                padding: "1rem 1.5rem",
                                verticalAlign: "top",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "0.875rem",
                                  fontWeight: "500",
                                  color: "#1f2937",
                                  marginBottom: "0.25rem",
                                }}
                              >
                                {request.customer.name}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#6b7280",
                                }}
                              >
                                {request.customer.email}
                              </div>
                              {request.customer.phone && (
                                <div
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "#6b7280",
                                  }}
                                >
                                  {request.customer.phone}
                                </div>
                              )}
                            </td>
                            <td
                              style={{
                                padding: "1rem 1.5rem",
                                verticalAlign: "top",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "0.25rem",
                                }}
                              >
                                {request.services.map((service, idx) => (
                                  <span
                                    key={idx}
                                    style={{
                                      padding: "0.25rem 0.5rem",
                                      backgroundColor: "#f3f4f6",
                                      color: "#374151",
                                      borderRadius: "4px",
                                      fontSize: "0.75rem",
                                      fontWeight: "500",
                                    }}
                                  >
                                    {service}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td
                              style={{
                                padding: "1rem 1.5rem",
                                verticalAlign: "top",
                                maxWidth: "200px",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "0.875rem",
                                  color: "#374151",
                                  lineHeight: "1.4",
                                }}
                              >
                                {request.address}
                              </div>
                            </td>

                            <td
                              style={{
                                padding: "1rem 1.5rem",
                                verticalAlign: "top",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: "0.875rem",
                                  color: "#6b7280",
                                }}
                              >
                                {formatDate(request.createdAt)}
                              </div>
                            </td>
                            <td
                              style={{
                                padding: "1rem 1.5rem",
                                verticalAlign: "top",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  gap: "0.5rem",
                                  flexDirection: "column",
                                  alignItems: "flex-start",
                                }}
                              >
                                <button
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setShowDetailsModal(true);
                                  }}
                                  style={{
                                    padding: "0.5rem 1rem",
                                    backgroundColor: "#7a6990",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontSize: "0.875rem",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    transition: "background-color 0.2s",
                                    width: "100%",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "#6b5b7a";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "#7a6990";
                                  }}
                                >
                                  View Details
                                </button>
                                {request.status === "pending" && (
                                  <button
                                    onClick={async () => {
                                      try {
                                        const response = await fetch(
                                          "/api/service-requests",
                                          {
                                            method: "PUT",
                                            headers: {
                                              "Content-Type":
                                                "application/json",
                                            },
                                            body: JSON.stringify({
                                              id: request.id,
                                              status: "handled",
                                            }),
                                          },
                                        );
                                        if (response.ok) {
                                          // Update local state
                                          setServiceRequests((prev) =>
                                            prev.map((req) =>
                                              req.id === request.id
                                                ? { ...req, status: "handled" }
                                                : req,
                                            ),
                                          );
                                        }
                                      } catch (error) {
                                        console.error(
                                          "Error marking as handled:",
                                          error,
                                        );
                                      }
                                    }}
                                    style={{
                                      padding: "0.5rem 1rem",
                                      backgroundColor: "#10b981",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "6px",
                                      fontSize: "0.875rem",
                                      fontWeight: "500",
                                      cursor: "pointer",
                                      transition: "background-color 0.2s",
                                      width: "100%",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor =
                                        "#059669";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor =
                                        "#10b981";
                                    }}
                                  >
                                    Mark Handled
                                  </button>
                                )}
                              </div>
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
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "2rem",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowDetailsModal(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#6b7280",
                padding: "0.5rem",
                borderRadius: "4px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f3f4f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              ×
            </button>

            {/* Header */}
            <div style={{ marginBottom: "2rem" }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "0.5rem",
                }}
              >
                Service Request Details
              </h2>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "0.875rem",
                }}
              >
                Submitted on {formatDate(selectedRequest.createdAt)}
              </p>
            </div>

            {/* Customer Information */}
            <div style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "1rem",
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: "0.5rem",
                }}
              >
                Customer Information
              </h3>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                <div>
                  <label
                    style={{
                      fontWeight: "500",
                      color: "#6b7280",
                      fontSize: "0.875rem",
                    }}
                  >
                    Name
                  </label>
                  <p style={{ margin: "0.25rem 0 0 0", color: "#1f2937" }}>
                    {selectedRequest.customer.name}
                  </p>
                </div>
                <div>
                  <label
                    style={{
                      fontWeight: "500",
                      color: "#6b7280",
                      fontSize: "0.875rem",
                    }}
                  >
                    Email
                  </label>
                  <p style={{ margin: "0.25rem 0 0 0", color: "#1f2937" }}>
                    {selectedRequest.customer.email}
                  </p>
                </div>
                {selectedRequest.customer.phone && (
                  <div>
                    <label
                      style={{
                        fontWeight: "500",
                        color: "#6b7280",
                        fontSize: "0.875rem",
                      }}
                    >
                      Phone
                    </label>
                    <p style={{ margin: "0.25rem 0 0 0", color: "#1f2937" }}>
                      {selectedRequest.customer.phone}
                    </p>
                  </div>
                )}
                <div>
                  <label
                    style={{
                      fontWeight: "500",
                      color: "#6b7280",
                      fontSize: "0.875rem",
                    }}
                  >
                    Full Address (from intake form)
                  </label>
                  <p
                    style={{
                      margin: "0.25rem 0 0 0",
                      color: "#1f2937",
                      whiteSpace: "pre-wrap",
                      backgroundColor: "#f9fafb",
                      padding: "0.75rem",
                      borderRadius: "6px",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    {selectedRequest.address || "No address provided"}
                  </p>
                  {!selectedRequest.address && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#ef4444",
                        marginTop: "0.25rem",
                      }}
                    >
                      ⚠️ Address field is empty - check if data is being saved
                      correctly
                    </p>
                  )}
                  {selectedRequest.address && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#10b981",
                        marginTop: "0.25rem",
                      }}
                    >
                      ✅ Address captured from intake form
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Services Requested */}
            <div style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "1rem",
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: "0.5rem",
                }}
              >
                Services Requested
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {selectedRequest.services.map((service, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: "0.5rem 0.75rem",
                      backgroundColor: "#7a6990",
                      color: "white",
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                    }}
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
              <div style={{ marginBottom: "2rem" }}>
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "1rem",
                    borderBottom: "1px solid #e5e7eb",
                    paddingBottom: "0.5rem",
                  }}
                >
                  Additional Details
                </h3>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {selectedRequest.pickupDate && (
                    <div>
                      <label
                        style={{
                          fontWeight: "500",
                          color: "#6b7280",
                          fontSize: "0.875rem",
                        }}
                      >
                        Preferred Pickup Date
                      </label>
                      <p style={{ margin: "0.25rem 0 0 0", color: "#1f2937" }}>
                        {(() => {
                          try {
                            const date = new Date(selectedRequest.pickupDate);
                            if (isNaN(date.getTime())) {
                              return selectedRequest.pickupDate; // Return raw value if parsing fails
                            }
                            return date.toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            });
                          } catch {
                            return selectedRequest.pickupDate; // Return raw value if error
                          }
                        })()}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "#6b7280",
                          marginTop: "0.25rem",
                        }}
                      >
                        📅 Customer selected this date from the intake form
                      </p>
                    </div>
                  )}
                  {selectedRequest.repairNotes && (
                    <div>
                      <label
                        style={{
                          fontWeight: "500",
                          color: "#6b7280",
                          fontSize: "0.875rem",
                        }}
                      >
                        Repair Notes
                      </label>
                      <p
                        style={{
                          margin: "0.25rem 0 0 0",
                          color: "#1f2937",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {selectedRequest.repairNotes}
                      </p>
                    </div>
                  )}
                  {selectedRequest.waterproofingNotes && (
                    <div>
                      <label
                        style={{
                          fontWeight: "500",
                          color: "#6b7280",
                          fontSize: "0.875rem",
                        }}
                      >
                        Waterproofing Notes
                      </label>
                      <p
                        style={{
                          margin: "0.25rem 0 0 0",
                          color: "#1f2937",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {selectedRequest.waterproofingNotes}
                      </p>
                    </div>
                  )}
                  {selectedRequest.allergies && (
                    <div>
                      <label
                        style={{
                          fontWeight: "500",
                          color: "#6b7280",
                          fontSize: "0.875rem",
                        }}
                      >
                        Allergies
                      </label>
                      <p
                        style={{
                          margin: "0.25rem 0 0 0",
                          color: "#1f2937",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {selectedRequest.allergies}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes Management */}
            <div style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "1rem",
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: "0.5rem",
                }}
              >
                Notes & Management
              </h3>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                <div>
                  <label
                    style={{
                      fontWeight: "500",
                      color: "#6b7280",
                      fontSize: "0.875rem",
                    }}
                  >
                    Internal Notes
                  </label>
                  <textarea
                    value={selectedRequest.notes || ""}
                    onChange={async (e) => {
                      try {
                        const newNotes = e.target.value;
                        // Update notes via API
                        const response = await fetch("/api/service-requests", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            id: selectedRequest.id,
                            notes: newNotes,
                          }),
                        });
                        if (response.ok) {
                          setSelectedRequest({
                            ...selectedRequest,
                            notes: newNotes,
                          });
                        }
                      } catch (error) {
                        console.error("Error updating notes:", error);
                      }
                    }}
                    placeholder="Add internal notes about this request..."
                    rows={3}
                    style={{
                      padding: "0.5rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                      backgroundColor: "white",
                      width: "100%",
                      marginTop: "0.25rem",
                      resize: "vertical",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Debug Information (Development Only) */}
            {process.env.NODE_ENV === "development" && (
              <div
                style={{
                  marginBottom: "2rem",
                  padding: "1rem",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                }}
              >
                <h4
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Debug Info (Raw Data)
                </h4>
                <details style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                  <summary
                    style={{ cursor: "pointer", marginBottom: "0.5rem" }}
                  >
                    Click to view raw data
                  </summary>
                  <pre
                    style={{
                      backgroundColor: "white",
                      padding: "0.5rem",
                      borderRadius: "4px",
                      overflow: "auto",
                      fontSize: "0.7rem",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {JSON.stringify(selectedRequest, null, 2)}
                  </pre>
                </details>
              </div>
            )}

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowDetailsModal(false)}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#4b5563";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#6b7280";
                }}
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
