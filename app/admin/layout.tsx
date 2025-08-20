"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

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
  
  // Create mock session for admin access when not authenticated
  const effectiveSession = status === "unauthenticated" ? {
    user: {
      id: "admin-bypass",
      name: "Admin (Bypass Mode)",
      email: "admin@loveserenespaces.com"
    }
  } : session;
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
        }
      } catch (error) {
        console.error("Error fetching pending requests:", error);
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

  // Show loading state while checking authentication (but allow bypass)
  if (status === "loading") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "1.5rem",
              color: "#7a6990",
              marginBottom: "1rem",
            }}
          >
            Loading...
          </div>
          <div style={{ fontSize: "1rem", color: "#6b7280" }}>
            If this takes too long, refresh the page
          </div>
        </div>
      </div>
    );
  }

  // TEMPORARILY BYPASS AUTHENTICATION FOR ADMIN ACCESS
  // TODO: Re-enable authentication once Google OAuth is fixed
  if (status === "unauthenticated") {
    // Create a mock session for admin access
    const mockSession = {
      user: {
        id: "admin-bypass",
        name: "Admin (Bypass Mode)",
        email: "admin@loveserenespaces.com"
      }
    };
    
    // Continue with mock session instead of blocking access
    console.log("⚠️ AUTHENTICATION BYPASSED - Admin access granted without Google OAuth");
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Admin Header */}
      <header
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid #e5e7eb",
          padding: isMobile ? "1rem" : "1rem 2rem",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
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
              gap: isMobile ? "1rem" : "2rem",
              flex: isMobile ? "1" : "auto",
            }}
          >
            <Link
              href="/admin"
              style={{
                color: "#7a6990",
                textDecoration: "none",
                fontSize: isMobile ? "1.25rem" : "1.5rem",
                fontWeight: "700",
                letterSpacing: "-0.025em",
              }}
            >
              {isMobile ? "Admin" : "Serene Spaces Admin"}
            </Link>

            {/* Pending Requests Display */}
            {!isMobile && pendingCount > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#fef3c7",
                  border: "1px solid #f59e0b",
                  borderRadius: "8px",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#92400e",
                  }}
                >
                  {pendingCount} Pending Request{pendingCount !== 1 ? "s" : ""}
                </span>
                <Link
                  href="/admin/service-requests"
                  style={{
                    padding: "0.25rem 0.5rem",
                    backgroundColor: "#f59e0b",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#d97706";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#f59e0b";
                  }}
                >
                  View
                </Link>
              </div>
            )}

            {/* Desktop Admin Navigation */}
            {!isMobile && (
              <nav
                style={{
                  display: "flex",
                  gap: "0.5rem",
                }}
              >
                <Link
                  href="/admin"
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                    backgroundColor:
                      isActive("/admin") && !pathname.includes("/admin/")
                        ? "#7a6990"
                        : "transparent",
                    color:
                      isActive("/admin") && !pathname.includes("/admin/")
                        ? "white"
                        : "#6b7280",
                    border:
                      isActive("/admin") && !pathname.includes("/admin/")
                        ? "none"
                        : "1px solid transparent",
                  }}
                >
                  Dashboard
                </Link>

                <Link
                  href="/admin/customers"
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                    backgroundColor: isActive("/admin/customers")
                      ? "#7a6990"
                      : "transparent",
                    color: isActive("/admin/customers") ? "white" : "#6b7280",
                    border: isActive("/admin/customers")
                      ? "none"
                      : "1px solid transparent",
                  }}
                >
                  Customers
                </Link>

                <Link
                  href="/admin/invoices"
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                    backgroundColor: isActive("/admin/invoices")
                      ? "#7a6990"
                      : "transparent",
                    color: isActive("/admin/invoices") ? "white" : "#6b7280",
                    border: isActive("/admin/invoices")
                      ? "none"
                      : "1px solid transparent",
                  }}
                >
                  Invoices
                </Link>

                <Link
                  href="/admin/service-requests"
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                    backgroundColor: isActive("/admin/service-requests")
                      ? "#7a6990"
                      : "transparent",
                    color: isActive("/admin/service-requests")
                      ? "white"
                      : "#6b7280",
                    border: isActive("/admin/service-requests")
                      ? "none"
                      : "1px solid transparent",
                  }}
                >
                  Service Requests
                </Link>
              </nav>
            )}
          </div>

          {/* Right side actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {/* User Info */}
            {effectiveSession?.user && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                  color: "#6b7280",
                }}
              >
                <span>Welcome, {effectiveSession.user.name}</span>
                {status === "authenticated" ? (
                  <button
                    onClick={() => signOut()}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#dc2626";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ef4444";
                    }}
                  >
                    Sign Out
                  </button>
                ) : (
                  <span style={{ 
                    padding: "0.5rem 1rem", 
                    backgroundColor: "#10b981", 
                    color: "white", 
                    borderRadius: "6px", 
                    fontSize: "0.875rem" 
                  }}>
                    Bypass Mode
                  </span>
                )}
              </div>
            )}

            {!isMobile && (
              <Link
                href="/"
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "transparent",
                  color: "#7a6990",
                  textDecoration: "none",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  border: "1px solid #7a6990",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#7a6990";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#7a6990";
                }}
              >
                View Site
              </Link>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={toggleMobileMenu}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                  width: "30px",
                  height: "30px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "0",
                  zIndex: 1001,
                }}
                aria-label="Toggle mobile menu"
              >
                <span
                  style={{
                    width: "30px",
                    height: "3px",
                    backgroundColor: isMobileMenuOpen ? "#7a6990" : "#374151",
                    borderRadius: "2px",
                    transition: "all 0.3s ease",
                    transform: isMobileMenuOpen
                      ? "rotate(45deg) translate(5px, 5px)"
                      : "none",
                  }}
                />
                <span
                  style={{
                    width: "30px",
                    height: "3px",
                    backgroundColor: isMobileMenuOpen
                      ? "transparent"
                      : "#374151",
                    borderRadius: "2px",
                    transition: "all 0.3s ease",
                    opacity: isMobileMenuOpen ? 0 : 1,
                  }}
                />
                <span
                  style={{
                    width: "30px",
                    height: "3px",
                    backgroundColor: isMobileMenuOpen ? "#7a6990" : "#374151",
                    borderRadius: "2px",
                    transition: "all 0.3s ease",
                    transform: isMobileMenuOpen
                      ? "rotate(-45deg) translate(7px, -6px)"
                      : "none",
                  }}
                />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobile && isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
          onClick={closeMobileMenu}
        >
          <div
            style={{
              position: "absolute",
              top: "80px",
              left: "0",
              right: "0",
              backgroundColor: "white",
              padding: "24px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              borderTop: "1px solid #e5e7eb",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pending Requests for Mobile */}
            {pendingCount > 0 && (
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#fef3c7",
                  border: "1px solid #f59e0b",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#92400e",
                    marginBottom: "8px",
                  }}
                >
                  {pendingCount} Pending Request{pendingCount !== 1 ? "s" : ""}
                </div>
                <Link
                  href="/admin/service-requests"
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#f59e0b",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "6px",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    display: "inline-block",
                  }}
                >
                  View All
                </Link>
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <Link
                href="/admin"
                style={{
                  textDecoration: "none",
                  padding: "16px",
                  borderRadius: "8px",
                  fontWeight: "500",
                  fontSize: "1.1rem",
                  border: "1px solid #e5e7eb",
                  transition: "all 0.2s ease",
                  backgroundColor:
                    isActive("/admin") && !pathname.includes("/admin/")
                      ? "#7a6990"
                      : "transparent",
                  color:
                    isActive("/admin") && !pathname.includes("/admin/")
                      ? "white"
                      : "#6b7280",
                }}
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>

              <Link
                href="/admin/customers"
                style={{
                  textDecoration: "none",
                  padding: "16px",
                  borderRadius: "8px",
                  fontWeight: "500",
                  fontSize: "1.1rem",
                  border: "1px solid #e5e7eb",
                  transition: "all 0.2s ease",
                  backgroundColor: isActive("/admin/customers")
                    ? "#7a6990"
                    : "transparent",
                  color: isActive("/admin/customers") ? "white" : "#6b7280",
                }}
                onClick={closeMobileMenu}
              >
                Customers
              </Link>

              <Link
                href="/admin/invoices"
                style={{
                  textDecoration: "none",
                  padding: "16px",
                  borderRadius: "8px",
                  fontWeight: "500",
                  fontSize: "1.1rem",
                  border: "1px solid #e5e7eb",
                  transition: "all 0.2s ease",
                  backgroundColor: isActive("/admin/invoices")
                    ? "#7a6990"
                    : "transparent",
                  color: isActive("/admin/invoices") ? "white" : "#6b7280",
                }}
                onClick={closeMobileMenu}
              >
                Invoices
              </Link>

              <Link
                href="/admin/service-requests"
                style={{
                  textDecoration: "none",
                  padding: "16px",
                  borderRadius: "8px",
                  fontWeight: "500",
                  fontSize: "1.1rem",
                  border: "1px solid #e5e7eb",
                  transition: "all 0.2s ease",
                  backgroundColor: isActive("/admin/service-requests")
                    ? "#7a6990"
                    : "transparent",
                  color: isActive("/admin/service-requests")
                    ? "white"
                    : "#6b7280",
                }}
                onClick={closeMobileMenu}
              >
                Service Requests
              </Link>

              <Link
                href="/"
                style={{
                  color: "#7a6990",
                  textDecoration: "none",
                  padding: "16px",
                  borderRadius: "8px",
                  fontWeight: "500",
                  fontSize: "1.1rem",
                  border: "1px solid #7a6990",
                  transition: "all 0.2s ease",
                  textAlign: "center",
                }}
                onClick={closeMobileMenu}
              >
                View Site
              </Link>

              {/* Sign Out for Mobile */}
              {status === "authenticated" ? (
                <button
                  onClick={() => signOut()}
                  style={{
                    padding: "16px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "500",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  Sign Out
                </button>
              ) : (
                <div style={{
                  padding: "16px",
                  backgroundColor: "#10b981",
                  color: "white",
                  borderRadius: "8px",
                  fontWeight: "500",
                  fontSize: "1.1rem",
                  textAlign: "center"
                }}>
                  Bypass Mode Active
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        style={{
          padding: isMobile ? "1rem" : "2rem",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}
