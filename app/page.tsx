export default function HomePage() {
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
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '3.5rem',
            marginBottom: '24px',
            fontWeight: '700'
          }}>
            Serene Spaces
          </h1>
          <p style={{
            fontSize: '1.5rem',
            marginBottom: '40px',
            opacity: '0.9'
          }}>
            Professional Horse Blanket & Equipment Care
          </p>
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '40px',
            opacity: '0.8',
            lineHeight: '1.6'
          }}>
            We'll clean and repair your horse's essentials — quickly and reliably. From blankets to boots, Serene Spaces makes it easy with local pick-up & delivery.
          </p>
          <a 
            href="/intake" 
            style={{
              display: 'inline-block',
              backgroundColor: '#7a6990',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '8px',
              fontSize: '1.2rem',
              fontWeight: '600',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s'
            }}
          >
            🐎 Schedule Pickup & Service
          </a>
        </div>
      </section>

      {/* Services Overview */}
      <section style={{
        padding: '80px 24px',
        backgroundColor: 'white'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            textAlign: 'center',
            marginBottom: '60px',
            color: '#1a1a1a'
          }}>
            Our Services
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: '#7a6990' }}>
                🧼 Professional Cleaning
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Deep cleaning for all fabric types with eco-friendly solutions
              </p>
            </div>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: '#7a6990' }}>
                🔧 Expert Repairs
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Rip repairs, strap replacement, and zipper fixes
              </p>
            </div>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '30px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', color: '#7a6990' }}>
                🌧️ Waterproofing
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                Professional waterproofing treatment and seam sealing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 24px',
        backgroundColor: '#7a6990',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            marginBottom: '24px'
          }}>
            Ready to Get Started?
          </h2>
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '32px',
            opacity: '0.9'
          }}>
            Contact us today to schedule your pickup and give your horse equipment the care it deserves.
          </p>
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a 
              href="/intake" 
              style={{
                display: 'inline-block',
                backgroundColor: 'white',
                color: '#7a6990',
                padding: '16px 32px',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              Schedule Service
            </a>
            <a 
              href="/contact" 
              style={{
                display: 'inline-block',
                backgroundColor: 'transparent',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                textDecoration: 'none',
                border: '2px solid white'
              }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#1a1a1a',
        color: 'white',
        padding: '40px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px',
            marginBottom: '30px'
          }}>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Home</a>
                <a href="/pricing" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Pricing</a>
                <a href="/intake" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Schedule Service</a>
                <a href="/contact" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Contact</a>
                <a href="/about" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>About Us</a>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Contact</h4>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0' }}>
                loveserenespaces@gmail.com<br />
                (815) 621-3509
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Service Area</h4>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0' }}>
                Crystal Lake, IL<br />
                25-mile radius
              </p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '20px' }}>
            <p style={{ margin: '0', opacity: '0.8' }}>
              © 2024 Serene Spaces. Professional horse blanket cleaning, repairs, and waterproofing services.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
