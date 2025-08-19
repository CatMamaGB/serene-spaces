"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Invoice = {
  id: string;
  customerName: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  total: number;
  status: string;
  hostedUrl?: string;
  pdfUrl?: string;
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<{
    id: string;
    customerName: string;
  } | null>(null);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Mock data for now since the API might not be set up yet
    const mockInvoices: Invoice[] = [
      {
        id: "1",
        customerName: "Sarah Johnson",
        invoiceNumber: "INV-001",
        issueDate: "2024-01-15",
        dueDate: "2024-02-14",
        total: 24500, // $245.00 in cents
        status: "open",
      },
      {
        id: "2",
        customerName: "Mike Chen",
        invoiceNumber: "INV-002",
        issueDate: "2024-01-14",
        dueDate: "2024-02-13",
        total: 18050, // $180.50 in cents
        status: "paid",
      },
      {
        id: "3",
        customerName: "Emily Rodriguez",
        invoiceNumber: "INV-003",
        issueDate: "2024-01-13",
        dueDate: "2024-02-12",
        total: 32000, // $320.00 in cents
        status: "draft",
      },
    ];

    // For now, just use mock data directly since the API isn't fully set up
    setInvoices(mockInvoices);
    setLoading(false);

    return () => window.removeEventListener("resize", checkMobile);

    // TODO: Uncomment this when the API is properly set up
    /*
    fetch('/api/invoices/list')
      .then(r => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setInvoices(data);
        } else {
          console.warn('API returned non-array data, using mock data');
          setInvoices(mockInvoices);
        }
      })
      .catch(error => {
        console.error('Error fetching invoices, using mock data:', error);
        setInvoices(mockInvoices);
      })
      .finally(() => setLoading(false));
    */
  }, []);

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDeleteInvoice = async (
    invoiceId: string,
    customerName: string,
  ) => {
    setInvoiceToDelete({ id: invoiceId, customerName });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!invoiceToDelete) return;

    try {
      const response = await fetch(`/api/invoices/${invoiceToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the invoice from the local state
        setInvoices((prev) =>
          prev.filter((invoice) => invoice.id !== invoiceToDelete.id),
        );
        setShowDeleteModal(false);
        setInvoiceToDelete(null);
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
    setInvoiceToDelete(null);
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
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{ textAlign: "center", padding: isMobile ? "40px" : "60px" }}
          >
            <div
              style={{ fontSize: isMobile ? "1rem" : "1.2rem", color: "#666" }}
            >
              Loading invoices...
            </div>
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
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
              Invoice Management
            </h1>
            <p
              style={{
                color: "#666",
                margin: "8px 0 0 0",
                fontSize: isMobile ? "0.9rem" : "1rem",
              }}
            >
              Manage and track all customer invoices
            </p>
          </div>
          <Link
            href="/admin/invoices/new"
            style={{
              padding: isMobile ? "14px 20px" : "12px 24px",
              backgroundColor: "#7a6990",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: isMobile ? "0.9rem" : "1rem",
              fontWeight: "600",
              textAlign: "center",
              width: isMobile ? "100%" : "auto",
            }}
          >
            + New Invoice
          </Link>
        </div>

        {invoices.length === 0 ? (
          <div
            style={{
              backgroundColor: "white",
              padding: isMobile ? "40px 20px" : "60px",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border: "1px solid #e9ecef",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: isMobile ? "2rem" : "3rem",
                marginBottom: "24px",
                opacity: "0.3",
              }}
            >
              📄
            </div>
            <h3
              style={{
                fontSize: isMobile ? "1.25rem" : "1.5rem",
                margin: "0 0 16px 0",
                color: "#1a1a1a",
              }}
            >
              No Invoices Yet
            </h3>
            <p
              style={{
                color: "#666",
                margin: "0 0 24px 0",
                fontSize: isMobile ? "1rem" : "1.1rem",
              }}
            >
              Create your first invoice to get started
            </p>
            <Link
              href="/admin/invoices/new"
              style={{
                padding: isMobile ? "14px 20px" : "12px 24px",
                backgroundColor: "#7a6990",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontSize: isMobile ? "0.9rem" : "1rem",
                fontWeight: "600",
                width: isMobile ? "100%" : "auto",
                display: "inline-block",
              }}
            >
              Create Invoice
            </Link>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border: "1px solid #e9ecef",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: isMobile ? "16px" : "24px",
                borderBottom: "1px solid #e9ecef",
                backgroundColor: "#f8f9fa",
              }}
            >
              <h3
                style={{
                  fontSize: isMobile ? "1.1rem" : "1.2rem",
                  margin: "0",
                  color: "#1a1a1a",
                  textAlign: isMobile ? "center" : "left",
                }}
              >
                Invoice List ({invoices.length} invoices)
              </h3>
            </div>

            {/* Mobile Card Layout */}
            {isMobile ? (
              <div style={{ padding: "16px" }}>
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    style={{
                      border: "1px solid #e9ecef",
                      borderRadius: "12px",
                      padding: "16px",
                      marginBottom: "16px",
                      backgroundColor: "#fafbfc",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "12px",
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            margin: "0 0 4px 0",
                            fontSize: "1.1rem",
                            color: "#1a1a1a",
                            fontWeight: "600",
                          }}
                        >
                          {invoice.invoiceNumber || "N/A"}
                        </h4>
                        <p
                          style={{
                            margin: "0",
                            fontSize: "0.9rem",
                            color: "#666",
                          }}
                        >
                          {invoice.customerName}
                        </p>
                      </div>
                      <select
                        value={invoice.status}
                        onChange={async (e) => {
                          try {
                            const response = await fetch(
                              `/api/invoices/${invoice.id}`,
                              {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  status: e.target.value,
                                }),
                              },
                            );

                            if (response.ok) {
                              // Update the local state
                              setInvoices((prev) =>
                                prev.map((inv) =>
                                  inv.id === invoice.id
                                    ? { ...inv, status: e.target.value }
                                    : inv,
                                ),
                              );
                            } else {
                              alert("Failed to update status");
                            }
                          } catch (error) {
                            console.error("Error updating status:", error);
                            alert("Failed to update status");
                          }
                        }}
                        style={{
                          padding: "4px 8px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          backgroundColor: "white",
                          color: "#374151",
                          cursor: "pointer",
                        }}
                      >
                        <option value="draft">Draft</option>
                        <option value="open">Open</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="void">Void</option>
                      </select>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gap: "8px",
                        fontSize: "0.9rem",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ color: "#666" }}>Issue Date:</span>
                        <span style={{ color: "#1a1a1a", fontWeight: "500" }}>
                          {invoice.issueDate
                            ? formatDate(invoice.issueDate)
                            : "N/A"}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ color: "#666" }}>Due Date:</span>
                        <span style={{ color: "#1a1a1a", fontWeight: "500" }}>
                          {invoice.dueDate
                            ? formatDate(invoice.dueDate)
                            : "N/A"}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ color: "#666" }}>Total:</span>
                        <span
                          style={{
                            color: "#1a1a1a",
                            fontWeight: "600",
                            fontSize: "1rem",
                          }}
                        >
                          {formatCurrency(invoice.total)}
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "center",
                      }}
                    >
                      <Link
                        href={`/admin/invoices/${invoice.id}`}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "#7a6990",
                          color: "white",
                          textDecoration: "none",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: "500",
                          flex: 1,
                          textAlign: "center",
                        }}
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/invoices/${invoice.id}/edit`}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "#007bff",
                          color: "white",
                          textDecoration: "none",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: "500",
                          flex: 1,
                          textAlign: "center",
                        }}
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Desktop Table Layout */
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#f8f9fa" }}>
                      <th
                        style={{
                          padding: "16px",
                          textAlign: "left",
                          borderBottom: "1px solid #e9ecef",
                          color: "#1a1a1a",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                        }}
                      >
                        Invoice #
                      </th>
                      <th
                        style={{
                          padding: "16px",
                          textAlign: "left",
                          borderBottom: "1px solid #e9ecef",
                          color: "#1a1a1a",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                        }}
                      >
                        Customer
                      </th>
                      <th
                        style={{
                          padding: "16px",
                          textAlign: "left",
                          borderBottom: "1px solid #e9ecef",
                          color: "#1a1a1a",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                        }}
                      >
                        Issue Date
                      </th>
                      <th
                        style={{
                          padding: "16px",
                          textAlign: "left",
                          borderBottom: "1px solid #e9ecef",
                          color: "#1a1a1a",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                        }}
                      >
                        Due Date
                      </th>
                      <th
                        style={{
                          padding: "16px",
                          textAlign: "right",
                          borderBottom: "1px solid #e9ecef",
                          color: "#1a1a1a",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                        }}
                      >
                        Total
                      </th>
                      <th
                        style={{
                          padding: "16px",
                          textAlign: "center",
                          borderBottom: "1px solid #e9ecef",
                          color: "#1a1a1a",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          padding: "16px",
                          textAlign: "center",
                          borderBottom: "1px solid #e9ecef",
                          color: "#1a1a1a",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        style={{
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        <td
                          style={{
                            padding: "16px",
                            color: "#1a1a1a",
                            fontWeight: "500",
                          }}
                        >
                          {invoice.invoiceNumber || "N/A"}
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            color: "#1a1a1a",
                          }}
                        >
                          {invoice.customerName}
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            color: "#666",
                            fontSize: "0.9rem",
                          }}
                        >
                          {invoice.issueDate
                            ? formatDate(invoice.issueDate)
                            : "N/A"}
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            color: "#666",
                            fontSize: "0.9rem",
                          }}
                        >
                          {invoice.dueDate
                            ? formatDate(invoice.dueDate)
                            : "N/A"}
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            textAlign: "right",
                            color: "#1a1a1a",
                            fontWeight: "600",
                          }}
                        >
                          {formatCurrency(invoice.total)}
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            textAlign: "center",
                          }}
                        >
                          <select
                            value={invoice.status}
                            onChange={async (e) => {
                              try {
                                const response = await fetch(
                                  `/api/invoices/${invoice.id}`,
                                  {
                                    method: "PATCH",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      status: e.target.value,
                                    }),
                                  },
                                );

                                if (response.ok) {
                                  // Update the local state
                                  setInvoices((prev) =>
                                    prev.map((inv) =>
                                      inv.id === invoice.id
                                        ? { ...inv, status: e.target.value }
                                        : inv,
                                    ),
                                  );
                                } else {
                                  alert("Failed to update status");
                                }
                              } catch (error) {
                                console.error("Error updating status:", error);
                                alert("Failed to update status");
                              }
                            }}
                            style={{
                              padding: "4px 8px",
                              border: "1px solid #d1d5db",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              backgroundColor: "white",
                              color: "#374151",
                              cursor: "pointer",
                            }}
                          >
                            <option value="draft">Draft</option>
                            <option value="open">Open</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="void">Void</option>
                          </select>
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              justifyContent: "center",
                            }}
                          >
                            <Link
                              href={`/admin/invoices/${invoice.id}`}
                              style={{
                                padding: "6px 12px",
                                backgroundColor: "#7a6990",
                                color: "white",
                                textDecoration: "none",
                                borderRadius: "4px",
                                fontSize: "0.8rem",
                                fontWeight: "500",
                              }}
                            >
                              View
                            </Link>
                            <Link
                              href={`/admin/invoices/${invoice.id}/edit`}
                              style={{
                                padding: "6px 12px",
                                backgroundColor: "#007bff",
                                color: "white",
                                textDecoration: "none",
                                borderRadius: "4px",
                                fontSize: "0.8rem",
                                fontWeight: "500",
                                display: "inline-block",
                              }}
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() =>
                                handleDeleteInvoice(
                                  invoice.id,
                                  invoice.customerName,
                                )
                              }
                              style={{
                                padding: "6px 12px",
                                backgroundColor: "#dc2626",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "0.8rem",
                                fontWeight: "500",
                                cursor: "pointer",
                                transition: "background-color 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#b91c1c";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#dc2626";
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && invoiceToDelete && (
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
              Are you sure you want to delete the invoice for{" "}
              <strong>{invoiceToDelete.customerName}</strong>?
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
