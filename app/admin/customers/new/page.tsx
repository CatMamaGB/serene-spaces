'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type CustomerFormData = {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  notes: string;
};

export default function NewCustomerPage() {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    notes: ''
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
            notes: ''
          });
        }, 2000);
      } else {
        alert('Error saving customer');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving customer');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={{ 
      padding: isMobile ? '16px' : '24px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '1rem' : '0'
          }}>
            <h1 style={{
              fontSize: isMobile ? '1.5rem' : '2rem',
              margin: '0',
              color: '#1a1a1a',
              textAlign: isMobile ? 'center' : 'left'
            }}>
              New Customer Intake
            </h1>
            <Link
              href="/admin/customers"
              style={{
                padding: isMobile ? '14px 20px' : '12px 24px',
                backgroundColor: 'transparent',
                color: '#7a6990',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: isMobile ? '0.9rem' : '1rem',
                fontWeight: '600',
                border: '2px solid #7a6990',
                textAlign: 'center',
                width: isMobile ? '100%' : 'auto'
              }}
            >
              View All Customers
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{
              backgroundColor: 'white',
              padding: isMobile ? '20px' : '32px',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: '1px solid #e9ecef'
            }}>
              {/* Personal Information */}
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: isMobile ? '1.25rem' : '1.5rem',
                  margin: '0 0 24px 0',
                  color: '#7a6990',
                  borderBottom: '2px solid #e9ecef',
                  paddingBottom: '12px'
                }}>
                  Personal Information
                </h2>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: isMobile ? '16px' : '20px',
                  marginBottom: '20px'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#333',
                      fontSize: isMobile ? '0.9rem' : '1rem'
                    }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      style={{
                        width: '100%',
                        padding: isMobile ? '10px' : '12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: isMobile ? '0.9rem' : '1rem',
                        backgroundColor: 'white',
                        color: '#374151',
                        transition: 'border-color 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#7a6990';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#333',
                      fontSize: isMobile ? '0.9rem' : '1rem'
                    }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      style={{
                        width: '100%',
                        padding: isMobile ? '10px' : '12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: isMobile ? '0.9rem' : '1rem',
                        backgroundColor: 'white',
                        color: '#374151',
                        transition: 'border-color 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#7a6990';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                      }}
                    />
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: isMobile ? '16px' : '20px',
                  marginBottom: '20px'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#333',
                      fontSize: isMobile ? '0.9rem' : '1rem'
                    }}>
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      style={{
                        width: '100%',
                        padding: isMobile ? '10px' : '12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: isMobile ? '0.9rem' : '1rem',
                        backgroundColor: 'white',
                        color: '#374151',
                        transition: 'border-color 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#7a6990';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                      }}
                    />
                  </div>
                  <div>
                    {/* Empty div to maintain grid layout on desktop */}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: isMobile ? '1.25rem' : '1.5rem',
                  margin: '0 0 24px 0',
                  color: '#7f86ac',
                  borderBottom: '2px solid #e9ecef',
                  paddingBottom: '12px'
                }}>
                  Address Information
                </h2>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#333',
                    fontSize: isMobile ? '0.9rem' : '1rem'
                  }}>
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.addressLine1}
                    onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                    style={{
                      width: '100%',
                      padding: isMobile ? '10px' : '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: isMobile ? '0.9rem' : '1rem',
                      backgroundColor: 'white',
                      color: '#374151',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#7a6990';
                      e.target.style.outline = 'none';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#333',
                    fontSize: isMobile ? '0.9rem' : '1rem'
                  }}>
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine2}
                    onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                    placeholder="Apartment, suite, unit, etc."
                    style={{
                      width: '100%',
                      padding: isMobile ? '10px' : '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: isMobile ? '0.9rem' : '1rem',
                      backgroundColor: 'white',
                      color: '#374151',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#7a6990';
                      e.target.style.outline = 'none';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                    }}
                  />
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
                  gap: isMobile ? '16px' : '20px'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#333',
                      fontSize: isMobile ? '0.9rem' : '1rem'
                    }}>
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      style={{
                        width: '100%',
                        padding: isMobile ? '10px' : '12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: isMobile ? '0.9rem' : '1rem',
                        backgroundColor: 'white',
                        color: '#374151',
                        transition: 'border-color 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#7a6990';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#333',
                      fontSize: isMobile ? '0.9rem' : '1rem'
                    }}>
                      State *
                    </label>
                    <select
                      required
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      style={{
                        width: '100%',
                        padding: isMobile ? '10px' : '12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: isMobile ? '0.9rem' : '1rem',
                        backgroundColor: 'white',
                        color: '#374151',
                        transition: 'border-color 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#7a6990';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                      }}
                    >
                      <option value="">Select state</option>
                      <option value="IL">Illinois</option>
                      <option value="WI">Wisconsin</option>
                      <option value="IN">Indiana</option>
                      <option value="MI">Michigan</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#333',
                      fontSize: isMobile ? '0.9rem' : '1rem'
                    }}>
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      style={{
                        width: '100%',
                        padding: isMobile ? '10px' : '12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: isMobile ? '0.9rem' : '1rem',
                        backgroundColor: 'white',
                        color: '#374151',
                        transition: 'border-color 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#7a6990';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: isMobile ? '1.25rem' : '1.5rem',
                  margin: '0 0 24px 0',
                  color: '#5f4b6a',
                  borderBottom: '2px solid #e9ecef',
                  paddingBottom: '12px'
                }}>
                  Additional Information
                </h2>
                
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#333',
                    fontSize: isMobile ? '0.9rem' : '1rem'
                  }}>
                    Special Instructions or Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any special instructions, preferences, or additional information..."
                    style={{
                      width: '100%',
                      padding: isMobile ? '10px' : '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: isMobile ? '0.9rem' : '1rem',
                      minHeight: isMobile ? '80px' : '100px',
                      resize: 'vertical',
                      backgroundColor: 'white',
                      color: '#374151',
                      transition: 'border-color 0.2s ease',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#7a6990';
                      e.target.style.outline = 'none';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                paddingTop: '24px',
                borderTop: '1px solid #e9ecef',
                flexDirection: isMobile ? 'column' : 'row'
              }}>
                <Link
                  href="/admin/customers"
                  style={{
                    padding: isMobile ? '14px 20px' : '16px 32px',
                    backgroundColor: 'transparent',
                    color: '#7a6990',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    fontWeight: '600',
                    border: '2px solid #7a6990',
                    textAlign: 'center',
                    width: isMobile ? '100%' : 'auto'
                  }}
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: isMobile ? '14px 20px' : '16px 32px',
                    backgroundColor: saved ? '#28a745' : '#7a6990',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    fontWeight: '600',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.6 : 1,
                    width: isMobile ? '100%' : 'auto'
                  }}
                >
                  {saving ? 'Saving...' : saved ? 'Customer Saved!' : 'Save Customer'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
  );
}
