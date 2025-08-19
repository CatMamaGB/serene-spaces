'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav style={{
      backgroundColor: 'white',
      padding: '16px 24px',
      borderBottom: '1px solid #e5e7eb',
      marginBottom: '0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Brand Logo */}
        <Link
          href="/"
          style={{
            color: '#7a6990',
            textDecoration: 'none',
            fontSize: '1.75rem',
            fontWeight: '800',
            letterSpacing: '-0.025em'
          }}
          onClick={closeMenu}
        >
          Serene Spaces
        </Link>
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <div style={{ 
            display: 'flex', 
            gap: '8px',
            alignItems: 'center'
          }}>
            <Link
              href="/"
              style={{
                color: '#374151',
                textDecoration: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                border: '1px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.color = '#7a6990';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#374151';
              }}
            >
              Home
            </Link>
            

            
            <Link
              href="/about"
              style={{
                color: '#374151',
                textDecoration: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                border: '1px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.color = '#7a6990';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#374151';
              }}
            >
              About Us
            </Link>
            <Link
              href="/pricing"
              style={{
                color: '#374151',
                textDecoration: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                border: '1px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.color = '#7a6990';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#374151';
              }}
            >
              Pricing
            </Link>
            <Link
              href="/intake"
              style={{
                color: '#374151',
                textDecoration: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                border: '1px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.color = '#7a6990';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#374151';
              }}
            >
              Book a Pickup
            </Link>
            <Link
              href="/contact"
              style={{
                color: '#374151',
                textDecoration: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                border: '1px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.color = '#7a6990';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#374151';
              }}
            >
              Contact
            </Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={toggleMenu}
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
            aria-label="Toggle menu"
          >
            <span style={{
              width: '30px',
              height: '3px',
              backgroundColor: isMenuOpen ? '#7a6990' : '#374151',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
            }} />
            <span style={{
              width: '30px',
              height: '3px',
              backgroundColor: isMenuOpen ? 'transparent' : '#374151',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              opacity: isMenuOpen ? 0 : 1
            }} />
            <span style={{
              width: '30px',
              height: '3px',
              backgroundColor: isMenuOpen ? '#7a6990' : '#374151',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              transform: isMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'
            }} />
          </button>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && isMobile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999
        }} onClick={closeMenu}>
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
                href="/"
                style={{
                  color: '#374151',
                  textDecoration: 'none',
                  padding: '16px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  fontSize: '1.1rem',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.2s ease'
                }}
                onClick={closeMenu}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#7a6990';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                Home
              </Link>
              

              
              <Link
                href="/about"
                style={{
                  color: '#374151',
                  textDecoration: 'none',
                  padding: '16px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  fontSize: '1.1rem',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.2s ease'
                }}
                onClick={closeMenu}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#7a6990';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                About Us
              </Link>
              <Link
                href="/pricing"
                style={{
                  color: '#374151',
                  textDecoration: 'none',
                  padding: '16px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  fontSize: '1.1rem',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.2s ease'
                }}
                onClick={closeMenu}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#7a6990';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                Pricing
              </Link>
              <Link
                href="/intake"
                style={{
                  color: '#374151',
                  textDecoration: 'none',
                  padding: '16px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  fontSize: '1.1rem',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.2s ease'
                }}
                onClick={closeMenu}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#7a6990';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                Book a Pickup
              </Link>
              <Link
                href="/contact"
                style={{
                  color: '#374151',
                  textDecoration: 'none',
                  padding: '16px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  fontSize: '1.1rem',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.2s ease'
                }}
                onClick={closeMenu}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#7a6990';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
