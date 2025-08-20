"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ViewCustomer() {
  const params = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Fetch customer data
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/customers/${params.id}`);
        if (response.ok) {
          const customerData = await response.json();
          setCustomer(customerData);
        } else {
          console.error("Failed to fetch customer:", response.status);
          alert("Failed to load customer data");
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
        alert("Error loading customer data");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();

    return () => window.removeEventListener("resize", checkMobile);
  }, [params.id]);

  const handleDelete = async () => {
    if (!customer) return;

    try {
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Customer deleted successfully");
        window.location.href = "/admin/customers";
      } else {
        const error = await response.json();
        alert(`Failed to delete customer: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Failed to delete customer. Please try again.");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: isMobile ? "16px" : "24px",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div
            style={{ textAlign: "center", padding: isMobile ? "40px" : "60px" }}
          >
            <div
              style={{ fontSize: isMobile ? "1rem" : "1.2rem", color: "#666" }}
            >
              Loading customer...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div
        style={{
          padding: isMobile ? "16px" : "24px",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div
            style={{ textAlign: "center", padding: isMobile ? "40px" : "60px" }}
          >
            <div
              style={{ fontSize: isMobile ? "1rem" : "1.2rem", color: "#666" }}
            >
              Customer not found
            </div>
            <Link
              href="/admin/customers"
              style={{
                display: "inline-block",
                marginTop: "20px",
                padding: "12px 24px",
                backgroundColor: "#7a6990",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
              }}
            >
              Back to Customers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatAddress = () => {
    const parts = [
      customer.addressLine1,
      customer.addressLine2,
      customer.city,
      customer.state,
      customer.postalCode,
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(", ") : customer.address || "No address provided";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      style={{
        padding: isMobile ? "16px" : "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Page Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "1rem" : "0",
          }}
        >
          <div style={{ textAlign: isMobile ? "center" : "left" }}>
            <h1
              style={{
                fontSize: isMobile ? "1.5rem" : "2rem",
                margin: "0",
                color: "#1a1a1a",
              }}
            >
              Customer Details
            </h1>
            <p
              style={{
                color: "#666",
                margin: "8px 0 0 0",
                fontSize: isMobile ? "0.9rem" : "1rem",
              }}
            >
              {customer.name}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <Link
              href={`/admin/customers/${customer.id}/edit`}
              style={{
                padding: isMobile ? "12px 20px" : "10px 20px",
                backgroundColor: "#7a6990",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontSize: isMobile ? "0.9rem" : "0.875rem",
                fontWeight: "600",
                textAlign: "center",
                width: isMobile ? "100%" : "auto",
              }}
            >
              Edit Customer
            </Link>
            <Link
              href="/admin/customers"
              style={{
                padding: isMobile ? "12px 20px" : "10px 20px",
                backgroundColor: "transparent",
                color: "#666",
                textDecoration: "none",
                borderRadius: "8px",
                fontSize: isMobile ? "0.9rem" : "0.875rem",
                fontWeight: "600",
                border: "2px solid #666",
                textAlign: "center",
                width: isMobile ? "100%" : "auto",
              }}
            >
              Back to Customers
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              style={{
                padding: isMobile ? "12px 20px" : "10px 20px",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: isMobile ? "0.9rem" : "0.875rem",
                fontWeight: "600",
                cursor: "pointer",
                textAlign: "center",
                width: isMobile ? "100%" : "auto",
              }}
            >
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Customer Information */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            border: "1px solid #e9ecef",
            overflow: "hidden",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              padding: isMobile ? "16px" : "24px",
              borderBottom: "1px solid #e9ecef",
              backgroundColor: "#f8f9fa",
            }}
          >
            <h2
              style={{
                fontSize: isMobile ? "1.25rem" : "1.5rem",
                margin: "0",
                color: "#1a1a1a",
              }}
            >
              Contact Information
            </h2>
          </div>

          <div style={{ padding: isMobile ? "16px" : "24px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "24px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.875rem",
                  }}
                >
                  Full Name
                </label>
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                    fontSize: "1rem",
                    color: "#1a1a1a",
                  }}
                >
                  {customer.name}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.875rem",
                  }}
                >
                  Email Address
                </label>
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                    fontSize: "1rem",
                    color: "#1a1a1a",
                  }}
                >
                  {customer.email || "No email provided"}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.875rem",
                  }}
                >
                  Phone Number
                </label>
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                    fontSize: "1rem",
                    color: "#1a1a1a",
                  }}
                >
                  {customer.phone || "No phone provided"}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.875rem",
                  }}
                >
                  Address
                </label>
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                    fontSize: "1rem",
                    color: "#1a1a1a",
                    minHeight: "48px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {formatAddress()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            border: "1px solid #e9ecef",
            overflow: "hidden",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              padding: isMobile ? "16px" : "24px",
              borderBottom: "1px solid #e9ecef",
              backgroundColor: "#f8f9fa",
            }}
          >
            <h2
              style={{
                fontSize: isMobile ? "1.25rem" : "1.5rem",
                margin: "0",
                color: "#1a1a1a",
              }}
            >
              System Information
            </h2>
          </div>

          <div style={{ padding: isMobile ? "16px" : "24px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "24px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.875rem",
                  }}
                >
                  Customer ID
                </label>
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                    fontSize: "0.875rem",
                    color: "#666",
                    fontFamily: "monospace",
                  }}
                >
                  {customer.id}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.875rem",
                  }}
                >
                  Created Date
                </label>
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                    fontSize: "1rem",
                    color: "#1a1a1a",
                  }}
                >
                  {formatDate(customer.createdAt)}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.875rem",
                  }}
                >
                  Last Updated
                </label>
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                    fontSize: "1rem",
                    color: "#1a1a1a",
                  }}
                >
                  {formatDate(customer.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
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
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "400px",
              width: "90%",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#fef2f2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "16px",
                }}
              >
                <span style={{ fontSize: "24px", color: "#dc2626" }}>⚠️</span>
              </div>
              <div>
                <h3
                  style={{
                    margin: "0",
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#1f2937",
                  }}
                >
                  Delete Customer
                </h3>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    color: "#6b7280",
                    fontSize: "0.875rem",
                  }}
                >
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p
              style={{
                margin: "0 0 24px 0",
                color: "#374151",
                fontSize: "1rem",
                lineHeight: "1.5",
              }}
            >
              Are you sure you want to delete <strong>{customer.name}</strong>? 
              This will also delete all associated invoices and service requests.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "transparent",
                  color: "#6b7280",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
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
