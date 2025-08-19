import Link from 'next/link';

export default function BlanketCleaningPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '48px',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #e9ecef',
        maxWidth: '500px'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '24px',
          opacity: '0.3'
        }}>
          🚧
        </div>
        
        <h1 style={{
          fontSize: '2rem',
          margin: '0 0 16px 0',
          color: '#1a1a1a',
          fontWeight: '700'
        }}>
          Blanket Cleaning & Repair Service
        </h1>
        
        <p style={{
          color: '#666',
          margin: '0 0 32px 0',
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          This service is currently being updated. 
          Please check back soon for more information.
        </p>
        
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '14px 28px',
            backgroundColor: '#7a6990',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
