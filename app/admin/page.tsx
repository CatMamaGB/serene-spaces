"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

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
  createdAt: string;
  updatedAt: string;
}

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
  estimatedCost?: number;
  scheduledPickupDate?: string;
}

interface Invoice {
  id: string;
  customerId: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  customerName: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate?: string; // Optional since we're removing it
  total: number;
  status: string;
  hostedUrl?: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  subtotal: number;
  tax: number;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitAmount: number;
  }>;
}

export default function AdminDashboard() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in a real app, this would come from APIs
  const mockCustomers: Customer[] = useMemo(
    () => [
      {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "(555) 123-4567",
        addressLine1: "123 Main Street",
        addressLine2: null,
        city: "Portland",
        state: "OR",
        postalCode: "97201",
        createdAt: "2023-10-20T10:00:00Z",
        updatedAt: "2023-10-20T10:00:00Z",
      },
    ],
    [],
  );

  const mockInvoices: Invoice[] = useMemo(
    () => [
      {
        id: "1",
        customerId: "mock-customer-1",
        customer: {
          id: "mock-customer-1",
          name: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          phone: "(555) 123-4567",
        },
        customerName: "Sarah Johnson",
        invoiceNumber: "INV-001",
        issueDate: "2024-01-15",
        total: 24500, // $245.00 in cents
        status: "paid",
        hostedUrl: undefined,
        pdfUrl: undefined,
        createdAt: "2024-01-15T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z",
        notes: "Mock invoice for testing",
        subtotal: 23000,
        tax: 1500,
        items: [
          {
            id: "mock-item-1",
            description: "Blanket (with fill)",
            quantity: 2,
            unitAmount: 11500,
          },
        ],
      },
    ],
    [],
  );

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Fetch real data from APIs
    const fetchData = async () => {
      try {
        // Fetch customers
        const customersResponse = await fetch("/api/customers");
        if (customersResponse.ok) {
          const customersData = await customersResponse.json();
          console.log("Fetched customers:", customersData);
          setCustomers(customersData);
        } else {
          console.log("Failed to fetch customers, using mock data");
          setCustomers(mockCustomers); // Fallback to mock data
        }

        // Fetch service requests
        const serviceRequestsResponse = await fetch("/api/service-requests");
        if (serviceRequestsResponse.ok) {
          const serviceRequestsData = await serviceRequestsResponse.json();
          setServiceRequests(serviceRequestsData);
        } else {
          setServiceRequests([]); // Empty array if API fails
        }

        // Fetch invoices
        const invoicesResponse = await fetch("/api/invoices/list");
        if (invoicesResponse.ok) {
          const invoicesData = await invoicesResponse.json();
          console.log("Fetched invoices:", invoicesData);
          setInvoices(invoicesData);
        } else {
          console.log("Failed to fetch invoices, using mock data");
          setInvoices(mockInvoices); // Fallback to mock data
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Use mock data as fallback
        setCustomers(mockCustomers);
        setServiceRequests([]);
        setInvoices(mockInvoices);
      }

      setLoading(false);

      // Debug logging
      console.log("Dashboard data loaded:");
      console.log("- Customers:", customers.length);
      console.log("- Service Requests:", serviceRequests.length);
      console.log("- Invoices:", invoices.length);
    };

    fetchData();

    return () => window.removeEventListener("resize", checkMobile);
  }, [
    mockCustomers,
    mockInvoices,
    customers.length,
    invoices.length,
    serviceRequests.length,
  ]);

  const stats = {
    totalCustomers: customers.length,
    pendingServiceRequests: serviceRequests.filter(
      (req) => req.status === "pending", // Only truly pending, not reviewed
    ).length,
    pendingInvoices: invoices.filter(
      (inv) => inv.status === "pending" || inv.status === "open",
    ).length,
    monthlyRevenue: invoices
      .filter((inv) => {
        // Only count paid invoices from the current month
        if (inv.status !== "paid") return false;

        const invoiceDate = new Date(inv.issueDate);
        const now = new Date();
        return (
          invoiceDate.getMonth() === now.getMonth() &&
          invoiceDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, inv) => sum + inv.total, 0),
  };

  const formatCurrency = (amount: number) => {
    // Convert from cents to dollars
    const dollars = amount / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(dollars);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" };
      case "pending":
        return { bg: "#fef3c7", text: "#92400e", border: "#fde68a" };
      case "open":
        return { bg: "#dbeafe", text: "#1e40af", border: "#93c5fd" };
      case "draft":
        return { bg: "#f3f4f6", text: "#374151", border: "#d1d5db" };
      case "void":
        return { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" };
      default:
        return { bg: "#f3f4f6", text: "#374151", border: "#d1d5db" };
    }
  };

  const exportCustomerList = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Address", "City", "State", "ZIP"],
      ...customers.map((customer) => [
        customer.name,
        customer.email || "",
        customer.phone || "",
        customer.addressLine1 || "",
        customer.city || "",
        customer.state || "",
        customer.postalCode || "",
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "customer-list.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportInvoiceList = () => {
    const csvContent = [
      ["Invoice #", "Customer", "Issue Date", "Total", "Status"],
      ...invoices.map((invoice, index) => [
        `Invoice #${index + 1}`,
        invoice.customerName,
        invoice.issueDate,
        formatCurrency(invoice.total),
        invoice.status,
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "invoice-list.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <div className="text-lg text-gray-600 font-medium">
              Loading dashboard...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Welcome back, Admin
          </h1>
          <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
            Here&apos;s what&apos;s happening with your business today
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Link
            href="/admin/customers"
            className="block no-underline"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 text-center cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="text-3xl lg:text-4xl font-bold text-indigo-600 mb-2">
                {stats.totalCustomers}
              </div>
              <div className="text-gray-600 text-sm lg:text-base font-medium uppercase tracking-wide">
                Total Customers
              </div>
            </div>
          </Link>

          <Link
            href="/admin/invoices"
            className="block no-underline"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 text-center cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="text-3xl lg:text-4xl font-bold text-indigo-600 mb-2">
                {stats.pendingInvoices}
              </div>
              <div className="text-gray-600 text-sm lg:text-base font-medium uppercase tracking-wide">
                Pending Invoices
              </div>
            </div>
          </Link>

          <Link
            href="/admin/service-requests"
            className="block no-underline"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 text-center cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="text-3xl lg:text-4xl font-bold text-indigo-600 mb-2">
                {stats.pendingServiceRequests}
              </div>
              <div className="text-gray-600 text-sm lg:text-base font-medium uppercase tracking-wide">
                Pending Requests
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 text-center">
            <div className="text-3xl lg:text-4xl font-bold text-indigo-600 mb-2">
              {formatCurrency(stats.monthlyRevenue)}
            </div>
            <div className="text-gray-600 text-sm lg:text-base font-medium uppercase tracking-wide">
              Monthly Revenue
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">
            Export Data
          </h2>
          <p className="text-gray-600 mb-6 text-sm lg:text-base">
            Download your customer and invoice data for record keeping or analysis
          </p>
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <button
              onClick={exportCustomerList}
              className="px-4 lg:px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-lg text-sm lg:text-base font-medium cursor-pointer transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto"
            >
              📊 Export Customer List (CSV)
            </button>
            <button
              onClick={exportInvoiceList}
              className="px-4 lg:px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-lg text-sm lg:text-base font-medium cursor-pointer transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto"
            >
              📄 Export Invoice List (CSV)
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Recent Invoices */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 lg:p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
                  Recent Invoices
                </h2>
                <Link
                  href="/admin/invoices"
                  className="text-indigo-600 hover:text-indigo-700 text-sm lg:text-base font-medium transition-colors"
                >
                  View All →
                </Link>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {invoices.slice(0, 4).map((invoice, index) => (
                <div
                  key={invoice.id}
                  className="p-4 lg:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                  <div className="flex-1">
                    <div className="text-sm lg:text-base font-medium text-gray-900 mb-1">
                      {invoice.customerName}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-500">
                      Invoice #{index + 1}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-sm lg:text-base font-semibold text-gray-900">
                      {formatCurrency(invoice.total)}
                    </div>
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: getStatusColor(invoice.status).bg,
                        color: getStatusColor(invoice.status).text,
                        border: `1px solid ${getStatusColor(invoice.status).border}`,
                      }}
                    >
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4 text-center lg:text-left">
              Quick Actions
            </h3>

            <div className="space-y-3 lg:space-y-4">
              <Link
                href="/admin/invoices/new"
                className="block p-3 lg:p-4 bg-indigo-600 hover:bg-indigo-700 text-white text-center rounded-lg text-sm lg:text-base font-medium transition-all duration-200 hover:-translate-y-0.5"
              >
                Create Invoice
              </Link>

              <Link
                href="/admin/customers/new"
                className="block p-3 lg:p-4 bg-transparent hover:bg-indigo-600 text-indigo-600 hover:text-white text-center rounded-lg text-sm lg:text-base font-medium border border-indigo-600 transition-all duration-200 hover:-translate-y-0.5"
              >
                Add Customer
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
