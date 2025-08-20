"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function EditCustomer() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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
          setFormData({
            name: customerData.name || "",
            email: customerData.email || "",
            phone: customerData.phone || "",
            address: customerData.address || "",
            addressLine1: customerData.addressLine1 || "",
            addressLine2: customerData.addressLine2 || "",
            city: customerData.city || "",
            state: customerData.state || "",
            postalCode: customerData.postalCode || "",
          });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customer) return;

    if (!formData.name.trim()) {
      alert("Customer name is required");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Customer updated successfully!");
        router.push(`/admin/customers/${customer.id}`);
      } else {
        const error = await response.json();
        alert(`Failed to update customer: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("Failed to update customer. Please try again.");
    } finally {
      setSaving(false);
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
              Edit Customer
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
              href={`/admin/customers/${customer.id}`}
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
              Cancel
            </Link>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit}>
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
                    htmlFor="name"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "0.875rem",
                    }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      color: "#1a1a1a",
                      backgroundColor: "white",
                    }}
                    placeholder="Enter customer name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
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
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      color: "#1a1a1a",
                      backgroundColor: "white",
                    }}
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
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
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      color: "#1a1a1a",
                      backgroundColor: "white",
                    }}
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "0.875rem",
                    }}
                  >
                    Address (Legacy)
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      color: "#1a1a1a",
                      backgroundColor: "white",
                    }}
                    placeholder="Enter full address"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Details */}
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
                Address Details
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
                    htmlFor="addressLine1"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "0.875rem",
                    }}
                  >
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      color: "#1a1a1a",
                      backgroundColor: "white",
                    }}
                    placeholder="Street address, P.O. box, etc."
                  />
                </div>

                <div>
                  <label
                    htmlFor="addressLine2"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "0.875rem",
                    }}
                  >
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      color: "#1a1a1a",
                      backgroundColor: "white",
                    }}
                    placeholder="Apartment, suite, unit, etc."
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "0.875rem",
                    }}
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      color: "#1a1a1a",
                      backgroundColor: "white",
                    }}
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "0.875rem",
                    }}
                  >
                    State/Province
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      color: "#1a1a1a",
                      backgroundColor: "white",
                    }}
                    placeholder="Enter state or province"
                  />
                </div>

                <div>
                  <label
                    htmlFor="postalCode"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "0.875rem",
                    }}
                  >
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      color: "#1a1a1a",
                      backgroundColor: "white",
                    }}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginTop: "32px",
            }}
          >
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: isMobile ? "16px 32px" : "14px 28px",
                backgroundColor: "#7a6990",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: isMobile ? "1rem" : "0.875rem",
                fontWeight: "600",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.6 : 1,
                transition: "all 0.2s ease",
                minWidth: isMobile ? "200px" : "150px",
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
