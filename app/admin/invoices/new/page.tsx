"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PRICING, PRICE_LABELS, type PriceCode } from "@/lib/pricing";
import { safeJson } from "@/lib/utils";
import { toCents, fromCents, formatCurrency } from "@/lib/invoice-types";
import { useToast } from "@/components/ToastProvider";

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
  const router = useRouter();
  const toast = useToast();

  // Money math helpers
  const recompute = (
    items: {
      description: string;
      quantity: number;
      rate: number;
      amount: number;
    }[],
    applyTax: boolean,
    taxRate: number,
  ) => {
    // normalize item amounts from qty * rate
    const fixedItems = items.map((it) => {
      const amountC = toCents(it.quantity * it.rate);
      return { ...it, amount: fromCents(amountC) };
    });

    const subtotalC = fixedItems.reduce((s, it) => s + toCents(it.amount), 0);
    const taxC = applyTax ? Math.round(subtotalC * (taxRate / 100)) : 0;
    const totalC = subtotalC + taxC;

    return {
      items: fixedItems,
      subtotal: fromCents(subtotalC),
      tax: fromCents(taxC),
      total: fromCents(totalC),
    };
  };

  const [invoiceData, setInvoiceData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    items: [] as {
      description: string;
      quantity: number;
      rate: number;
      amount: number;
    }[],
    notes: "",
    terms:
      "Payment due before delivery\n\nHow to pay:\n• Zelle: loveserenespaces@gmail.com\n• Venmo: @beth-contos\n• Cash: Due at delivery",
    emailMessage: "",
    applyTax: true,
    taxRate: 6.25,
    _subtotal: 0,
    _tax: 0,
    _total: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();

    (async () => {
      try {
        const r = await fetch("/api/customers", { signal: ctrl.signal });
        if (r.ok) {
          const data = await r.json();
          if (Array.isArray(data)) setCustomers(data);
        }
      } catch (e: unknown) {
        if ((e as Error).name !== "AbortError")
          console.error("Error fetching customers:", e);
      } finally {
        setLoading(false);
      }
    })();

    const onResize = () => {
      const w = window.innerWidth;
      setIsMobile(w <= 640);
      setIsTablet(w > 640 && w <= 1024);
    };
    onResize();
    window.addEventListener("resize", onResize);

    return () => {
      ctrl.abort();
      window.removeEventListener("resize", onResize);
    };
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
    const nextItems = [...invoiceData.items];
    const v = typeof value === "string" ? value : value; // keep as-is
    // sanitize numbers
    if (field === "quantity")
      nextItems[index].quantity = Math.max(1, Number(v) || 1);
    else if (field === "rate")
      nextItems[index].rate = Math.max(0, Number(v) || 0);
    else nextItems[index].description = String(v);

    const { items, subtotal, tax, total } = recompute(
      nextItems,
      invoiceData.applyTax,
      invoiceData.taxRate,
    );
    setInvoiceData((prev) => ({
      ...prev,
      items,
      _subtotal: subtotal,
      _tax: tax,
      _total: total,
    }));
  };

  const addItem = () => {
    const nextItems = [
      ...invoiceData.items,
      { description: "", quantity: 1, rate: 0, amount: 0 },
    ];
    const { items, subtotal, tax, total } = recompute(
      nextItems,
      invoiceData.applyTax,
      invoiceData.taxRate,
    );
    setInvoiceData((prev) => ({
      ...prev,
      items,
      _subtotal: subtotal,
      _tax: tax,
      _total: total,
    }));
  };

  const removeItem = (index: number) => {
    if (invoiceData.items.length <= 1) return;
    const nextItems = invoiceData.items.filter((_, i) => i !== index);
    const { items, subtotal, tax, total } = recompute(
      nextItems,
      invoiceData.applyTax,
      invoiceData.taxRate,
    );
    setInvoiceData((prev) => ({
      ...prev,
      items,
      _subtotal: subtotal,
      _tax: tax,
      _total: total,
    }));
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
        toast.error(
          "Validation Error",
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
        subtotal: invoiceData._subtotal ?? 0,
        tax: invoiceData._tax ?? 0,
        total: invoiceData._total ?? 0,
        applyTax: invoiceData.applyTax,
        taxRate: invoiceData.taxRate,
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

      const result = await safeJson(response);

      if (!response.ok) {
        throw new Error(result.error || "Failed to create invoice");
      }

      // Redirect to the invoice view page
      router.push(`/admin/invoices/${result.id}`);
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error(
        "Creation Failed",
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
        toast.error(
          "Validation Error",
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
        subtotal: invoiceData._subtotal ?? 0,
        tax: invoiceData._tax ?? 0,
        total: invoiceData._total ?? 0,
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

      const result = await safeJson(response);

      if (!response.ok) {
        throw new Error(result.error || "Failed to save draft");
      }

      toast.success(
        "Draft Saved",
        `Draft saved successfully! Invoice ID: ${result.id}`,
      );

      // Redirect to the invoice view page
      router.push(`/admin/invoices/${result.id}`);
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error(
        "Save Failed",
        `Failed to save draft: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
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
                        const description = PRICE_LABELS[code as PriceCode];
                        const priceValue = PRICING[code as PriceCode];

                        const idx = invoiceData.items.findIndex(
                          (i) =>
                            i.description === description &&
                            i.rate === priceValue,
                        );
                        let nextItems;
                        if (idx >= 0) {
                          nextItems = invoiceData.items.map((it, i) =>
                            i === idx
                              ? { ...it, quantity: it.quantity + 1 }
                              : it,
                          );
                        } else {
                          nextItems = [
                            ...invoiceData.items,
                            {
                              description,
                              quantity: 1,
                              rate: priceValue,
                              amount: 0,
                            },
                          ];
                        }
                        const { items, subtotal, tax, total } = recompute(
                          nextItems,
                          invoiceData.applyTax,
                          invoiceData.taxRate,
                        );
                        setInvoiceData((prev) => ({
                          ...prev,
                          items,
                          _subtotal: subtotal,
                          _tax: tax,
                          _total: total,
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
                        {formatCurrency(price)}
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
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-lg text-sm font-medium cursor-pointer transition-all"
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

                  {invoiceData.items.length === 0 && (
                    <div
                      style={{
                        padding: "2rem",
                        textAlign: "center",
                        color: "#64748b",
                        fontSize: "0.9rem",
                        backgroundColor: "#f8fafc",
                        borderRadius: "0.5rem",
                        border: "1px dashed #cbd5e1",
                        margin: "1rem 0",
                      }}
                    >
                      No items added yet. Click &quot;+ Add Item&quot; to get
                      started.
                    </div>
                  )}

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
                          inputMode="numeric"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", e.target.value)
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
                          inputMode="decimal"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) =>
                            handleItemChange(index, "rate", e.target.value)
                          }
                          onBlur={(e) => {
                            e.target.style.borderColor = "#e5e7eb";
                            handleItemChange(
                              index,
                              "rate",
                              Number(Number(e.target.value || 0).toFixed(2)),
                            );
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
                        {formatCurrency(item.amount)}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={invoiceData.items.length === 1}
                        className={`px-2 py-1 text-white border-none rounded text-xs transition-all ${
                          invoiceData.items.length === 1
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700 cursor-pointer"
                        }`}
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

              {/* Tax Controls */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.25rem",
                    margin: "0 0 1rem 0",
                    color: "#1a1a1a",
                    fontWeight: "600",
                  }}
                >
                  Tax Settings
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "1rem",
                    alignItems: isMobile ? "stretch" : "center",
                    marginBottom: "1rem",
                  }}
                >
                  {/* Apply Tax Toggle */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      flex: 1,
                    }}
                  >
                    <input
                      type="checkbox"
                      id="applyTax"
                      checked={invoiceData.applyTax}
                      onChange={(e) => {
                        const applyTax = e.target.checked;
                        const { items, subtotal, tax, total } = recompute(
                          invoiceData.items,
                          applyTax,
                          invoiceData.taxRate,
                        );
                        setInvoiceData((prev) => ({
                          ...prev,
                          applyTax,
                          items,
                          _subtotal: subtotal,
                          _tax: tax,
                          _total: total,
                        }));
                      }}
                      style={{
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                      }}
                    />
                    <label
                      htmlFor="applyTax"
                      style={{
                        fontSize: "1rem",
                        color: "#333",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                    >
                      Apply Tax
                    </label>
                  </div>

                  {/* Tax Rate Input */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      flex: 1,
                    }}
                  >
                    <label
                      htmlFor="taxRate"
                      style={{
                        fontSize: "1rem",
                        color: "#333",
                        fontWeight: "500",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Tax Rate:
                    </label>
                    <input
                      type="number"
                      id="taxRate"
                      value={invoiceData.taxRate}
                      onChange={(e) => {
                        const taxRate = parseFloat(e.target.value) || 0;
                        const { items, subtotal, tax, total } = recompute(
                          invoiceData.items,
                          invoiceData.applyTax,
                          taxRate,
                        );
                        setInvoiceData((prev) => ({
                          ...prev,
                          taxRate,
                          items,
                          _subtotal: subtotal,
                          _tax: tax,
                          _total: total,
                        }));
                      }}
                      min="0"
                      max="100"
                      step="0.01"
                      disabled={!invoiceData.applyTax}
                      style={{
                        width: "80px",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "0.5rem",
                        fontSize: "1rem",
                        backgroundColor: invoiceData.applyTax
                          ? "white"
                          : "#f5f5f5",
                        color: invoiceData.applyTax ? "#333" : "#999",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "1rem",
                        color: "#666",
                        fontWeight: "500",
                      }}
                    >
                      %
                    </span>
                  </div>
                </div>

                {/* Tax Summary */}
                <div
                  style={{
                    padding: "0.75rem",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "0.5rem",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.9rem",
                      color: "#666",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <span>Subtotal:</span>
                    <span>{formatCurrency(invoiceData._subtotal ?? 0)}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.9rem",
                      color: "#666",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <span>Tax ({invoiceData.taxRate}%):</span>
                    <span>{formatCurrency(invoiceData._tax ?? 0)}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#1a1a1a",
                      paddingTop: "0.5rem",
                      borderTop: "1px solid #e9ecef",
                    }}
                  >
                    <span>Total:</span>
                    <span>{formatCurrency(invoiceData._total ?? 0)}</span>
                  </div>
                </div>
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
                    <span>{formatCurrency(invoiceData._subtotal ?? 0)}</span>
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
                    <span>{formatCurrency(invoiceData._tax ?? 0)}</span>
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
                    <span>{formatCurrency(invoiceData._total ?? 0)}</span>
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
                    className={`px-6 py-3 text-white border-none rounded-lg text-sm font-semibold transition-all ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                    }`}
                  >
                    {isSubmitting ? "Creating..." : "Create Invoice"}
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveAsDraft}
                    className="px-6 py-3 bg-transparent text-blue-600 border-2 border-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    Save as Draft
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
                            toast.success(
                              "Test Email Sent",
                              `Test email sent successfully to ${testEmail}!`,
                            );
                          } else {
                            toast.error(
                              "Test Email Failed",
                              `Failed to send test email: ${result.error}`,
                            );
                          }
                        } catch (error) {
                          console.error("Error sending test email:", error);
                          toast.error(
                            "Test Email Failed",
                            "Failed to send test email. Please try again.",
                          );
                        }
                      }
                    }}
                    className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white border-none rounded-lg text-sm font-medium cursor-pointer transition-all"
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
