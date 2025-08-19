'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Admin Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: isMobile ? '1rem' : '1rem 2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '1rem' : '2rem',
            flex: isMobile ? '1' : 'auto'
          }}>
            <Link
              href="/admin"
              style={{
                color: '#7a6990',
                textDecoration: 'none',
                fontSize: isMobile ? '1.25rem' : '1.5rem',
                fontWeight: '700',
                letterSpacing: '-0.025em'
              }}
            >
              {isMobile ? 'Admin' : 'Serene Spaces Admin'}
            </Link>
            
            {/* Desktop Admin Navigation */}
            {!isMobile && (
              <nav style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                <Link
                  href="/admin"
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    backgroundColor: isActive('/admin') && !pathname.includes('/admin/') ? '#7a6990' : 'transparent',
                    color: isActive('/admin') && !pathname.includes('/admin/') ? 'white' : '#6b7280',
                    border: isActive('/admin') && !pathname.includes('/admin/') ? 'none' : '1px solid transparent'
                  }}
                >
                  Dashboard
                </Link>
                
                <Link
                  href="/admin/customers"
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    backgroundColor: isActive('/admin/customers') ? '#7a6990' : 'transparent',
                    color: isActive('/admin/customers') ? 'white' : '#6b7280',
                    border: isActive('/admin/customers') ? 'none' : '1px solid transparent'
                  }}
                >
                  Customers
                </Link>
                
                <Link
                  href="/admin/invoices"
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    backgroundColor: isActive('/admin/invoices') ? '#7a6990' : 'transparent',
                    color: isActive('/admin/invoices') ? 'white' : '#6b7280',
                    border: isActive('/admin/invoices') ? 'none' : '1px solid transparent'
                  }}
                >
                  Invoices
                </Link>
              </nav>
            )}
          </div>
          
          {/* Right side actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            {!isMobile && (
              <Link
                href="/"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  color: '#7a6990',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: '1px solid #7a6990',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#7a6990';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#7a6990';
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
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  width: '30px',
                  height: '30px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  zIndex: 1001
                }}
                aria-label="Toggle mobile menu"
              >
                <span style={{
                  width: '30px',
                  height: '3px',
                  backgroundColor: isMobileMenuOpen ? '#7a6990' : '#374151',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease',
                  transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
                }} />
                <span style={{
                  width: '30px',
                  height: '3px',
                  backgroundColor: isMobileMenuOpen ? 'transparent' : '#374151',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease',
                  opacity: isMobileMenuOpen ? 0 : 1
                }} />
                <span style={{
                  width: '30px',
                  height: '3px',
                  backgroundColor: isMobileMenuOpen ? '#7a6990' : '#374151',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease',
                  transform: isMobileMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'
                }} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobile && isMobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999
        }} onClick={closeMobileMenu}>
          <div style={{
            position: 'absolute',
            top: '80px',
            left: '0',
            right: '0',
            backgroundColor: 'white',
            padding: '24px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            borderTop: '1px solid #e5e7eb'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <Link
                href="/admin"
                style={{
                  color: '#374151',
                  textDecoration: 'none',
                  padding: '16px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  fontSize: '1.1rem',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.2s ease',
                  backgroundColor: isActive('/admin') && !pathname.includes('/admin/') ? '#7a6990' : 'transparent',
                  color: isActive('/admin') && !pathname.includes('/admin/') ? 'white' : '#6b7280'
                }}
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
              
              <Link
                href="/admin/customers"
                style={{
                  color: '#374151',
                  textDecoration: 'none',
                  padding: '16px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  fontSize: '1.1rem',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.2s ease',
                  backgroundColor: isActive('/admin/customers') ? '#7a6990' : 'transparent',
                  color: isActive('/admin/customers') ? 'white' : '#6b7280'
                }}
                onClick={closeMobileMenu}
              >
                Customers
              </Link>
              
              <Link
                href="/admin/invoices"
                style={{
                  color: '#374151',
                  textDecoration: 'none',
                  padding: '16px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  fontSize: '1.1rem',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.2s ease',
                  backgroundColor: isActive('/admin/invoices') ? '#7a6990' : 'transparent',
                  color: isActive('/admin/invoices') ? 'white' : '#6b7280'
                }}
                onClick={closeMobileMenu}
              >
                Invoices
              </Link>
              
              <Link
                href="/"
                style={{
                  color: '#7a6990',
                  textDecoration: 'none',
                  padding: '16px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  fontSize: '1.1rem',
                  border: '1px solid #7a6990',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
                onClick={closeMobileMenu}
              >
                View Site
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main style={{ 
        padding: isMobile ? '1rem' : '2rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {children}
      </main>
    </div>
  );
}
