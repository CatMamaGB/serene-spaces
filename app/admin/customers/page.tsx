'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Mock customer data - in a real app, this would come from an API
  const mockCustomers: Customer[] = useMemo(() => [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      address: '123 Main Street',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '(555) 234-5678',
      address: '456 Oak Avenue',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '(555) 345-6789',
      address: '789 Pine Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102'
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '(555) 456-7890',
      address: '321 Elm Street',
      city: 'Denver',
      state: 'CO',
      zipCode: '80201'
    }
  ], []);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // For now, just use mock data directly since the API isn't fully set up
    setCustomers(mockCustomers);
    setLoading(false);

    return () => window.removeEventListener('resize', checkMobile);

    // TODO: Uncomment this when the API is properly set up
    /*
    fetch('/api/customers')
      .then(r => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setCustomers(data);
        } else {
          console.warn('API returned non-array data, using mock data');
          setCustomers(mockCustomers);
        }
      })
      .catch(error => {
        console.error('Error fetching customers, using mock data:', error);
        setCustomers(mockCustomers);
      })
      .finally(() => setLoading(false));
    */
  }, [mockCustomers]);

  const handleDeleteCustomer = (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(prev => prev.filter(customer => customer.id !== customerId));
      // TODO: Add API call to delete customer from database
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '24px',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading customers...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '24px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '1rem' : '0'
        }}>
          <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <h1 style={{
              fontSize: isMobile ? '1.5rem' : '2rem',
              margin: '0 0 8px 0',
              color: '#1a1a1a'
            }}>
              Customer Management
            </h1>
            <p style={{
              color: '#666',
              margin: 0,
              fontSize: isMobile ? '1rem' : '1.1rem'
            }}>
              Manage your customer database and information
            </p>
          </div>
          <Link
            href="/admin/customers/new"
            style={{
              padding: isMobile ? '16px 24px' : '12px 24px',
              backgroundColor: '#7a6990',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: isMobile ? '1.1rem' : '1rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              width: isMobile ? '100%' : 'auto',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#6b5b7a';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#7a6990';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            + Add New Customer
          </Link>
        </div>

        {customers.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            padding: isMobile ? '40px 20px' : '60px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e9ecef',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: isMobile ? '2rem' : '3rem',
              marginBottom: '24px',
              opacity: '0.3'
            }}>
              👥
            </div>
            <h3 style={{
              fontSize: isMobile ? '1.25rem' : '1.5rem',
              margin: '0 0 16px 0',
              color: '#1a1a1a'
            }}>
              No Customers Yet
            </h3>
            <p style={{
              color: '#666',
              margin: '0 0 24px 0',
              fontSize: isMobile ? '1rem' : '1.1rem'
            }}>
              Add your first customer to get started
            </p>
            <Link
              href="/admin/customers/new"
              style={{
                padding: isMobile ? '16px 24px' : '12px 24px',
                backgroundColor: '#7a6990',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: isMobile ? '1.1rem' : '1rem',
                fontWeight: '600',
                width: isMobile ? '100%' : 'auto',
                display: 'inline-block'
              }}
            >
              Add Customer
            </Link>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e9ecef',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: isMobile ? '16px' : '24px',
              borderBottom: '1px solid #e9ecef',
              backgroundColor: '#f8f9fa'
            }}>
              <h3 style={{
                fontSize: isMobile ? '1.1rem' : '1.2rem',
                margin: '0',
                color: '#1a1a1a',
                textAlign: isMobile ? 'center' : 'left'
              }}>
                Customer List ({customers.length} customers)
              </h3>
            </div>
            
            {/* Mobile Card Layout */}
            {isMobile ? (
              <div style={{ padding: '16px' }}>
                {customers.map((customer) => (
                  <div key={customer.id} style={{
                    border: '1px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px',
                    backgroundColor: '#fafbfc'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px'
                    }}>
                      <h4 style={{
                        margin: '0',
                        fontSize: '1.1rem',
                        color: '#1a1a1a',
                        fontWeight: '600'
                      }}>
                        {customer.name}
                      </h4>
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap'
                      }}>
                        <Link
                          href={`/admin/customers/${customer.id}`}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#7a6990',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/customers/${customer.id}/edit`}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#c82333';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#dc3545';
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gap: '8px',
                      fontSize: '0.9rem'
                    }}>
                      <div style={{ color: '#666' }}>
                        <strong>Email:</strong> {customer.email}
                      </div>
                      <div style={{ color: '#666' }}>
                        <strong>Phone:</strong> {customer.phone}
                      </div>
                      <div style={{ color: '#666' }}>
                        <strong>Address:</strong> {customer.address}, {customer.city}, {customer.state} {customer.zipCode}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Desktop Table Layout */
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        borderBottom: '1px solid #e9ecef',
                        color: '#1a1a1a',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        Customer Name
                      </th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        borderBottom: '1px solid #e9ecef',
                        color: '#1a1a1a',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        Email
                      </th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        borderBottom: '1px solid #e9ecef',
                        color: '#1a1a1a',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        Phone
                      </th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        borderBottom: '1px solid #e9ecef',
                        color: '#1a1a1a',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        Address
                      </th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'center',
                        borderBottom: '1px solid #e9ecef',
                        color: '#1a1a1a',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id} style={{
                        borderBottom: '1px solid #f0f0f0'
                      }}>
                        <td style={{
                          padding: '16px',
                          color: '#1a1a1a',
                          fontWeight: '500'
                        }}>
                          {customer.name}
                        </td>
                        <td style={{
                          padding: '16px',
                          color: '#666',
                          fontSize: '0.9rem'
                        }}>
                          {customer.email}
                        </td>
                        <td style={{
                          padding: '16px',
                          color: '#666',
                          fontSize: '0.9rem'
                        }}>
                          {customer.phone}
                        </td>
                        <td style={{
                          padding: '16px',
                          color: '#666',
                          fontSize: '0.9rem'
                        }}>
                          <div>
                            <div>{customer.address}</div>
                            <div style={{ fontSize: '0.8rem', color: '#999' }}>
                              {customer.city}, {customer.state} {customer.zipCode}
                            </div>
                          </div>
                        </td>
                        <td style={{
                          padding: '16px',
                          textAlign: 'center'
                        }}>
                          <div style={{
                            display: 'flex',
                            gap: '8px',
                            justifyContent: 'center'
                          }}>
                            <Link
                              href={`/admin/customers/${customer.id}`}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#7a6990',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                fontWeight: '500'
                              }}
                            >
                              View
                            </Link>
                            <Link
                              href={`/admin/customers/${customer.id}/edit`}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                fontWeight: '500'
                              }}
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteCustomer(customer.id)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#c82333';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#dc3545';
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
