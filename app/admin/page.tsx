"use client";
import Link from "next/link";

import { useState, useEffect } from "react";
import { safeJson } from "@/lib/utils";

interface DashboardStats {
  totalCustomers: number;
  pendingInvoices: number;
  pendingRequests: number;
  monthlyRevenue: number;
}

interface RecentInvoice {
  id: string;
  customerName: string;
  total: string;
  status: string;
  createdAt: string;
  invoiceNumber: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    pendingInvoices: 0,
    pendingRequests: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentInvoices, setRecentInvoices] = useState<RecentInvoice[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch customers count
        const customersResponse = await fetch("/api/customers");
        const customersData = await safeJson(customersResponse);
        const totalCustomers = Array.isArray(customersData)
          ? customersData.length
          : 0;

        // Fetch invoices count
        const invoicesResponse = await fetch("/api/invoices/list");
        const invoicesData = await safeJson(invoicesResponse);
        const invoices = Array.isArray(invoicesData) ? invoicesData : [];
        const pendingInvoices = invoices.filter(
          (invoice: any) =>
            invoice.status === "draft" ||
            invoice.status === "sent" ||
            invoice.status === "partial_paid",
        ).length;

        // Fetch service requests count
        const requestsResponse = await fetch("/api/service-requests");
        const requestsData = await safeJson(requestsResponse);
        const requests = Array.isArray(requestsData) ? requestsData : [];
        const pendingRequests = requests.filter(
          (request: any) =>
            request.status !== "handled" && request.status !== "completed",
        ).length;

        // Calculate monthly revenue (from paid invoices)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyRevenue = invoices
          .filter((invoice: any) => {
            if (invoice.status !== "paid") return false;
            const invoiceDate = new Date(
              invoice.createdAt || invoice.issueDate,
            );
            return (
              invoiceDate.getMonth() === currentMonth &&
              invoiceDate.getFullYear() === currentYear
            );
          })
          .reduce(
            (sum: number, invoice: any) => sum + Number(invoice.total || 0),
            0,
          );

        // Get recent invoices (last 5, sorted by creation date)
        const recentInvoicesData = invoices
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 5)
          .map((invoice: any) => ({
            id: invoice.id,
            customerName: invoice.customerName,
            total: invoice.total,
            status: invoice.status,
            createdAt: invoice.createdAt,
            invoiceNumber: invoice.invoiceNumber,
          }));

        setStats({
          totalCustomers,
          pendingInvoices,
          pendingRequests,
          monthlyRevenue: monthlyRevenue, // Already in dollars
        });
        setRecentInvoices(recentInvoicesData);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <div className="text-lg text-gray-800 font-medium">
              Loading dashboard...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Here&apos;s what&apos;s happening with your business today
          </p>
        </div>

        {/* Stats */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            {
              label: "Total Customers",
              value: stats.totalCustomers.toString(),
              color: "bg-blue-500",
            },
            {
              label: "Pending Invoices",
              value: stats.pendingInvoices.toString(),
              color: "bg-yellow-500",
            },
            {
              label: "Pending Requests",
              value: stats.pendingRequests.toString(),
              color: "bg-orange-500",
            },
            {
              label: "Monthly Revenue",
              value: `$${stats.monthlyRevenue.toFixed(2)}`,
              color: "bg-green-500",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${s.color} mr-3`}></div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {s.value}
                  </div>
                  <div className="text-sm text-gray-600">{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Export */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Export Data
          </h3>
          <p className="text-gray-600 mb-4">
            Download your customer and invoice data for record keeping or
            analysis
          </p>
          <div className="flex gap-3">
            <a
              href="/api/export/customers"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Export Customer List (CSV)
            </a>
            <a
              href="/api/export/invoices"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Export Invoice List (CSV)
            </a>
          </div>
        </section>

        {/* Recent Invoices / Quick Actions */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Recent Invoices
            </h3>
            {recentInvoices.length === 0 ? (
              <p className="text-gray-600 mb-4">No invoices yet.</p>
            ) : (
              <div className="space-y-3 mb-4">
                {recentInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {invoice.customerName}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            invoice.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : invoice.status === "sent"
                                ? "bg-orange-100 text-orange-800"
                                : invoice.status === "open"
                                  ? "bg-blue-100 text-blue-800"
                                  : invoice.status === "draft"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-red-100 text-red-800"
                          }`}
                        >
                          {invoice.status === "sent"
                            ? "Sent"
                            : invoice.status === "open"
                              ? "Open"
                              : invoice.status === "draft"
                                ? "Draft"
                                : invoice.status === "paid"
                                  ? "Paid"
                                  : "Void"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {invoice.invoiceNumber} • $
                        {Number(invoice.total).toFixed(2)}
                      </div>
                    </div>
                    <Link
                      href={`/admin/invoices/${invoice.id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
            <Link
              href="/admin/invoices"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              View All Invoices
            </Link>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/admin/invoices/new"
                className="inline-flex items-center justify-center px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Create Invoice
              </Link>
              <Link
                href="/admin/customers/new"
                className="inline-flex items-center justify-center px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Add Customer
              </Link>
              <Link
                href="/admin/invoices"
                className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                View Invoices
              </Link>
              <Link
                href="/admin/customers"
                className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                View Customers
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
