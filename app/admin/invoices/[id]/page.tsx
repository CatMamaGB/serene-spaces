"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  invoiceDate: string;
  dueDate: string;
  status: string;
  items: InvoiceItem[];
  notes: string;
  terms: string;
  subtotal: number;
  tax: number;
  total: number;
}

export default function ViewInvoice() {
  const params = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [sendToEmail, setSendToEmail] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // For demo purposes, create a mock invoice
    // In a real app, you'd fetch this from your API
    const mockInvoice: Invoice = {
      id: params.id as string,
      customerName: "Sarah Johnson",
      customerEmail: "sarah.johnson@email.com",
      customerPhone: "(555) 123-4567",
      customerAddress: "123 Main Street, Portland, OR 97201",
      invoiceDate: "2024-01-15",
      dueDate: "2024-02-15",
      status: "open",
      items: [
        {
          description: "Blanket (with fill)",
          quantity: 2,
          rate: 25,
          amount: 50,
        },
        { description: "Wraps", quantity: 1, rate: 5, amount: 5 },
        { description: "Boots", quantity: 1, rate: 5, amount: 5 },
      ],
      notes: "Thank you for your business!",
      terms: "Payment due before delivery",
      subtotal: 60,
      tax: 4.8,
      total: 64.8,
    };

    setInvoice(mockInvoice);
    setSendToEmail(mockInvoice.customerEmail);
    setIsLoading(false);
  }, [params.id]);

  const handleSendInvoice = async () => {
    if (!invoice || !sendToEmail) return;

    setIsSending(true);

    try {
      const response = await fetch("/api/invoices/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...invoice,
          customerEmail: sendToEmail,
          emailMessage: emailMessage,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Invoice sent successfully to ${sendToEmail}!`);
        setShowSendModal(false);
        setEmailMessage("");
      } else {
        alert(`Failed to send invoice: ${result.error}`);
      }
    } catch (error) {
      console.error("Error sending invoice:", error);
      alert("Failed to send invoice. Please try again.");
    } finally {
      setIsSending(false);
    }
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

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div>Loading invoice...</div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div>Invoice not found</div>
        <Link
          href="/admin/invoices"
          style={{ color: "#7a6990", textDecoration: "none" }}
        >
          ← Back to Invoices
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid #e2e8f0",
          padding: "1rem 2rem",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Link
              href="/admin/invoices"
              style={{
                color: "#7a6990",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              ← Back to Invoices
            </Link>
            <h1
              style={{
                color: "#1e293b",
                fontSize: "1.875rem",
                fontWeight: "700",
                margin: 0,
              }}
            >
              Invoice #{invoice.id}
            </h1>
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <label
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Status:
              </label>
              <select
                value={invoice.status || "draft"}
                onChange={async (e) => {
                  try {
                    const response = await fetch(
                      `/api/invoices/${invoice.id}`,
                      {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: e.target.value }),
                      },
                    );

                    if (response.ok) {
                      setInvoice((prev) =>
                        prev ? { ...prev, status: e.target.value } : null,
                      );
                      alert("Status updated successfully!");
                    } else {
                      alert("Failed to update status");
                    }
                  } catch (error) {
                    console.error("Error updating status:", error);
                    alert("Failed to update status");
                  }
                }}
                style={{
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  backgroundColor: "white",
                  color: "#374151",
                }}
              >
                <option value="draft">Draft</option>
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="void">Void</option>
              </select>
            </div>

            <button
              onClick={() => setShowSendModal(true)}
              style={{
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              📧 Send Invoice
            </button>

            <Link
              href={`/admin/invoices/${invoice.id}/edit`}
              style={{
                backgroundColor: "#7a6990",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                textDecoration: "none",
                display: "inline-block",
                transition: "all 0.2s ease",
              }}
            >
              ✏️ Edit Invoice
            </Link>

            <button
              onClick={handleDeleteClick}
              style={{
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              🗑️ Delete Invoice
            </button>
          </div>
        </div>
      </header>

      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        {/* Invoice Display */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            border: "1px solid #e2e8f0",
            padding: "2rem",
            marginBottom: "2rem",
          }}
        >
          {/* Company Header */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "2rem",
              borderBottom: "2px solid #7a6990",
              paddingBottom: "1rem",
            }}
          >
            <h1
              style={{
                color: "#7a6990",
                fontSize: "2.5rem",
                fontWeight: "bold",
                margin: "0 0 0.5rem 0",
              }}
            >
              Serene Spaces
            </h1>
            <p
              style={{
                color: "#64748b",
                fontSize: "1.125rem",
                margin: 0,
              }}
            >
              Professional Equestrian Cleaning Services
            </p>
          </div>

          {/* Invoice Details */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
              marginBottom: "2rem",
            }}
          >
            <div>
              <h3
                style={{
                  color: "#374151",
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  marginBottom: "0.75rem",
                }}
              >
                Bill To:
              </h3>
              <p style={{ margin: "0.25rem 0", color: "#1f2937" }}>
                <strong>{invoice.customerName}</strong>
              </p>
              {invoice.customerEmail && (
                <p style={{ margin: "0.25rem 0", color: "#1f2937" }}>
                  {invoice.customerEmail}
                </p>
              )}
              {invoice.customerPhone && (
                <p style={{ margin: "0.25rem 0", color: "#1f2937" }}>
                  {invoice.customerPhone}
                </p>
              )}
              {invoice.customerAddress && (
                <p style={{ margin: "0.25rem 0", color: "#1f2937" }}>
                  {invoice.customerAddress}
                </p>
              )}
            </div>

            <div style={{ textAlign: "right" }}>
              <h3
                style={{
                  color: "#374151",
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  marginBottom: "0.75rem",
                }}
              >
                Invoice Details:
              </h3>
              <p style={{ margin: "0.25rem 0", color: "#1f2937" }}>
                <strong>Date:</strong>{" "}
                {new Date(invoice.invoiceDate).toLocaleDateString()}
              </p>
              {invoice.dueDate && (
                <p style={{ margin: "0.25rem 0", color: "#1f2937" }}>
                  <strong>Due Date:</strong>{" "}
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
              )}
              <p style={{ margin: "0.25rem 0", color: "#1f2937" }}>
                <strong>Invoice #:</strong> {invoice.id}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div style={{ marginBottom: "2rem" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #e2e8f0",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f8fafc" }}>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "1px solid #e2e8f0",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    Description
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      borderBottom: "1px solid #e2e8f0",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    Qty
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "right",
                      borderBottom: "1px solid #e2e8f0",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    Rate
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "right",
                      borderBottom: "1px solid #e2e8f0",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    <td
                      style={{
                        padding: "1rem",
                        color: "#1f2937",
                      }}
                    >
                      {item.description}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        textAlign: "center",
                        color: "#1f2937",
                      }}
                    >
                      {item.quantity}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        textAlign: "right",
                        color: "#1f2937",
                      }}
                    >
                      ${item.rate.toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        textAlign: "right",
                        color: "#1f2937",
                      }}
                    >
                      ${item.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div
            style={{
              textAlign: "right",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
                fontSize: "1rem",
                color: "#64748b",
              }}
            >
              <span>Subtotal:</span>
              <span style={{ marginLeft: "2rem" }}>
                ${invoice.subtotal.toFixed(2)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
                fontSize: "1rem",
                color: "#64748b",
              }}
            >
              <span>Tax:</span>
              <span style={{ marginLeft: "2rem" }}>
                ${invoice.tax.toFixed(2)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "0.5rem",
                borderTop: "2px solid #e2e8f0",
                fontSize: "1.25rem",
                fontWeight: "700",
                color: "#1e293b",
              }}
            >
              <span>Total:</span>
              <span style={{ marginLeft: "2rem" }}>
                ${invoice.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Notes & Terms */}
          {(invoice.notes || invoice.terms) && (
            <div
              style={{
                borderTop: "1px solid #e2e8f0",
                paddingTop: "1.5rem",
              }}
            >
              {invoice.notes && (
                <div style={{ marginBottom: "1rem" }}>
                  <h4
                    style={{
                      color: "#374151",
                      fontSize: "1rem",
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Notes:
                  </h4>
                  <p style={{ color: "#1f2937", margin: 0 }}>{invoice.notes}</p>
                </div>
              )}

              {invoice.terms && (
                <div>
                  <h4
                    style={{
                      color: "#374151",
                      fontSize: "1rem",
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Terms:
                  </h4>
                  <p style={{ color: "#1f2937", margin: 0 }}>{invoice.terms}</p>
                </div>
              )}
            </div>
          )}

          {/* Payment Instructions */}
          <div
            style={{
              borderTop: "1px solid #e2e8f0",
              paddingTop: "1.5rem",
              marginTop: "1.5rem",
            }}
          >
            <h4
              style={{
                color: "#374151",
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "1.5rem",
                textAlign: "center",
              }}
            >
              Payment Instructions
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "1.5rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    marginBottom: "0.75rem",
                    color: "#7a6990",
                  }}
                >
                  💳
                </div>
                <h5
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    margin: "0 0 0.75rem 0",
                    color: "#374151",
                  }}
                >
                  Zelle
                </h5>
                <p
                  style={{
                    margin: "0",
                    fontSize: "1rem",
                    color: "#64748b",
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
                  padding: "1.5rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    marginBottom: "0.75rem",
                    color: "#7a6990",
                  }}
                >
                  📱
                </div>
                <h5
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    margin: "0 0 0.75rem 0",
                    color: "#374151",
                  }}
                >
                  Venmo
                </h5>
                <p
                  style={{
                    margin: "0",
                    fontSize: "1rem",
                    color: "#64748b",
                    fontWeight: "500",
                  }}
                >
                  @beth-contos
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "1.5rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    marginBottom: "0.75rem",
                    color: "#7a6990",
                  }}
                >
                  💵
                </div>
                <h5
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    margin: "0 0 0.75rem 0",
                    color: "#374151",
                  }}
                >
                  Cash
                </h5>
                <p
                  style={{
                    margin: "0",
                    fontSize: "1rem",
                    color: "#64748b",
                    fontWeight: "500",
                  }}
                >
                  Due at delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Send Invoice Modal */}
      {showSendModal && (
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
              borderRadius: "0.75rem",
              padding: "2rem",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "80vh",
              overflow: "auto",
            }}
          >
            <h2
              style={{
                color: "#1e293b",
                fontSize: "1.5rem",
                fontWeight: "600",
                marginBottom: "1.5rem",
              }}
            >
              Send Invoice
            </h2>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Send to Email:
              </label>
              <input
                type="email"
                value={sendToEmail}
                onChange={(e) => setSendToEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  backgroundColor: "white",
                  color: "#374151",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Message (optional):
              </label>
              <textarea
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                rows={4}
                placeholder="Add a personal message to your customer..."
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  resize: "vertical",
                  backgroundColor: "white",
                  color: "#374151",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowSendModal(false)}
                style={{
                  backgroundColor: "transparent",
                  color: "#6b7280",
                  border: "1px solid #d1d5db",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleSendInvoice}
                disabled={isSending || !sendToEmail}
                style={{
                  backgroundColor:
                    isSending || !sendToEmail ? "#9ca3af" : "#10b981",
                  color: "white",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  cursor: isSending || !sendToEmail ? "not-allowed" : "pointer",
                }}
              >
                {isSending ? "Sending..." : "Send Invoice"}
              </button>
            </div>
          </div>
        </div>
      )}

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
