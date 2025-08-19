'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

type Invoice = {
  id: string;
  customerName: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  total: number;
  status: string;
  hostedUrl?: string;
  pdfUrl?: string;
  items?: InvoiceItem[];
  notes?: string;
};

type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export default function InvoiceDetailPage() {
  const params = useParams();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Mock data for now - in a real app, this would come from an API
    const mockInvoice: Invoice = {
      id: params.id as string,
      customerName: 'Sarah Johnson',
      invoiceNumber: 'INV-001',
      issueDate: '2024-01-15',
      dueDate: '2024-02-14',
      total: 24500, // $245.00 in cents
      status: 'open',
      notes: 'Barn organization and blanket cleaning services completed.',
      items: [
        {
          id: '1',
          description: 'Barn Organization & Cleanup',
          quantity: 1,
          unitPrice: 15000, // $150.00
          total: 15000
        },
        {
          id: '2',
          description: 'Blanket Cleaning & Repair',
          quantity: 3,
          unitPrice: 2500, // $25.00
          total: 7500
        },
        {
          id: '3',
          description: 'Wraps & Boots',
          quantity: 4,
          unitPrice: 500, // $5.00
          total: 2000
        }
      ]
    };

    // Simulate API call
    setTimeout(() => {
      setInvoice(mockInvoice);
      setLoading(false);
    }, 500);

    return () => window.removeEventListener('resize', checkMobile);
  }, [params.id]);

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' };
      case 'open':
        return { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' };
      case 'draft':
        return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
      case 'void':
        return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' };
      default:
        return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: isMobile ? '16px' : '24px',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', padding: isMobile ? '40px' : '60px' }}>
            <div style={{ fontSize: isMobile ? '1rem' : '1.2rem', color: '#666' }}>Loading invoice...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div style={{ 
        padding: isMobile ? '16px' : '24px',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', padding: isMobile ? '40px' : '60px' }}>
            <div style={{ fontSize: isMobile ? '1rem' : '1.2rem', color: '#666' }}>Invoice not found</div>
            <Link
              href="/admin/invoices"
              style={{
                display: 'inline-block',
                marginTop: '20px',
                padding: '12px 24px',
                backgroundColor: '#7a6990',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              Back to Invoices
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: isMobile ? '16px' : '24px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
              margin: '0',
              color: '#1a1a1a'
            }}>
              Invoice Details
            </h1>
            <p style={{
              color: '#666',
              margin: '8px 0 0 0',
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}>
              {invoice.invoiceNumber}
            </p>
          </div>
          <div style={{
            display: 'flex',
            gap: '12px',
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <Link
              href={`/admin/invoices/${invoice.id}/edit`}
              style={{
                padding: isMobile ? '12px 20px' : '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: isMobile ? '0.9rem' : '0.875rem',
                fontWeight: '600',
                textAlign: 'center',
                width: isMobile ? '100%' : 'auto'
              }}
            >
              Edit Invoice
            </Link>
            <Link
              href="/admin/invoices"
              style={{
                padding: isMobile ? '12px 20px' : '10px 20px',
                backgroundColor: 'transparent',
                color: '#7a6990',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: isMobile ? '0.9rem' : '0.875rem',
                fontWeight: '600',
                border: '2px solid #7a6990',
                textAlign: 'center',
                width: isMobile ? '100%' : 'auto'
              }}
            >
              Back to Invoices
            </Link>
          </div>
        </div>

        {/* Invoice Information */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: '1px solid #e9ecef',
          overflow: 'hidden',
          marginBottom: '24px'
        }}>
          <div style={{
            padding: isMobile ? '16px' : '24px',
            borderBottom: '1px solid #e9ecef',
            backgroundColor: '#f8f9fa'
          }}>
            <h2 style={{
              fontSize: isMobile ? '1.25rem' : '1.5rem',
              margin: '0',
              color: '#1a1a1a'
            }}>
              Invoice Information
            </h2>
          </div>
          
          <div style={{ padding: isMobile ? '16px' : '24px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? '16px' : '24px',
              marginBottom: '24px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.1rem',
                  margin: '0 0 12px 0',
                  color: '#7a6990',
                  fontWeight: '600'
                }}>
                  Customer Details
                </h3>
                <p style={{
                  margin: '8px 0',
                  fontSize: '1rem',
                  color: '#1a1a1a',
                  fontWeight: '500'
                }}>
                  {invoice.customerName}
                </p>
              </div>
              
              <div>
                <h3 style={{
                  fontSize: '1.1rem',
                  margin: '0 0 12px 0',
                  color: '#7a6990',
                  fontWeight: '600'
                }}>
                  Invoice Details
                </h3>
                <div style={{
                  display: 'grid',
                  gap: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ color: '#666' }}>Issue Date:</span>
                    <span style={{ color: '#1a1a1a', fontWeight: '500' }}>
                      {formatDate(invoice.issueDate)}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ color: '#666' }}>Due Date:</span>
                    <span style={{ color: '#1a1a1a', fontWeight: '500' }}>
                      {formatDate(invoice.dueDate)}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ color: '#666' }}>Status:</span>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: getStatusColor(invoice.status).text,
                      backgroundColor: getStatusColor(invoice.status).bg,
                      border: `1px solid ${getStatusColor(invoice.status).border}`
                    }}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        {invoice.items && invoice.items.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e9ecef',
            overflow: 'hidden',
            marginBottom: '24px'
          }}>
            <div style={{
              padding: isMobile ? '16px' : '24px',
              borderBottom: '1px solid #e9ecef',
              backgroundColor: '#f8f9fa'
            }}>
              <h2 style={{
                fontSize: isMobile ? '1.25rem' : '1.5rem',
                margin: '0',
                color: '#1a1a1a'
              }}>
                Invoice Items
              </h2>
            </div>
            
            <div style={{ padding: isMobile ? '0' : '0' }}>
              {isMobile ? (
                // Mobile card layout
                <div style={{ padding: '16px' }}>
                  {invoice.items.map((item, index) => (
                    <div key={item.id} style={{
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: index < invoice.items!.length - 1 ? '12px' : '0',
                      backgroundColor: '#fafbfc'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <h4 style={{
                          margin: '0',
                          fontSize: '1rem',
                          color: '#1a1a1a',
                          fontWeight: '600'
                        }}>
                          {item.description}
                        </h4>
                        <span style={{
                          fontSize: '1rem',
                          color: '#1a1a1a',
                          fontWeight: '600'
                        }}>
                          {formatCurrency(item.total)}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: '#666',
                        fontSize: '0.9rem'
                      }}>
                        <span>Qty: {item.quantity}</span>
                        <span>@ {formatCurrency(item.unitPrice)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Desktop table layout
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
                        Description
                      </th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'center',
                        borderBottom: '1px solid #e9ecef',
                        color: '#1a1a1a',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        Quantity
                      </th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'right',
                        borderBottom: '1px solid #e9ecef',
                        color: '#1a1a1a',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        Unit Price
                      </th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'right',
                        borderBottom: '1px solid #e9ecef',
                        color: '#1a1a1a',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id} style={{
                        borderBottom: '1px solid #f0f0f0'
                      }}>
                        <td style={{
                          padding: '16px',
                          color: '#1a1a1a',
                          fontWeight: '500'
                        }}>
                          {item.description}
                        </td>
                        <td style={{
                          padding: '16px',
                          textAlign: 'center',
                          color: '#666'
                        }}>
                          {item.quantity}
                        </td>
                        <td style={{
                          padding: '16px',
                          textAlign: 'right',
                          color: '#666'
                        }}>
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td style={{
                          padding: '16px',
                          textAlign: 'right',
                          color: '#1a1a1a',
                          fontWeight: '600'
                        }}>
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Invoice Total */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: '1px solid #e9ecef',
          padding: isMobile ? '20px' : '24px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 0',
            borderTop: '1px solid #e9ecef'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              margin: '0',
              color: '#1a1a1a',
              fontWeight: '600'
            }}>
              Total Amount
            </h3>
            <span style={{
              fontSize: '1.5rem',
              color: '#7a6990',
              fontWeight: '700'
            }}>
              {formatCurrency(invoice.total)}
            </span>
          </div>
          
          {invoice.notes && (
            <div style={{
              marginTop: '20px',
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <h4 style={{
                fontSize: '1rem',
                margin: '0 0 8px 0',
                color: '#1a1a1a',
                fontWeight: '600'
              }}>
                Notes
              </h4>
              <p style={{
                margin: '0',
                color: '#666',
                fontSize: '0.9rem',
                lineHeight: '1.5'
              }}>
                {invoice.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
