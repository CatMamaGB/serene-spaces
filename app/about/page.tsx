'use client';

import { useState, useEffect } from 'react';

export default function AboutPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #2e2434 0%, #5f4b6a 100%)',
        color: 'white',
        padding: isMobile ? '60px 20px' : '80px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: isMobile ? '2.5rem' : '3.5rem',
            marginBottom: isMobile ? '20px' : '24px',
            fontWeight: '700',
            lineHeight: isMobile ? '1.2' : '1.1'
          }}>
            About Serene Spaces
          </h1>
          <p style={{
            fontSize: isMobile ? '1.1rem' : '1.3rem',
            marginBottom: isMobile ? '30px' : '40px',
            opacity: '0.9',
            lineHeight: '1.6'
          }}>
            Dedicated to preserving and protecting your horse&apos;s most essential equipment
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section style={{
        padding: isMobile ? '60px 20px' : '80px 24px',
        backgroundColor: 'white'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '40px' : '60px',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{
                fontSize: isMobile ? '2rem' : '2.5rem',
                marginBottom: isMobile ? '20px' : '30px',
                color: '#1a1a1a',
                textAlign: isMobile ? 'center' : 'left'
              }}>
                Our Story
              </h2>
              <p style={{
                fontSize: isMobile ? '1rem' : '1.1rem',
                color: '#666',
                lineHeight: '1.8',
                marginBottom: '24px',
                textAlign: isMobile ? 'center' : 'left'
              }}>
                Serene Spaces was born from a deep love for horses and a recognition that quality equestrian equipment deserves professional care. What started as a small operation serving local barns in Crystal Lake has grown into a trusted service provider throughout the greater Chicago area.
              </p>
              <p style={{
                fontSize: isMobile ? '1rem' : '1.1rem',
                color: '#666',
                lineHeight: '1.8',
                marginBottom: '24px',
                textAlign: isMobile ? 'center' : 'left'
              }}>
                We understand that your horse&apos;s blankets, sheets, and equipment are investments that protect your equine partner from the elements. That&apos;s why we treat every piece with the same care and attention we&apos;d give our own horses&apos; gear.
              </p>
              <p style={{
                fontSize: isMobile ? '1rem' : '1.1rem',
                color: '#666',
                lineHeight: '1.8',
                textAlign: isMobile ? 'center' : 'left'
              }}>
                Our commitment to excellence has earned us the trust of horse owners, trainers, and barn managers who rely on us to maintain their valuable equipment in peak condition.
              </p>
            </div>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: isMobile ? '30px 20px' : '40px',
              borderRadius: '16px',
              border: '2px solid #e9ecef',
              order: isMobile ? '-1' : '0'
            }}>
              <h3 style={{
                fontSize: isMobile ? '1.25rem' : '1.5rem',
                marginBottom: isMobile ? '20px' : '24px',
                color: '#7a6990',
                textAlign: 'center'
              }}>
                🐎 Why We Do What We Do
              </h3>
              <ul style={{
                color: '#666',
                lineHeight: '1.8',
                paddingLeft: isMobile ? '20px' : '20px',
                fontSize: isMobile ? '0.95rem' : '1rem'
              }}>
                <li>Protect your investment in quality equipment</li>
                <li>Ensure your horse&apos;s comfort and safety</li>
                <li>Extend the lifespan of valuable gear</li>
                <li>Support the equestrian community</li>
                <li>Provide reliable, professional service</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: isMobile ? '60px 20px' : '80px 24px',
        backgroundColor: 'white'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: isMobile ? '2rem' : '2.5rem',
            marginBottom: isMobile ? '20px' : '30px',
            color: '#1a1a1a'
          }}>
            Ready to Experience the Difference?
          </h2>
          <p style={{
            fontSize: isMobile ? '1rem' : '1.1rem',
            color: '#666',
            marginBottom: isMobile ? '30px' : '40px',
            lineHeight: '1.6'
          }}>
            Join the many horse owners who trust Serene Spaces with their valuable equipment. 
            Contact us today to schedule your first service.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            <a
              href="mailto:loveserenespaces@gmail.com"
              style={{
                display: 'inline-block',
                backgroundColor: '#7a6990',
                color: 'white',
                padding: isMobile ? '14px 24px' : '16px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: isMobile ? '1rem' : '1.1rem',
                transition: 'all 0.2s ease',
                width: isMobile ? '100%' : 'auto',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              Get Started Today
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#1a1a1a',
        color: 'white',
        padding: isMobile ? '30px 20px' : '40px 24px',
        textAlign: 'center'
      }}>
        {/* Social Media Links */}
        <div style={{
          marginBottom: '24px'
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: isMobile ? '1rem' : '1.1rem',
            fontWeight: '600',
            margin: '0 0 16px 0'
          }}>
            Follow Us
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: isMobile ? '12px' : '16px',
            marginBottom: '16px'
          }}>
            <a 
              href="https://instagram.com/loveserenespaces" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                fontSize: isMobile ? '1.3rem' : '1.5rem',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isMobile ? '45px' : '50px',
                height: isMobile ? '45px' : '50px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#E4405F';
                e.currentTarget.style.backgroundColor = 'rgba(228, 64, 95, 0.1)';
                e.currentTarget.style.borderColor = '#E4405F';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              title="Follow us on Instagram @loveserenespaces"
            >
              📷
            </a>
            <a 
              href="https://facebook.com/loveserenespaces" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                fontSize: isMobile ? '1.3rem' : '1.5rem',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isMobile ? '45px' : '50px',
                height: isMobile ? '45px' : '50px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1877F2';
                e.currentTarget.style.backgroundColor = 'rgba(24, 119, 242, 0.1)';
                e.currentTarget.style.borderColor = '#1877F2';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              title="Follow us on Facebook"
            >
              📘
            </a>
            <a 
              href="mailto:loveserenespaces@gmail.com"
              style={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                fontSize: isMobile ? '1.3rem' : '1.5rem',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isMobile ? '45px' : '50px',
                height: isMobile ? '45px' : '50px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#EA4335';
                e.currentTarget.style.backgroundColor = 'rgba(234, 67, 53, 0.1)';
                e.currentTarget.style.borderColor = '#EA4335';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              title="Email us at loveserenespaces@gmail.com"
            >
              ✉️
            </a>
            <a 
              href="https://loveserenespaces.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                fontSize: isMobile ? '1.3rem' : '1.5rem',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isMobile ? '45px' : '50px',
                height: isMobile ? '45px' : '50px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#7a6990';
                e.currentTarget.style.backgroundColor = 'rgba(122, 105, 144, 0.1)';
                e.currentTarget.style.borderColor = '#7a6990';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              title="Visit our website at loveserenespaces.com"
            >
              🌐
            </a>
          </div>
          <p style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            margin: '0 0 20px 0'
          }}>
            @loveserenespaces • loveserenespaces.com
          </p>
        </div>
        
        <p style={{ 
          margin: '0', 
          opacity: '0.8',
          fontSize: isMobile ? '0.9rem' : '1rem'
        }}>
          © 2025 Serene Spaces. Professional horse blanket cleaning, repairs, and waterproofing services.
        </p>
        <p style={{ 
          fontSize: isMobile ? '0.75rem' : '0.875rem',
          color: 'rgba(255,255,255,0.4)',
          textAlign: 'center',
          marginTop: '8px'
        }}>
          Made and designed by{' '}
          <a 
            href="https://codeandcosmos.com" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: 'rgba(255,255,255,0.6)',
              textDecoration: 'none',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Code & Cosmos
          </a>
        </p>
        <p style={{ 
          margin: '16px 0 0', 
          opacity: '0.6', 
          fontSize: isMobile ? '0.8rem' : '0.9rem' 
        }}>
          Serving the equestrian community with expertise and care for over 10 years.
        </p>
      </footer>
    </div>
  );
}
