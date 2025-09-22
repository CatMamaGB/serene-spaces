"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useIsMobile } from "@/lib/hooks";
import { safeJson } from "@/lib/utils";
import { Invoice, recomputeTotals, formatCurrency } from "@/lib/invoice-types";
import { useToast } from "@/components/ToastProvider";

export default function ViewInvoice() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [sendToEmail, setSendToEmail] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const isMobile = useIsMobile();
  const toast = useToast();

  useEffect(() => {
    const controller = new AbortController();

    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/invoices/${params.id}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const invoiceData = await response.json();
        setInvoice(recomputeTotals(invoiceData));
        setSendToEmail(invoiceData.customerEmail);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error fetching invoice:", error);
          // Fallback to mock data if API fails
          const mockInvoice: Invoice = {
            id: params.id,
            customerName: "Sarah Johnson",
            customerEmail: "sarah.johnson@email.com",
            customerPhone: "(555) 123-4567",
            customerAddress: "123 Main Street, Portland, OR 97201",
            invoiceDate: "2024-01-15",
            status: "open",
            items: [
              {
                id: "item-1",
                description: "Blanket (with fill)",
                quantity: 2,
                rate: 25,
                amount: 50,
              },
              {
                id: "item-2",
                description: "Wraps",
                quantity: 1,
                rate: 5,
                amount: 5,
              },
              {
                id: "item-3",
                description: "Boots",
                quantity: 1,
                rate: 5,
                amount: 5,
              },
            ],
            notes: "Thank you for your business!",
            terms: "Payment due before delivery",
            subtotal: 60,
            tax: 4.8,
            total: 64.8,
            invoiceNumber: "INV-001",
            applyTax: true,
            taxRate: 6.25,
          };
          setInvoice(mockInvoice);
          setSendToEmail(mockInvoice.customerEmail);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();

    return () => controller.abort();
  }, [params.id]);

  const handleSendInvoice = async () => {
    if (!invoice || !sendToEmail) return;

    setIsSending(true);

    try {
      const requestBody = {
        invoiceId: invoice.id,
        ...invoice,
        customerEmail: sendToEmail,
        emailMessage: emailMessage,
      };

      const response = await fetch("/api/invoices/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await safeJson(response);

      if (response.ok) {
        toast.success(
          "Invoice Sent",
          `Invoice sent successfully to ${sendToEmail}!`,
        );
        setShowSendModal(false);
        setEmailMessage("");
      } else {
        toast.error("Send Failed", `Failed to send invoice: ${result.error}`);
      }
    } catch (error) {
      console.error("Error sending invoice:", error);
      toast.error("Send Failed", "Failed to send invoice. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!invoice) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: "DELETE",
      });
      const result = await safeJson(response);

      if (response.ok) {
        setShowDeleteModal(false);
        toast.success(
          "Invoice Deleted",
          "Invoice has been deleted successfully!",
        );
        router.push("/admin/invoices");
      } else {
        toast.error(
          "Delete Failed",
          `Failed to delete invoice: ${result.error || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error(
        "Delete Failed",
        "Failed to delete invoice. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!invoice) return;

    try {
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "paid" }),
      });

      const result = await safeJson(response);

      if (response.ok) {
        toast.success("Invoice Updated", "Invoice has been marked as paid!");
        // Refresh the invoice data
        const updatedInvoice = { ...invoice, status: "paid" };
        setInvoice(updatedInvoice);
      } else {
        toast.error(
          "Update Failed",
          `Failed to update invoice: ${result.error || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error(
        "Update Failed",
        "Failed to update invoice. Please try again.",
      );
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (isLoading) {
    return (
      <div
        style={{
          padding: isMobile ? "1.5rem" : "2rem",
          textAlign: "center",
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            fontSize: isMobile ? "1rem" : "1.2rem",
            color: "#666",
          }}
        >
          Loading invoice...
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div
        style={{
          padding: isMobile ? "1.5rem" : "2rem",
          textAlign: "center",
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            fontSize: isMobile ? "1.2rem" : "1.5rem",
            marginBottom: "1rem",
            color: "#333",
          }}
        >
          Invoice not found
        </div>
        <Link
          href="/admin/invoices"
          style={{
            color: "#7a6990",
            textDecoration: "none",
            fontSize: isMobile ? "1rem" : "1.1rem",
          }}
        >
          ← Back to Invoices
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 lg:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center flex-col lg:flex-row gap-4 lg:gap-0">
          <div
            className={`flex items-center gap-2 lg:gap-4 ${isMobile ? "flex-col text-center w-full" : "flex-row text-left"}`}
          >
            <Link
              href="/admin/invoices"
              className="text-indigo-600 no-underline text-sm font-medium hover:text-indigo-700"
            >
              ← Back to Invoices
            </Link>
            <h1 className="text-slate-800 text-2xl lg:text-3xl font-bold m-0">
              Invoice #{invoice.invoiceNumber}
            </h1>
          </div>

          <div
            className={`flex ${isMobile ? "gap-3 flex-col w-full" : "gap-4 flex-row"} ${isMobile ? "items-center" : "items-center"}`}
          >
            <div
              className={`flex items-center gap-2 ${isMobile ? "w-full justify-center" : "w-auto justify-start"}`}
            >
              <label
                className={`${isMobile ? "text-sm" : "text-sm"} font-medium text-gray-700`}
              >
                Status:
              </label>
              <select
                disabled={statusSaving}
                value={invoice.status || "draft"}
                onChange={async (e) => {
                  const next = e.target.value;
                  setStatusSaving(true);
                  const prevStatus = invoice.status;
                  setInvoice((prev) =>
                    prev ? { ...prev, status: next } : null,
                  );

                  try {
                    const response = await fetch(
                      `/api/invoices/${invoice.id}`,
                      {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: next }),
                      },
                    );

                    if (!response.ok) {
                      throw new Error("Failed to update status");
                    }

                    toast.success(
                      "Status Updated",
                      "Invoice status updated successfully!",
                    );
                  } catch (error) {
                    console.error("Error updating status:", error);
                    setInvoice((prev) =>
                      prev ? { ...prev, status: prevStatus } : null,
                    );
                    toast.error(
                      "Status Update Failed",
                      "Failed to update invoice status. Please try again.",
                    );
                  } finally {
                    setStatusSaving(false);
                  }
                }}
                className={`${isMobile ? "px-3 py-2.5 text-sm w-32" : "px-2 py-1.5 text-sm w-auto"} border border-gray-300 rounded-md bg-white text-gray-700`}
              >
                <option value="draft">📝 Draft</option>
                <option value="open">🔵 Open</option>
                <option value="sent">📧 Sent (Pending Payment)</option>
                <option value="paid">✅ Paid</option>
                <option value="void">❌ Void</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowSendModal(true)}
                className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white border-none px-6 py-3 text-sm rounded-lg font-semibold cursor-pointer transition-all w-full sm:w-auto min-h-[44px]"
              >
                📧 Send Invoice
              </button>

              <Link
                href={`/admin/invoices/${invoice.id}/edit`}
                className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white border-none px-6 py-3 text-sm rounded-lg font-semibold no-underline transition-all w-full sm:w-auto min-h-[44px]"
              >
                ✏️ Edit Invoice
              </Link>

              {invoice?.status !== "paid" && (
                <button
                  onClick={handleMarkAsPaid}
                  className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white border-none px-6 py-3 text-sm rounded-lg font-semibold cursor-pointer transition-all w-full sm:w-auto min-h-[44px]"
                >
                  ✅ Mark as Paid
                </button>
              )}

              <button
                onClick={handleDeleteClick}
                className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white border-none px-6 py-3 text-sm rounded-lg font-semibold cursor-pointer transition-all w-full sm:w-auto min-h-[44px]"
              >
                🗑️ Delete Invoice
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={`max-w-4xl mx-auto ${isMobile ? "p-4" : "p-8"}`}>
        {/* Invoice Display */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            border: "1px solid #e2e8f0",
            padding: isMobile ? "1rem" : "2rem",
            marginBottom: isMobile ? "1rem" : "2rem",
          }}
        >
          {/* Company Header */}
          <div
            style={{
              textAlign: "center",
              marginBottom: isMobile ? "1.5rem" : "2rem",
              borderBottom: "2px solid #7a6990",
              paddingBottom: isMobile ? "0.75rem" : "1rem",
            }}
          >
            <h1
              style={{
                color: "#7a6990",
                fontSize: isMobile ? "1.75rem" : "2.5rem",
                fontWeight: "bold",
                margin: "0 0 0.5rem 0",
              }}
            >
              Serene Spaces
            </h1>
            <p
              style={{
                color: "#64748b",
                fontSize: isMobile ? "0.9rem" : "1.125rem",
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
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: isMobile ? "1.5rem" : "2rem",
              marginBottom: isMobile ? "1.5rem" : "2rem",
            }}
          >
            <div>
              <h3
                style={{
                  color: "#374151",
                  fontSize: isMobile ? "1rem" : "1.125rem",
                  fontWeight: "600",
                  marginBottom: "0.75rem",
                }}
              >
                Bill To:
              </h3>
              <p
                style={{
                  margin: "0.25rem 0",
                  color: "#1f2937",
                  fontSize: isMobile ? "0.9rem" : "1rem",
                }}
              >
                <strong>{invoice.customerName}</strong>
              </p>
              {invoice.customerEmail && (
                <p
                  style={{
                    margin: "0.25rem 0",
                    color: "#1f2937",
                    fontSize: isMobile ? "0.9rem" : "1rem",
                  }}
                >
                  {invoice.customerEmail}
                </p>
              )}
              {invoice.customerPhone && (
                <p
                  style={{
                    margin: "0.25rem 0",
                    color: "#1f2937",
                    fontSize: isMobile ? "0.9rem" : "1rem",
                  }}
                >
                  {invoice.customerPhone}
                </p>
              )}
              {invoice.customerAddress && (
                <p
                  style={{
                    margin: "0.25rem 0",
                    color: "#1f2937",
                    fontSize: isMobile ? "0.9rem" : "1rem",
                  }}
                >
                  {invoice.customerAddress}
                </p>
              )}
            </div>

            <div style={{ textAlign: isMobile ? "left" : "right" }}>
              <h3
                style={{
                  color: "#374151",
                  fontSize: isMobile ? "1rem" : "1.125rem",
                  fontWeight: "600",
                  marginBottom: "0.75rem",
                }}
              >
                Invoice Details:
              </h3>
              <p
                style={{
                  margin: "0.25rem 0",
                  color: "#1f2937",
                  fontSize: isMobile ? "0.9rem" : "1rem",
                }}
              >
                <strong>Date:</strong>{" "}
                {new Date(invoice.invoiceDate).toLocaleDateString()}
              </p>

              <p
                style={{
                  margin: "0.25rem 0",
                  color: "#1f2937",
                  fontSize: isMobile ? "0.9rem" : "1rem",
                }}
              >
                <strong>Invoice #:</strong> {invoice.invoiceNumber}
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
                      {formatCurrency(item.rate)}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        textAlign: "right",
                        color: "#1f2937",
                      }}
                    >
                      {formatCurrency(item.amount)}
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
                {formatCurrency(invoice.subtotal)}
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
                {formatCurrency(invoice.tax)}
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
                {formatCurrency(invoice.total)}
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
              {invoice.notes !== null && invoice.notes !== undefined && (
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
                  <p style={{ color: "#1f2937", margin: 0 }}>
                    {invoice.notes || "No notes provided"}
                  </p>
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
                disabled={deleting}
                style={{
                  padding: "10px 20px",
                  backgroundColor: deleting ? "#9ca3af" : "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  cursor: deleting ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {deleting ? "Deleting..." : "Delete Invoice"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
