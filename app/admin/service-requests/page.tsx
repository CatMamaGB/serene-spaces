'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ServiceRequest {
  id: string;
  customerId: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  services: string[];
  address: string;
  status: string;
  createdAt: string;
  estimatedCost?: number;
  scheduledPickupDate?: string;
  repairNotes?: string;
  waterproofingNotes?: string;
  allergies?: string;
}

export default function ServiceRequestsPage() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const fetchServiceRequests = async () => {
      try {
        const response = await fetch('/api/service-requests');
        if (response.ok) {
          const data = await response.json();
          setServiceRequests(data);
        }
      } catch (error) {
        console.error('Error fetching service requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequests();

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch('/api/service-requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (response.ok) {
        setServiceRequests(prev => 
          prev.map(req => 
            req.id === id ? { ...req, status: newStatus } : req
          )
        );
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
      case 'scheduled':
        return { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' };
      case 'completed':
        return { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' };
      case 'cancelled':
        return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' };
      default:
        return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '24px',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading service requests...</div>
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
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        padding: isMobile ? '0' : '0'
      }}>
        {/* Header */}
        <div style={{ 
          marginBottom: '2rem',
          padding: isMobile ? '1.5rem' : '2rem',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '1rem' : '0'
          }}>
            <div>
              <h1 style={{ 
                fontSize: isMobile ? '1.75rem' : '2.25rem', 
                marginBottom: '0.5rem',
                color: '#1f2937',
                fontWeight: '700'
              }}>
                Service Requests
              </h1>
              <p style={{ 
                color: '#6b7280',
                fontSize: isMobile ? '0.875rem' : '1rem',
                margin: 0
              }}>
                Manage incoming service requests from customers
              </p>
            </div>
            <Link
              href="/admin"
              style={{
                padding: isMobile ? '0.75rem 1rem' : '0.5rem 1rem',
                backgroundColor: '#7a6990',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: isMobile ? '0.875rem' : '0.875rem',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#6b5b7a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#7a6990';
              }}
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Service Requests List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6',
          overflow: 'hidden'
        }}>
          {serviceRequests.length === 0 ? (
            <div style={{
              padding: '60px 24px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: '0.5' }}>📋</div>
              <h3 style={{ marginBottom: '8px', color: '#374151' }}>No Service Requests</h3>
              <p>When customers submit intake forms, their requests will appear here.</p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div style={{
                padding: isMobile ? '1rem' : '1.5rem',
                borderBottom: '1px solid #f3f4f6',
                backgroundColor: '#f9fafb'
              }}>
                <h2 style={{
                  fontSize: isMobile ? '1.125rem' : '1.25rem',
                  color: '#1f2937',
                  fontWeight: '600',
                  margin: 0
                }}>
                  Recent Requests ({serviceRequests.length})
                </h2>
              </div>

              {/* Requests List */}
              {isMobile ? (
                // Mobile card layout
                <div style={{ padding: '0' }}>
                  {serviceRequests.map((request, index) => (
                    <div key={request.id} style={{
                      padding: '1rem',
                      borderBottom: index < serviceRequests.length - 1 ? '1px solid #f3f4f6' : 'none',
                      backgroundColor: 'white'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '0.75rem'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#1f2937',
                            marginBottom: '0.25rem'
                          }}>
                            {request.customer.name}
                          </div>
                          <div style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            marginBottom: '0.5rem'
                          }}>
                            {request.customer.email}
                          </div>
                          <div style={{
                            fontSize: '0.875rem',
                            color: '#6b7280'
                          }}>
                            {request.address}
                          </div>
                        </div>
                        <select
                          value={request.status}
                          onChange={(e) => updateStatus(request.id, e.target.value)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            backgroundColor: 'white'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        marginBottom: '0.75rem'
                      }}>
                        {request.services.map((service, idx) => (
                          <span key={idx} style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {service}
                          </span>
                        ))}
                      </div>

                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        Submitted: {formatDate(request.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Desktop table layout
                <div style={{ overflow: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse'
                  }}>
                    <thead>
                      <tr style={{
                        backgroundColor: '#f9fafb',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        <th style={{
                          padding: '1rem 1.5rem',
                          textAlign: 'left',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#374151'
                        }}>
                          Customer
                        </th>
                        <th style={{
                          padding: '1rem 1.5rem',
                          textAlign: 'left',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#374151'
                        }}>
                          Services
                        </th>
                        <th style={{
                          padding: '1rem 1.5rem',
                          textAlign: 'left',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#374151'
                        }}>
                          Address
                        </th>
                        <th style={{
                          padding: '1rem 1.5rem',
                          textAlign: 'left',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#374151'
                        }}>
                          Status
                        </th>
                        <th style={{
                          padding: '1rem 1.5rem',
                          textAlign: 'left',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#374151'
                        }}>
                          Submitted
                        </th>
                        <th style={{
                          padding: '1rem 1.5rem',
                          textAlign: 'left',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#374151'
                        }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceRequests.map((request) => (
                        <tr key={request.id} style={{
                          borderBottom: '1px solid #f3f4f6',
                          backgroundColor: 'white'
                        }}>
                          <td style={{
                            padding: '1rem 1.5rem',
                            verticalAlign: 'top'
                          }}>
                            <div style={{
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: '#1f2937',
                              marginBottom: '0.25rem'
                            }}>
                              {request.customer.name}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              color: '#6b7280'
                            }}>
                              {request.customer.email}
                            </div>
                            {request.customer.phone && (
                              <div style={{
                                fontSize: '0.75rem',
                                color: '#6b7280'
                              }}>
                                {request.customer.phone}
                              </div>
                            )}
                          </td>
                          <td style={{
                            padding: '1rem 1.5rem',
                            verticalAlign: 'top'
                          }}>
                            <div style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '0.25rem'
                            }}>
                              {request.services.map((service, idx) => (
                                <span key={idx} style={{
                                  padding: '0.25rem 0.5rem',
                                  backgroundColor: '#f3f4f6',
                                  color: '#374151',
                                  borderRadius: '4px',
                                  fontSize: '0.75rem',
                                  fontWeight: '500'
                                }}>
                                  {service}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td style={{
                            padding: '1rem 1.5rem',
                            verticalAlign: 'top',
                            maxWidth: '200px'
                          }}>
                            <div style={{
                              fontSize: '0.875rem',
                              color: '#374151',
                              lineHeight: '1.4'
                            }}>
                              {request.address}
                            </div>
                          </td>
                          <td style={{
                            padding: '1rem 1.5rem',
                            verticalAlign: 'top'
                          }}>
                            <select
                              value={request.status}
                              onChange={(e) => updateStatus(request.id, e.target.value)}
                              style={{
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                                backgroundColor: 'white',
                                minWidth: '120px'
                              }}
                            >
                              <option value="pending">Pending</option>
                              <option value="scheduled">Scheduled</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td style={{
                            padding: '1rem 1.5rem',
                            verticalAlign: 'top'
                          }}>
                            <div style={{
                              fontSize: '0.875rem',
                              color: '#6b7280'
                            }}>
                              {formatDate(request.createdAt)}
                            </div>
                          </td>
                          <td style={{
                            padding: '1rem 1.5rem',
                            verticalAlign: 'top'
                          }}>
                            <div style={{
                              display: 'flex',
                              gap: '0.5rem'
                            }}>
                              <button
                                onClick={() => {
                                  // TODO: Implement view details modal
                                  alert('View details functionality coming soon!');
                                }}
                                style={{
                                  padding: '0.5rem 1rem',
                                  backgroundColor: '#7a6990',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '0.875rem',
                                  fontWeight: '500',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#6b5b7a';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '#7a6990';
                                }}
                              >
                                View Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
