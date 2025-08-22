"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Invoice = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  invoiceDate: string;
  status: string;
  notes: string;
  terms: string;
  subtotal: number;
  tax: number;
  total: number;
  invoiceNumber: string;
  items: InvoiceItem[];
};

type InvoiceItem = {
  id?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

export default function EditInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Fetch the actual invoice data from the API
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/invoices/${params.id}`);
        if (response.ok) {
          const invoiceData = await response.json();
          setInvoice(invoiceData);
        } else {
          console.error("Failed to fetch invoice:", response.status);
          // Fallback to mock data if API fails
          const mockInvoice: Invoice = {
            id: params.id as string,
            customerName: "Error loading invoice",
            customerEmail: "",
            customerPhone: "",
            customerAddress: "",
            invoiceNumber: "INV-ERROR",
            invoiceDate: new Date().toISOString().split("T")[0],

            status: "error",
            notes: "Failed to load invoice data",
            terms: "",
            subtotal: 0,
            tax: 0,
            total: 0,
            items: [],
          };
          setInvoice(mockInvoice);
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        // Fallback to mock data if API fails
        const mockInvoice: Invoice = {
          id: params.id as string,
          customerName: "Error loading invoice",
          customerEmail: "",
          customerPhone: "",
          customerAddress: "",
          invoiceNumber: "INV-ERROR",
          invoiceDate: new Date().toISOString().split("T")[0],
          status: "error",
          notes: "Failed to load invoice data",
          terms: "",
          subtotal: 0,
          tax: 0,
          total: 0,
          items: [],
        };
        setInvoice(mockInvoice);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();

    return () => window.removeEventListener("resize", checkMobile);
  }, [params.id]);

  const handleInputChange = (field: keyof Invoice, value: string | number) => {
    if (invoice) {
      setInvoice((prev) => (prev ? { ...prev, [field]: value } : null));
    }
  };

  const handleItemChange = (
    itemDescription: string,
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    if (invoice && invoice.items) {
      const updatedItems = invoice.items.map((item) =>
        item.description === itemDescription
          ? { ...item, [field]: value }
          : item,
      );

      // Recalculate totals
      const recalculatedItems = updatedItems.map((item) => ({
        ...item,
        amount: item.quantity * item.rate,
      }));

      const newSubtotal = recalculatedItems.reduce(
        (sum, item) => sum + item.amount,
        0,
      );
      const newTax = newSubtotal * 0.0625; // 6.25% tax
      const newTotal = newSubtotal + newTax;

      setInvoice((prev) =>
        prev
          ? {
              ...prev,
              items: recalculatedItems,
              subtotal: newSubtotal,
              tax: newTax,
              total: newTotal,
            }
          : null,
      );
    }
  };

  const addItem = () => {
    if (invoice) {
      const newItem: InvoiceItem = {
        id: `new-${Date.now()}`,
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      };

      setInvoice((prev) =>
        prev
          ? {
              ...prev,
              items: [...(prev.items || []), newItem],
            }
          : null,
      );
    }
  };

  const removeItem = (itemDescription: string) => {
    if (invoice && invoice.items) {
      const updatedItems = invoice.items.filter(
        (item) => item.description !== itemDescription,
      );
      const newSubtotal = updatedItems.reduce(
        (sum, item) => sum + item.amount,
        0,
      );
      const newTax = newSubtotal * 0.0625; // 6.25% tax
      const newTotal = newSubtotal + newTax;

      setInvoice((prev) =>
        prev
          ? {
              ...prev,
              items: updatedItems,
              subtotal: newSubtotal,
              tax: newTax,
              total: newTotal,
            }
          : null,
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (!invoice) {
      alert("No invoice data to save");
      setSaving(false);
      return;
    }

    try {
      // Prepare the invoice data for the API
      const invoicePayload = {
        customerName: invoice.customerName,
        customerEmail: invoice.customerEmail,
        customerPhone: invoice.customerPhone,
        customerAddress: invoice.customerAddress,
        invoiceDate: invoice.invoiceDate,
        items: invoice.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
        })),
        notes: invoice.notes,
        terms: invoice.terms,
        subtotal: invoice.subtotal,
        tax: invoice.tax,
        total: invoice.total,
        status: invoice.status,
      };

      // Update the invoice via API
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoicePayload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update invoice");
      }

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        router.push("/admin/invoices");
      }, 2000);
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert(
        `Error saving invoice: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (dollars: number) => {
    return `$${dollars.toFixed(2)}`;
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!invoice) return;

    try {
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Invoice deleted successfully");
        window.location.href = "/admin/invoices";
      } else {
        const error = await response.json();
        alert(`Failed to delete invoice: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      alert("Failed to delete invoice. Please try again.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
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
              Loading invoice...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
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
              Invoice not found
            </div>
            <Link
              href="/admin/invoices"
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
              Back to Invoices
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
              Edit Invoice
            </h1>
            <p
              style={{
                color: "#666",
                margin: "8px 0 0 0",
                fontSize: isMobile ? "0.9rem" : "1rem",
              }}
            >
              {invoice.invoiceNumber}
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
              href={`/admin/invoices/${invoice.id}`}
              style={{
                padding: isMobile ? "12px 20px" : "10px 20px",
                backgroundColor: "transparent",
                color: "#7a6990",
                textDecoration: "none",
                borderRadius: "8px",
                fontSize: isMobile ? "0.9rem" : "0.875rem",
                fontWeight: "600",
                border: "2px solid #7a6990",
                textAlign: "center",
                width: isMobile ? "100%" : "auto",
              }}
            >
              View Invoice
            </Link>
            <Link
              href="/admin/invoices"
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
            <button
              onClick={handleDeleteClick}
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

        <form onSubmit={handleSubmit}>
          {/* Invoice Information */}
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
                Invoice Information
              </h2>
            </div>

            <div style={{ padding: isMobile ? "16px" : "24px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: isMobile ? "16px" : "24px",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                    }}
                  >
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={invoice.customerName}
                    onChange={(e) =>
                      handleInputChange("customerName", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: isMobile ? "10px" : "12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                      backgroundColor: "white",
                      color: "#374151",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#7a6990";
                      e.target.style.outline = "none";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                    }}
                  >
                    Customer Email
                  </label>
                  <input
                    type="email"
                    value={invoice.customerEmail || ""}
                    onChange={(e) =>
                      handleInputChange("customerEmail", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: isMobile ? "10px" : "12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                      backgroundColor: "white",
                      color: "#374151",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#7a6990";
                      e.target.style.outline = "none";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                    }}
                  >
                    Customer Phone
                  </label>
                  <input
                    type="tel"
                    value={invoice.customerPhone || ""}
                    onChange={(e) =>
                      handleInputChange("customerPhone", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: isMobile ? "10px" : "12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                      backgroundColor: "white",
                      color: "#374151",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#7a6990";
                      e.target.style.outline = "none";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                    }}
                  >
                    Customer Address
                  </label>
                  <textarea
                    value={invoice.customerAddress || ""}
                    onChange={(e) =>
                      handleInputChange("customerAddress", e.target.value)
                    }
                    placeholder="Enter customer address..."
                    style={{
                      width: "100%",
                      padding: isMobile ? "10px" : "12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                      backgroundColor: "white",
                      color: "#374151",
                      transition: "border-color 0.2s ease",
                      minHeight: "60px",
                      resize: "vertical",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#7a6990";
                      e.target.style.outline = "none";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                    }}
                  >
                    Invoice Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={invoice.invoiceNumber}
                    onChange={(e) =>
                      handleInputChange("invoiceNumber", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: isMobile ? "10px" : "12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                      backgroundColor: "white",
                      color: "#374151",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#7a6990";
                      e.target.style.outline = "none";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
                  gap: isMobile ? "16px" : "24px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                    }}
                  >
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={invoice.invoiceDate}
                    onChange={(e) =>
                      handleInputChange("invoiceDate", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: isMobile ? "10px" : "12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                      backgroundColor: "white",
                      color: "#374151",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#7a6990";
                      e.target.style.outline = "none";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                    }}
                  >
                    Status *
                  </label>
                  <select
                    required
                    value={invoice.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: isMobile ? "10px" : "12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                      backgroundColor: "white",
                      color: "#374151",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#7a6990";
                      e.target.style.outline = "none";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                    }}
                  >
                    <option value="draft">Draft</option>
                    <option value="open">Open</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="void">Void</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  fontSize: isMobile ? "1.25rem" : "1.5rem",
                  margin: "0",
                  color: "#1a1a1a",
                }}
              >
                Invoice Items
              </h2>
              <button
                type="button"
                onClick={addItem}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                + Add Item
              </button>
            </div>

            <div style={{ padding: isMobile ? "16px" : "24px" }}>
              {invoice.items &&
                invoice.items.map((item, index) => (
                  <div
                    key={`${item.description}-${index}`}
                    style={{
                      border: "1px solid #e9ecef",
                      borderRadius: "8px",
                      padding: "16px",
                      marginBottom:
                        index < invoice.items!.length - 1 ? "16px" : "0",
                      backgroundColor: "#fafbfc",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <h4
                        style={{
                          margin: "0",
                          fontSize: "1rem",
                          color: "#1a1a1a",
                          fontWeight: "600",
                        }}
                      >
                        Item {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeItem(item.description)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#dc3545",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
                        gap: "16px",
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
                          Description *
                        </label>
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(
                              item.description,
                              "description",
                              e.target.value,
                            )
                          }
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                            fontSize: "0.875rem",
                            backgroundColor: "white",
                            color: "#374151",
                          }}
                        />
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
                          Quantity *
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              item.description,
                              "quantity",
                              parseInt(e.target.value) || 1,
                            )
                          }
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                            fontSize: "0.875rem",
                            backgroundColor: "white",
                            color: "#374151",
                          }}
                        />
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
                          Unit Price ($) *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={item.rate.toFixed(2)}
                          onChange={(e) =>
                            handleItemChange(
                              item.description,
                              "rate",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                            fontSize: "0.875rem",
                            backgroundColor: "white",
                            color: "#374151",
                          }}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: "12px",
                        padding: "12px",
                        backgroundColor: "#e9ecef",
                        borderRadius: "6px",
                        textAlign: "right",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1rem",
                          fontWeight: "600",
                          color: "#1a1a1a",
                        }}
                      >
                        Item Total: {formatCurrency(item.amount)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Notes & Terms */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border: "1px solid #e9ecef",
              padding: isMobile ? "20px" : "24px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    margin: "0 0 16px 0",
                    color: "#1a1a1a",
                  }}
                >
                  Notes
                </h3>
                <textarea
                  value={invoice.notes || ""}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Add any notes or special instructions..."
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    minHeight: "100px",
                    resize: "vertical",
                    backgroundColor: "white",
                    color: "#374151",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    margin: "0 0 16px 0",
                    color: "#1a1a1a",
                  }}
                >
                  Terms
                </h3>
                <textarea
                  value={invoice.terms || ""}
                  onChange={(e) => handleInputChange("terms", e.target.value)}
                  placeholder="Payment terms and conditions..."
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    minHeight: "100px",
                    resize: "vertical",
                    backgroundColor: "white",
                    color: "#374151",
                    fontFamily: "inherit",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border: "1px solid #e9ecef",
              padding: isMobile ? "20px" : "24px",
              marginBottom: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                margin: "0 0 16px 0",
                color: "#1a1a1a",
              }}
            >
              Payment Instructions
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
                gap: "16px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid #e9ecef",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "8px",
                    color: "#7a6990",
                  }}
                >
                  💳
                </div>
                <h4
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    margin: "0 0 8px 0",
                    color: "#1a1a1a",
                  }}
                >
                  Zelle
                </h4>
                <p
                  style={{
                    margin: "0",
                    fontSize: "0.875rem",
                    color: "#666",
                    wordBreak: "break-all",
                    fontWeight: "500",
                  }}
                >
                  loveserenespaces@gmail.com
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid #e9ecef",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "8px",
                    color: "#7a6990",
                  }}
                >
                  📱
                </div>
                <h4
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    margin: "0 0 8px 0",
                    color: "#1a1a1a",
                  }}
                >
                  Venmo
                </h4>
                <p
                  style={{
                    margin: "0",
                    fontSize: "0.875rem",
                    color: "#666",
                    fontWeight: "500",
                  }}
                >
                  @beth-contos
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid #e9ecef",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "8px",
                    color: "#7a6990",
                  }}
                >
                  💵
                </div>
                <h4
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    margin: "0 0 8px 0",
                    color: "#1a1a1a",
                  }}
                >
                  Cash
                </h4>
                <p
                  style={{
                    margin: "0",
                    fontSize: "0.875rem",
                    color: "#666",
                    fontWeight: "500",
                  }}
                >
                  Due at delivery
                </p>
              </div>
            </div>
          </div>

          {/* Total and Submit */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border: "1px solid #e9ecef",
              padding: isMobile ? "20px" : "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
                padding: "16px 0",
                borderTop: "1px solid #e9ecef",
              }}
            >
              <h3
                style={{
                  fontSize: "1.5rem",
                  margin: "0",
                  color: "#1a1a1a",
                  fontWeight: "600",
                }}
              >
                Total Amount
              </h3>
              <span
                style={{
                  fontSize: "2rem",
                  color: "#7a6990",
                  fontWeight: "700",
                }}
              >
                {formatCurrency(invoice.total)}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: isMobile ? "16px 24px" : "14px 28px",
                  backgroundColor: saved ? "#28a745" : "#7a6990",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: isMobile ? "1rem" : "1.1rem",
                  fontWeight: "600",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.6 : 1,
                  width: isMobile ? "100%" : "auto",
                }}
              >
                {saving
                  ? "Saving..."
                  : saved
                    ? "Invoice Updated!"
                    : "Update Invoice"}
              </button>
            </div>
          </div>
        </form>
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
                  Delete Invoice
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
              Are you sure you want to delete this invoice? This action cannot
              be undone.
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={cancelDelete}
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
                onClick={confirmDelete}
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
                Delete Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
