'use client';
import { useEffect, useState } from 'react';
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
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Mock data for now since the API might not be set up yet
    const mockInvoices: Invoice[] = [
      {
        id: '1',
        customerName: 'Sarah Johnson',
        invoiceNumber: 'INV-001',
        issueDate: '2024-01-15',
        dueDate: '2024-02-14',
        total: 24500, // $245.00 in cents
        status: 'open'
      },
      {
        id: '2',
        customerName: 'Mike Chen',
        invoiceNumber: 'INV-002',
        issueDate: '2024-01-14',
        dueDate: '2024-02-13',
        total: 18050, // $180.50 in cents
        status: 'paid'
      },
      {
        id: '3',
        customerName: 'Emily Rodriguez',
        invoiceNumber: 'INV-003',
        issueDate: '2024-01-13',
        dueDate: '2024-02-12',
        total: 32000, // $320.00 in cents
        status: 'draft'
      }
    ];

    // For now, just use mock data directly since the API isn't fully set up
    setInvoices(mockInvoices);
    setLoading(false);

    return () => window.removeEventListener('resize', checkMobile);

    // TODO: Uncomment this when the API is properly set up
    /*
    fetch('/api/invoices/list')
      .then(r => {
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setInvoices(data);
        } else {
          console.warn('API returned non-array data, using mock data');
          setInvoices(mockInvoices);
        }
      })
      .catch(error => {
        console.error('Error fetching invoices, using mock data:', error);
        setInvoices(mockInvoices);
      })
      .finally(() => setLoading(false));
    */
  }, []);

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', padding: isMobile ? '40px' : '60px' }}>
            <div style={{ fontSize: isMobile ? '1rem' : '1.2rem', color: '#666' }}>Loading invoices...</div>
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
              margin: '0',
              color: '#1a1a1a'
            }}>
              Invoice Management
            </h1>
            <p style={{
              color: '#666',
              margin: '8px 0 0 0',
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}>
              Manage and track all customer invoices
            </p>
          </div>
          <Link
            href="/admin/invoices/new"
            style={{
              padding: isMobile ? '14px 20px' : '12px 24px',
              backgroundColor: '#7a6990',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: isMobile ? '0.9rem' : '1rem',
              fontWeight: '600',
              textAlign: 'center',
              width: isMobile ? '100%' : 'auto'
            }}
          >
            + New Invoice
          </Link>
        </div>

        {invoices.length === 0 ? (
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
              📄
            </div>
            <h3 style={{
              fontSize: isMobile ? '1.25rem' : '1.5rem',
              margin: '0 0 16px 0',
              color: '#1a1a1a'
            }}>
              No Invoices Yet
            </h3>
            <p style={{
              color: '#666',
              margin: '0 0 24px 0',
              fontSize: isMobile ? '1rem' : '1.1rem'
            }}>
              Create your first invoice to get started
            </p>
            <Link
              href="/admin/invoices/new"
              style={{
                padding: isMobile ? '14px 20px' : '12px 24px',
                backgroundColor: '#7a6990',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: isMobile ? '0.9rem' : '1rem',
                fontWeight: '600',
                width: isMobile ? '100%' : 'auto',
                display: 'inline-block'
              }}
            >
              Create Invoice
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
                Invoice List ({invoices.length} invoices)
              </h3>
            </div>
            
            {/* Mobile Card Layout */}
            {isMobile ? (
              <div style={{ padding: '16px' }}>
                {invoices.map((invoice) => (
                  <div key={invoice.id} style={{
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
                      <div>
                        <h4 style={{
                          margin: '0 0 4px 0',
                          fontSize: '1.1rem',
                          color: '#1a1a1a',
                          fontWeight: '600'
                        }}>
                          {invoice.invoiceNumber || 'N/A'}
                        </h4>
                        <p style={{
                          margin: '0',
                          fontSize: '0.9rem',
                          color: '#666'
                        }}>
                          {invoice.customerName}
                        </p>
                      </div>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: getStatusColor(invoice.status).text,
                        backgroundColor: getStatusColor(invoice.status).bg,
                        border: `1px solid ${getStatusColor(invoice.status).border}`
                      }}>
                        {invoice.status}
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gap: '8px',
                      fontSize: '0.9rem',
                      marginBottom: '16px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ color: '#666' }}>Issue Date:</span>
                        <span style={{ color: '#1a1a1a', fontWeight: '500' }}>
                          {invoice.issueDate ? formatDate(invoice.issueDate) : 'N/A'}
                        </span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ color: '#666' }}>Due Date:</span>
                        <span style={{ color: '#1a1a1a', fontWeight: '500' }}>
                          {invoice.dueDate ? formatDate(invoice.dueDate) : 'N/A'}
                        </span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ color: '#666' }}>Total:</span>
                        <span style={{ color: '#1a1a1a', fontWeight: '600', fontSize: '1rem' }}>
                          {formatCurrency(invoice.total)}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      justifyContent: 'center'
                    }}>
                      <Link
                        href={`/admin/invoices/${invoice.id}`}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#7a6990',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                          flex: 1,
                          textAlign: 'center'
                        }}
                      >
                        View
                      </Link>
                      <button
                        onClick={() => {
                          // Handle edit functionality
                          console.log('Edit invoice:', invoice.id);
                        }}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          flex: 1
                        }}
                      >
                        Edit
                      </button>
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
                        Invoice #
                      </th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        borderBottom: '1px solid #e9ecef',
                        color: '#1a1a1a',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        Customer
                      </th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        borderBottom: '1px solid #e9ecef',
                        color: '#1a1a1a',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        Issue Date
                      </th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        borderBottom: '1px solid #e9ecef',
                        color: '#1a1a1a',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        Due Date
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
                      <th style={{
                        padding: '16px',
                        textAlign: 'center',
                        borderBottom: '1px solid #e9ecef',
                        color: '#1a1a1a',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        Status
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
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} style={{
                        borderBottom: '1px solid #f0f0f0'
                      }}>
                        <td style={{
                          padding: '16px',
                          color: '#1a1a1a',
                          fontWeight: '500'
                        }}>
                          {invoice.invoiceNumber || 'N/A'}
                        </td>
                        <td style={{
                          padding: '16px',
                          color: '#1a1a1a'
                        }}>
                          {invoice.customerName}
                        </td>
                        <td style={{
                          padding: '16px',
                          color: '#666',
                          fontSize: '0.9rem'
                        }}>
                          {invoice.issueDate ? formatDate(invoice.issueDate) : 'N/A'}
                        </td>
                        <td style={{
                          padding: '16px',
                          color: '#666',
                          fontSize: '0.9rem'
                        }}>
                          {invoice.dueDate ? formatDate(invoice.dueDate) : 'N/A'}
                        </td>
                        <td style={{
                          padding: '16px',
                          textAlign: 'right',
                          color: '#1a1a1a',
                          fontWeight: '600'
                        }}>
                          {formatCurrency(invoice.total)}
                        </td>
                        <td style={{
                          padding: '16px',
                          textAlign: 'center'
                        }}>
                          <span style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            color: getStatusColor(invoice.status).text,
                            backgroundColor: getStatusColor(invoice.status).bg,
                            border: `1px solid ${getStatusColor(invoice.status).border}`
                          }}>
                            {invoice.status}
                          </span>
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
                              href={`/admin/invoices/${invoice.id}`}
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
                            <button
                              onClick={() => {
                                // Handle edit functionality
                                console.log('Edit invoice:', invoice.id);
                              }}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                fontWeight: '500',
                                cursor: 'pointer'
                              }}
                            >
                              Edit
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
