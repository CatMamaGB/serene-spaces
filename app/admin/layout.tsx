"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

interface ServiceRequest {
  id: string;
  status: string;
  customer: {
    name: string;
  };
  services: string[];
  createdAt: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Fetch pending service requests
    const fetchPendingRequests = async () => {
      try {
        const response = await fetch("/api/service-requests");
        if (response.ok) {
          const data = await response.json();
          const pending = data.filter(
            (req: ServiceRequest) => req.status === "pending",
          );
          setPendingCount(pending.length);
        } else {
          console.warn(
            "Service requests API returned non-OK status:",
            response.status,
          );
          setPendingCount(0);
        }
      } catch (error) {
        console.error("Error fetching pending requests:", error);
        // Set pending count to 0 on error to avoid UI issues
        setPendingCount(0);
      }
    };

    fetchPendingRequests();
    // Refresh every 5 minutes
    const interval = setInterval(fetchPendingRequests, 5 * 60 * 1000);

    return () => {
      window.removeEventListener("resize", checkMobile);
      clearInterval(interval);
    };
  }, []);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-xl text-indigo-600 font-medium mb-2">
            Loading...
          </div>
          <div className="text-base text-gray-600">
            Checking authentication...
          </div>
        </div>
      </div>
    );
  }

  // REQUIRE AUTHENTICATION - NO BYPASS ALLOWED
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-white shadow-lg">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Authentication Required
            </h2>
            <p className="mt-2 text-center text-lg text-gray-600">
              Admin Access
            </p>
            <p className="mt-1 text-center text-sm text-gray-500">
              You must be signed in with Google to access the admin panel
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <a
              href="/auth/signin"
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </span>
              Continue with Google
            </a>

            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated, show admin interface
  const user = session?.user;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 lg:space-x-8 flex-1 lg:flex-none">
              <Link
                href="/admin"
                className="text-indigo-600 hover:text-indigo-700 text-xl lg:text-2xl font-bold tracking-tight"
              >
                {isMobile ? "Admin" : "Serene Spaces Admin"}
              </Link>

              {/* Pending Requests Display */}
              {!isMobile && pendingCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <span className="text-sm font-semibold text-amber-800">
                    {pendingCount} Pending Request{pendingCount !== 1 ? "s" : ""}
                  </span>
                  <Link
                    href="/admin/service-requests"
                    className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded transition-colors"
                  >
                    View
                  </Link>
                </div>
              )}

              {/* Desktop Admin Navigation */}
              {!isMobile && (
                <nav className="flex space-x-1">
                  <Link
                    href="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/admin") && !pathname.includes("/admin/")
                        ? "bg-indigo-600 text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/admin/customers"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/admin/customers")
                        ? "bg-indigo-600 text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    Customers
                  </Link>

                  <Link
                    href="/admin/invoices"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/admin/invoices")
                        ? "bg-indigo-600 text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    Invoices
                  </Link>

                  <Link
                    href="/admin/service-requests"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/admin/service-requests")
                        ? "bg-indigo-600 text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    Service Requests
                  </Link>
                </nav>
              )}
          </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* User Info */}
              {user && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    Welcome, {user.name}
                  </span>
                  {status === "authenticated" ? (
                    <button
                      onClick={() => signOut()}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md transition-colors"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-md">
                      Bypass Mode
                    </span>
                  )}
                </div>
              )}

              {!isMobile && (
                <Link
                  href="/"
                  className="px-3 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white text-sm font-medium rounded-md transition-colors"
                >
                  View Site
                </Link>
              )}

              {/* Mobile Menu Button */}
              {isMobile && (
                <button
                  onClick={toggleMobileMenu}
                  className="flex flex-col justify-around w-8 h-8 bg-transparent border-none cursor-pointer p-0 z-50"
                  aria-label="Toggle mobile menu"
                >
                  <span
                    className={`w-8 h-0.5 rounded-sm transition-all duration-300 ${
                      isMobileMenuOpen
                        ? "bg-indigo-600 rotate-45 translate-y-1"
                        : "bg-gray-700"
                    }`}
                  />
                  <span
                    className={`w-8 h-0.5 rounded-sm transition-all duration-300 ${
                      isMobileMenuOpen ? "opacity-0" : "bg-gray-700"
                    }`}
                  />
                  <span
                    className={`w-8 h-0.5 rounded-sm transition-all duration-300 ${
                      isMobileMenuOpen
                        ? "bg-indigo-600 -rotate-45 -translate-y-1"
                        : "bg-gray-700"
                    }`}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        >
          <div
            className="absolute top-16 left-0 right-0 bg-white p-6 shadow-xl border-t border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pending Requests for Mobile */}
            {pendingCount > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4 text-center">
                <div className="text-base font-semibold text-amber-800 mb-2">
                  {pendingCount} Pending Request{pendingCount !== 1 ? "s" : ""}
                </div>
                <Link
                  href="/admin/service-requests"
                  className="inline-block px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-md transition-colors"
                >
                  View All
                </Link>
              </div>
            )}

            <div className="flex flex-col space-y-4">
              <Link
                href="/admin"
                className={`p-4 rounded-lg font-medium text-lg border transition-colors ${
                  isActive("/admin") && !pathname.includes("/admin/")
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>

              <Link
                href="/admin/customers"
                className={`p-4 rounded-lg font-medium text-lg border transition-colors ${
                  isActive("/admin/customers")
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
                onClick={closeMobileMenu}
              >
                Customers
              </Link>

              <Link
                href="/admin/invoices"
                className={`p-4 rounded-lg font-medium text-lg border transition-colors ${
                  isActive("/admin/invoices")
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
                onClick={closeMobileMenu}
              >
                Invoices
              </Link>

              <Link
                href="/admin/service-requests"
                className={`p-4 rounded-lg font-medium text-lg border transition-colors ${
                  isActive("/admin/service-requests")
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
                onClick={closeMobileMenu}
              >
                Service Requests
              </Link>

              <Link
                href="/"
                className="p-4 rounded-lg font-medium text-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors text-center"
                onClick={closeMobileMenu}
              >
                View Site
              </Link>

              {/* Sign Out for Mobile */}
              {status === "authenticated" ? (
                <button
                  onClick={() => signOut()}
                  className="p-4 bg-red-500 hover:bg-red-600 text-white border-none rounded-lg font-medium text-lg cursor-pointer transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <div className="p-4 bg-green-500 text-white rounded-lg font-medium text-lg text-center">
                  Bypass Mode Active
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
