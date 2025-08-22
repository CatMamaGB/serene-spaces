"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PRICING, PRICE_LABELS, type PriceCode } from "@/lib/pricing";

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
}

export default function CreateInvoice() {
  const [invoiceData, setInvoiceData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
    notes: "",
    terms:
      "Payment due before delivery\n\nHow to pay:\n• Zelle: loveserenespaces@gmail.com\n• Venmo: @beth-contos\n• Cash: Due at delivery",
    emailMessage: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    // Check screen size
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 640);
      setIsTablet(width > 640 && width <= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    // Fetch customers from API
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customers");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setCustomers(data);
          }
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomerId(customerId);
    if (customerId) {
      const customer = customers.find((c) => c.id === customerId);
      if (customer) {
        setInvoiceData((prev) => ({
          ...prev,
          customerName: customer.name,
          customerEmail: customer.email || "",
          customerPhone: customer.phone || "",
          customerAddress: `${customer.addressLine1 || ""}${customer.addressLine2 ? `, ${customer.addressLine2}` : ""}${customer.city ? `, ${customer.city}` : ""}${customer.state ? `, ${customer.state}` : ""}${customer.postalCode ? `, ${customer.postalCode}` : ""}`,
        }));
      }
    } else {
      // Clear customer info when "Select a customer" is chosen
      setInvoiceData((prev) => ({
        ...prev,
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        customerAddress: "",
      }));
    }
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newItems = [...invoiceData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Calculate amount
    if (field === "quantity" || field === "rate") {
      const quantity =
        field === "quantity" ? Number(value) : newItems[index].quantity;
      const rate = field === "rate" ? Number(value) : newItems[index].rate;
      newItems[index].amount = quantity * rate;
    }

    setInvoiceData((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  const addItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", quantity: 1, rate: 0, amount: 0 },
      ],
    }));
  };

  const removeItem = (index: number) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.0625; // 6.25% Illinois Sales Tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (
        !invoiceData.customerName ||
        invoiceData.items.length === 0 ||
        invoiceData.items[0].description === ""
      ) {
        alert(
          "Please fill in all required fields: customer name and at least one item with description.",
        );
        return;
      }

      // Create invoice data in the format expected by the API
      const invoicePayload = {
        customerName: invoiceData.customerName,
        customerEmail: invoiceData.customerEmail,
        customerPhone: invoiceData.customerPhone,
        customerAddress: invoiceData.customerAddress,
        invoiceDate: invoiceData.invoiceDate,
        items: invoiceData.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
        })),
        notes: invoiceData.notes,
        terms: invoiceData.terms,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        total: calculateTotal(),
        status: "draft",
      };

      // Save to database first
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoicePayload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create invoice");
      }

      const result = await response.json();

      // Redirect to the invoice view page
      window.location.href = `/admin/invoices/${result.id}`;
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert(
        `Failed to create invoice: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = async () => {
    try {
      // Validate required fields
      if (
        !invoiceData.customerName ||
        invoiceData.items.length === 0 ||
        invoiceData.items[0].description === ""
      ) {
        alert(
          "Please fill in all required fields: customer name and at least one item with description.",
        );
        return;
      }

      // Create invoice data in the format expected by the API
      const invoicePayload = {
        customerName: invoiceData.customerName,
        customerEmail: invoiceData.customerEmail,
        customerPhone: invoiceData.customerPhone,
        customerAddress: invoiceData.customerAddress,
        invoiceDate: invoiceData.invoiceDate,
        dueDate: invoiceData.dueDate,
        items: invoiceData.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
        })),
        notes: invoiceData.notes,
        terms: invoiceData.terms,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        total: calculateTotal(),
        status: "draft",
      };

      // Save to database as draft
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoicePayload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save draft");
      }

      const result = await response.json();

      alert("Draft saved successfully! Invoice ID: " + result.id);

      // Redirect to the invoice view page
      window.location.href = `/admin/invoices/${result.id}`;
    } catch (error) {
      console.error("Error saving draft:", error);
      alert(
        `Failed to save draft: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const handleSendEmail = async () => {
    if (!invoiceData.customerEmail) {
      alert("Please enter a customer email address to send the invoice.");
      return;
    }

    if (
      invoiceData.items.length === 0 ||
      invoiceData.items[0].description === ""
    ) {
      alert("Please add at least one item to the invoice before sending.");
      return;
    }

    setIsSendingEmail(true);

    try {
      const response = await fetch("/api/invoices/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...invoiceData,
          subtotal: calculateSubtotal(),
          tax: calculateTax(),
          total: calculateTotal(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Invoice sent successfully to ${invoiceData.customerEmail}!`);
      } else {
        alert(`Failed to send invoice: ${result.error}`);
      }
    } catch (error) {
      console.error("Error sending invoice:", error);
      alert("Failed to send invoice. Please try again.");
    } finally {
      setIsSendingEmail(false);
    }
  };

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
          padding: isMobile ? "1rem" : isTablet ? "1.5rem" : "2rem",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "0.75rem" : "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "0.75rem" : "1rem",
              flexDirection: isMobile ? "column" : "row",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            <Link
              href="/admin"
              style={{
                color: "#7a6990",
                textDecoration: "none",
                fontSize: isMobile ? "0.875rem" : "0.875rem",
                fontWeight: "500",
                padding: isMobile ? "0.5rem" : "0.25rem",
                borderRadius: "0.375rem",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f3f4f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              ← Back to Dashboard
            </Link>
            <h1
              style={{
                color: "#1e293b",
                fontSize: isMobile
                  ? "1.5rem"
                  : isTablet
                    ? "1.75rem"
                    : "1.875rem",
                fontWeight: "700",
                margin: 0,
                lineHeight: "1.2",
              }}
            >
              Create New Invoice
            </h1>
          </div>
        </div>
      </header>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "1rem" : isTablet ? "1.5rem" : "2rem",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : isTablet
                  ? "1fr"
                  : "2fr 1fr",
              gap: isMobile ? "1.5rem" : isTablet ? "2rem" : "2rem",
            }}
          >
            {/* Main Form */}
            <div>
              {/* Customer Selection */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                  padding: isMobile ? "1rem" : "1.5rem",
                  marginBottom: isMobile ? "1rem" : "1.5rem",
                }}
              >
                <h2
                  style={{
                    color: "#1e293b",
                    fontSize: isMobile ? "1.1rem" : "1.25rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                  }}
                >
                  Select Customer
                </h2>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Choose Existing Customer
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => handleCustomerSelect(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      backgroundColor: "white",
                      color: "#374151",
                      cursor: "pointer",
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
                    <option value="">Select a customer...</option>
                    {loading ? (
                      <option value="">Loading customers...</option>
                    ) : customers.length === 0 ? (
                      <option value="">
                        No customers found. Add one in the Customers page.
                      </option>
                    ) : (
                      customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name} -{" "}
                          {customer.email || customer.phone || "N/A"}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Customer Information */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <h2
                  style={{
                    color: "#1e293b",
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                  }}
                >
                  Customer Information
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile
                      ? "1fr"
                      : isTablet
                        ? "1fr 1fr"
                        : "1fr 1fr",
                    gap: isMobile ? "1rem" : "1rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "500",
                        color: "#374151",
                      }}
                    >
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={invoiceData.customerName}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
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
                        marginBottom: "0.5rem",
                        fontWeight: "500",
                        color: "#374151",
                      }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={invoiceData.customerEmail}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
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
                        marginBottom: "0.5rem",
                        fontWeight: "500",
                        color: "#374151",
                      }}
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={invoiceData.customerPhone}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
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
                        marginBottom: "0.5rem",
                        fontWeight: "500",
                        color: "#374151",
                      }}
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      name="customerAddress"
                      value={invoiceData.customerAddress}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
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
              </div>

              {/* Quick Add Services */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <h2
                  style={{
                    color: "#1e293b",
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                  }}
                >
                  Quick Add Services
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  {Object.entries(PRICING).map(([code, price]) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        const newItem = {
                          description: PRICE_LABELS[code as PriceCode],
                          quantity: 1,
                          rate: price,
                          amount: price,
                        };
                        setInvoiceData((prev) => ({
                          ...prev,
                          items: [...prev.items, newItem],
                        }));
                      }}
                      style={{
                        backgroundColor: "#f8fafc",
                        color: "#374151",
                        border: "1px solid #e5e7eb",
                        padding: "0.5rem",
                        borderRadius: "0.375rem",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{ fontWeight: "600", marginBottom: "0.125rem" }}
                      >
                        {PRICE_LABELS[code as PriceCode]}
                      </div>
                      <div style={{ fontSize: "0.625rem", opacity: "0.8" }}>
                        ${price.toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>

                <div
                  style={{
                    backgroundColor: "#f0f9ff",
                    border: "1px solid #0ea5e9",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                    fontSize: "0.875rem",
                    color: "#0c4a6e",
                  }}
                >
                  <strong>Note:</strong> Wraps and boots are $5 each. Click any
                  service above to add it to your invoice.
                </div>
              </div>

              {/* Invoice Items */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h2
                    style={{
                      color: "#1e293b",
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      margin: 0,
                    }}
                  >
                    Invoice Items
                  </h2>
                  <button
                    type="button"
                    onClick={addItem}
                    style={{
                      backgroundColor: "#7a6990",
                      color: "white",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    + Add Item
                  </button>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile
                        ? "1fr"
                        : isTablet
                          ? "2fr 1fr 1fr"
                          : "2fr 1fr 1fr 1fr auto",
                      gap: isMobile ? "0.5rem" : "1rem",
                      padding: isMobile ? "0.5rem" : "0.75rem",
                      backgroundColor: "#f8fafc",
                      borderRadius: "0.5rem",
                      fontWeight: "500",
                      fontSize: isMobile ? "0.75rem" : "0.875rem",
                      color: "#64748b",
                    }}
                  >
                    <div>Description</div>
                    {!isMobile && <div>Qty</div>}
                    {!isMobile && <div>Rate</div>}
                    <div>Amount</div>
                    {!isMobile && <div></div>}
                  </div>

                  {invoiceData.items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile
                          ? "1fr"
                          : isTablet
                            ? "2fr 1fr 1fr"
                            : "2fr 1fr 1fr 1fr auto",
                        gap: isMobile ? "0.5rem" : "1rem",
                        padding: isMobile ? "0.5rem 0" : "0.75rem 0",
                        alignItems: "center",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                        placeholder="Service description"
                        style={{
                          padding: "0.5rem",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.375rem",
                          fontSize: "0.875rem",
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
                      {!isMobile && (
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "quantity",
                              Number(e.target.value),
                            )
                          }
                          min="1"
                          style={{
                            padding: "0.5rem",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.375rem",
                            fontSize: "0.875rem",
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
                      )}
                      {!isMobile && (
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "rate",
                              Number(e.target.value),
                            )
                          }
                          min="0"
                          step="0.01"
                          style={{
                            padding: "0.5rem",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.375rem",
                            fontSize: "0.875rem",
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
                      )}
                      <div
                        style={{
                          padding: "0.5rem",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#1e293b",
                        }}
                      >
                        ${item.amount.toFixed(2)}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={invoiceData.items.length === 1}
                        style={{
                          backgroundColor:
                            invoiceData.items.length === 1
                              ? "#9ca3af"
                              : "#ef4444",
                          color: "white",
                          border: "none",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.375rem",
                          fontSize: "0.75rem",
                          cursor:
                            invoiceData.items.length === 1
                              ? "not-allowed"
                              : "pointer",
                          transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (invoiceData.items.length > 1) {
                            e.currentTarget.style.backgroundColor = "#dc2626";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (invoiceData.items.length > 1) {
                            e.currentTarget.style.backgroundColor = "#ef4444";
                          }
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Message */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <h2
                  style={{
                    color: "#1e293b",
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                  }}
                >
                  Personal Message (Optional)
                </h2>
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "0.875rem",
                    marginBottom: "1rem",
                    lineHeight: "1.5",
                  }}
                >
                  Add a personal message to include in the email with the
                  invoice.
                </p>
                <textarea
                  name="emailMessage"
                  value={invoiceData.emailMessage}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="e.g., Thank you for choosing Serene Spaces! We appreciate your business."
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    resize: "vertical",
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

              {/* Notes & Terms */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.5rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "500",
                        color: "#374151",
                      }}
                    >
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={invoiceData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        resize: "vertical",
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
                        marginBottom: "0.5rem",
                        fontWeight: "500",
                        color: "#374151",
                      }}
                    >
                      Terms & Payment Instructions
                    </label>
                    <textarea
                      name="terms"
                      value={invoiceData.terms}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="Payment due before delivery

How to pay:
• Zelle: loveserenespaces@gmail.com
• Venmo: @beth-contos
• Cash: Due at delivery"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        resize: "vertical",
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
              </div>
            </div>

            {/* Invoice Summary */}
            <div>
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                  padding: "1.5rem",
                  position: "sticky",
                  top: "2rem",
                }}
              >
                <h2
                  style={{
                    color: "#1e293b",
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                  }}
                >
                  Invoice Summary
                </h2>

                {/* Invoice Details */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontWeight: "500",
                          color: "#374151",
                          fontSize: "0.875rem",
                        }}
                      >
                        Invoice Date
                      </label>
                      <input
                        type="date"
                        name="invoiceDate"
                        value={invoiceData.invoiceDate}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.375rem",
                          fontSize: "0.875rem",
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
                </div>

                {/* Totals */}
                <div
                  style={{
                    borderTop: "1px solid #e2e8f0",
                    paddingTop: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                      fontSize: "0.875rem",
                      color: "#64748b",
                    }}
                  >
                    <span>Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                      fontSize: "0.875rem",
                      color: "#64748b",
                    }}
                  >
                    <span>Tax (6.25%)</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: "0.5rem",
                      borderTop: "1px solid #e2e8f0",
                      fontSize: "1.125rem",
                      fontWeight: "700",
                      color: "#1e293b",
                    }}
                  >
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div
                  style={{
                    marginTop: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: isSubmitting ? "#9ca3af" : "#7a6990",
                      color: "white",
                      border: "none",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isSubmitting ? "Creating..." : "Create Invoice"}
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveAsDraft}
                    style={{
                      backgroundColor: "transparent",
                      color: "#7a6990",
                      border: "1px solid #7a6990",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Save as Draft
                  </button>

                  <button
                    type="button"
                    onClick={handleSendEmail}
                    disabled={
                      isSendingEmail ||
                      !invoiceData.customerEmail ||
                      invoiceData.items.length === 0 ||
                      invoiceData.items[0].description === ""
                    }
                    style={{
                      backgroundColor:
                        isSendingEmail ||
                        !invoiceData.customerEmail ||
                        invoiceData.items.length === 0 ||
                        invoiceData.items[0].description === ""
                          ? "#9ca3af"
                          : "#10b981",
                      color: "white",
                      border: "none",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      cursor:
                        isSendingEmail ||
                        !invoiceData.customerEmail ||
                        invoiceData.items.length === 0 ||
                        invoiceData.items[0].description === ""
                          ? "not-allowed"
                          : "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isSendingEmail ? "Sending..." : "📧 Send Invoice"}
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      const testEmail = prompt(
                        "Enter email address for test email:",
                      );
                      if (testEmail) {
                        try {
                          const response = await fetch(
                            `/api/invoices/send?email=${encodeURIComponent(testEmail)}`,
                          );
                          const result = await response.json();
                          if (response.ok) {
                            alert(
                              `Test email sent successfully to ${testEmail}!`,
                            );
                          } else {
                            alert(`Failed to send test email: ${result.error}`);
                          }
                        } catch (error) {
                          console.error("Error sending test email:", error);
                          alert("Failed to send test email. Please try again.");
                        }
                      }
                    }}
                    style={{
                      backgroundColor: "#f59e0b",
                      color: "white",
                      border: "none",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    🧪 Test Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
