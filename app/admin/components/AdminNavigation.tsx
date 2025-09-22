"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useState } from "react";
import { usePendingCount } from "@/hooks/usePendingCount";
import { PendingBadge } from "@/components/PendingBadge";

const NavItem = ({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    className="block rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-100 transition-colors min-h-[44px] flex items-center"
    onClick={onClick}
  >
    {label}
  </Link>
);

export default function AdminNavigation({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pendingCount } = usePendingCount();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-gray-200 bg-white">
          <div className="p-4">
            <h1 className="text-xl font-semibold">Serene Spaces Admin</h1>
          </div>
          <nav className="px-2 space-y-1">
            <NavItem href="/admin" label="Dashboard" />
            <NavItem href="/admin/customers" label="Customers" />
            <NavItem href="/admin/invoices" label="Invoices" />
            <div className="flex items-center justify-between">
              <NavItem href="/admin/service-requests" label="Service Requests" />
              {pendingCount > 0 && <PendingBadge count={pendingCount} />}
            </div>
            <NavItem href="/admin/pricing" label="Pricing" />
          </nav>
        </aside>

        {/* Main */}
        <div className="flex-1">
          {/* Topbar */}
          <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
            <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
              <div className="lg:hidden flex items-center gap-3">
                <button
                  onClick={toggleMobileMenu}
                  className="p-3 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Toggle menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <span className="text-base font-medium text-gray-700">Admin</span>
              </div>
              <div className="hidden lg:block font-medium">
                Welcome, Serene Spaces Admin
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/"
                  className="text-sm sm:text-base font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 min-h-[40px] flex items-center"
                >
                  View Site
                </Link>
                <form action="/api/auth/signout" method="post">
                  <button
                    className="rounded-lg border px-3 sm:px-4 py-2 text-sm sm:text-base hover:bg-gray-50 transition-colors min-h-[40px] flex items-center justify-center"
                    type="submit"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          </header>

          {/* Mobile Sidebar Overlay */}
          {isMobileMenuOpen && (
            <div className="lg:hidden">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-30"
                onClick={closeMobileMenu}
              />

              {/* Mobile Sidebar */}
              <aside className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-40">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">
                      Serene Spaces Admin
                    </h1>
                    <button
                      onClick={closeMobileMenu}
                      className="p-3 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Close menu"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <nav className="px-3 py-4 space-y-2">
                  <NavItem
                    href="/admin"
                    label="Dashboard"
                    onClick={closeMobileMenu}
                  />
                  <NavItem
                    href="/admin/customers"
                    label="Customers"
                    onClick={closeMobileMenu}
                  />
                  <NavItem
                    href="/admin/invoices"
                    label="Invoices"
                    onClick={closeMobileMenu}
                  />
                  <NavItem
                    href="/admin/service-requests"
                    label="Service Requests"
                    onClick={closeMobileMenu}
                  />
                  {pendingCount > 0 && <PendingBadge count={pendingCount} isMobile onClose={closeMobileMenu} />}
                  <NavItem
                    href="/admin/pricing"
                    label="Pricing"
                    onClick={closeMobileMenu}
                  />
                </nav>
              </aside>
            </div>
          )}

          <main className="mx-auto max-w-7xl px-4 py-4 sm:py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
