'use client';
import { useState, useEffect } from 'react';
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
}

interface Invoice {
  id: string;
  customerName: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  total: number;
  status: string;
}

export default function AdminDashboard() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Mock data - in a real app, this would come from APIs
  const mockCustomers: Customer[] = [
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
  ];

  const mockInvoices: Invoice[] = [
    { id: '1', customerName: 'Sarah Johnson', invoiceNumber: 'INV-001', issueDate: '2024-01-15', dueDate: '2024-02-15', total: 245.00, status: 'Paid' },
    { id: '2', customerName: 'Mike Chen', invoiceNumber: 'INV-002', issueDate: '2024-01-14', dueDate: '2024-02-14', total: 180.50, status: 'Pending' },
    { id: '3', customerName: 'Emily Rodriguez', invoiceNumber: 'INV-003', issueDate: '2024-01-13', dueDate: '2024-02-13', total: 320.00, status: 'Paid' },
    { id: '4', customerName: 'David Wilson', invoiceNumber: 'INV-004', issueDate: '2024-01-12', dueDate: '2024-02-12', total: 95.25, status: 'Draft' }
  ];

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Fetch real data from APIs
    const fetchData = async () => {
      try {
        // Fetch customers
        const customersResponse = await fetch('/api/customers');
        if (customersResponse.ok) {
          const customersData = await customersResponse.json();
          setCustomers(customersData);
        } else {
          setCustomers(mockCustomers); // Fallback to mock data
        }

        // Fetch service requests
        const serviceRequestsResponse = await fetch('/api/service-requests');
        if (serviceRequestsResponse.ok) {
          const serviceRequestsData = await serviceRequestsResponse.json();
          setServiceRequests(serviceRequestsData);
        } else {
          setServiceRequests([]); // Empty array if API fails
        }

        // Fetch invoices
        const invoicesResponse = await fetch('/api/invoices/list');
        if (invoicesResponse.ok) {
          const invoicesData = await invoicesResponse.json();
          setInvoices(invoicesData);
        } else {
          setInvoices(mockInvoices); // Fallback to mock data
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use mock data as fallback
        setCustomers(mockCustomers);
        setServiceRequests([]);
        setInvoices(mockInvoices);
      }
      
      setLoading(false);
    };

    fetchData();

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const stats = {
    totalCustomers: customers.length,
    pendingServiceRequests: serviceRequests.filter(req => req.status === 'pending').length,
    pendingInvoices: invoices.filter(inv => inv.status === 'Pending').length,
    monthlyRevenue: invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.total, 0)
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };



  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' };
      case 'pending':
        return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
      case 'draft':
        return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
      default:
        return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
    }
  };

  const exportCustomerList = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Address', 'City', 'State', 'ZIP'],
      ...customers.map(customer => [
        customer.name,
        customer.email,
        customer.phone,
        customer.address,
        customer.city,
        customer.state,
        customer.zipCode
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'customer-list.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportInvoiceList = () => {
    const csvContent = [
      ['Invoice #', 'Customer', 'Issue Date', 'Due Date', 'Total', 'Status'],
      ...invoices.map(invoice => [
        invoice.invoiceNumber,
        invoice.customerName,
        invoice.issueDate,
        invoice.dueDate,
        formatCurrency(invoice.total),
        invoice.status
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'invoice-list.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading dashboard...</div>
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
        {/* Welcome Header */}
        <div style={{ 
          marginBottom: '2rem',
          padding: isMobile ? '1.5rem' : '2rem',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <h1 style={{ 
            fontSize: isMobile ? '1.75rem' : '2.25rem', 
            marginBottom: '0.75rem',
            color: '#1f2937',
            fontWeight: '700',
            letterSpacing: '-0.025em'
          }}>
            Welcome back, Admin
          </h1>
          <p style={{ 
            color: '#6b7280',
            fontSize: isMobile ? '1rem' : '1.125rem',
            margin: 0,
            lineHeight: '1.6'
          }}>
            Here&apos;s what&apos;s happening with your business today
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: isMobile ? '1rem' : '1.5rem',
          marginBottom: '2rem'
        }}>
          <Link
            href="/admin/customers"
            style={{
              textDecoration: 'none',
              display: 'block'
            }}
          >
            <div style={{
              padding: isMobile ? '1rem' : '1.5rem',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{ 
                fontSize: isMobile ? '2rem' : '2.5rem', 
                fontWeight: '700', 
                color: '#7a6990', 
                marginBottom: '0.5rem' 
              }}>
                {stats.totalCustomers}
              </div>
              <div style={{ 
                color: '#6b7280', 
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Total Customers
              </div>
            </div>
          </Link>
          
          <Link
            href="/admin/invoices"
            style={{
              textDecoration: 'none',
              display: 'block'
            }}
          >
            <div style={{
              padding: isMobile ? '1rem' : '1.5rem',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{ 
                fontSize: isMobile ? '2rem' : '2.5rem', 
                fontWeight: '700', 
                color: '#7a6990', 
                marginBottom: '0.5rem' 
              }}>
                {stats.pendingInvoices}
              </div>
              <div style={{ 
                color: '#6b7280', 
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Pending Invoices
              </div>
            </div>
          </Link>
          
                     <Link
             href="/admin/service-requests"
             style={{
               textDecoration: 'none',
               display: 'block'
             }}
           >
             <div style={{
               padding: isMobile ? '1rem' : '1.5rem',
               backgroundColor: 'white',
               borderRadius: '12px',
               boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
               border: '1px solid #f3f4f6',
               textAlign: 'center',
               cursor: 'pointer',
               transition: 'all 0.2s ease'
             }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.transform = 'translateY(-2px)';
                 e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'translateY(0)';
                 e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
               }}
             >
               <div style={{ 
                 fontSize: isMobile ? '2rem' : '2.5rem', 
                 fontWeight: '700', 
                 color: '#7a6990', 
                 marginBottom: '0.5rem' 
               }}>
                 {stats.pendingServiceRequests}
               </div>
               <div style={{ 
                 color: '#6b7280', 
                 fontSize: isMobile ? '0.75rem' : '0.875rem',
                 fontWeight: '500',
                 textTransform: 'uppercase',
                 letterSpacing: '0.05em'
               }}>
                 Pending Requests
               </div>
             </div>
           </Link>
           
           <div style={{
             padding: isMobile ? '1rem' : '1.5rem',
             backgroundColor: 'white',
             borderRadius: '12px',
             boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
             border: '1px solid #f3f4f6',
             textAlign: 'center'
           }}>
             <div style={{ 
               fontSize: isMobile ? '2rem' : '2.5rem', 
               fontWeight: '700', 
               color: '#7a6990', 
               marginBottom: '0.5rem' 
             }}>
               {formatCurrency(stats.monthlyRevenue)}
             </div>
             <div style={{ 
               color: '#6b7280', 
               fontSize: isMobile ? '0.75rem' : '0.875rem',
               fontWeight: '500',
               textTransform: 'uppercase',
               letterSpacing: '0.05em'
             }}>
               Monthly Revenue
             </div>
           </div>
        </div>

        {/* Export Section */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6',
          padding: isMobile ? '1.5rem' : '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: isMobile ? '1.125rem' : '1.25rem',
            color: '#1f2937',
            fontWeight: '600',
            margin: '0 0 1rem 0'
          }}>
            Export Data
          </h2>
          <p style={{
            color: '#6b7280',
            margin: '0 0 1.5rem 0',
            fontSize: isMobile ? '0.8rem' : '0.875rem'
          }}>
            Download your customer and invoice data for record keeping or analysis
          </p>
          <div style={{ 
            display: 'flex', 
            gap: isMobile ? '0.75rem' : '1rem', 
            flexWrap: 'wrap',
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <button
              onClick={exportCustomerList}
              style={{
                padding: isMobile ? '1rem 1.5rem' : '0.75rem 1.5rem',
                backgroundColor: '#7a6990',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: isMobile ? '1rem' : '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                width: isMobile ? '100%' : 'auto'
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
              📊 Export Customer List (CSV)
            </button>
            <button
              onClick={exportInvoiceList}
              style={{
                padding: isMobile ? '1rem 1.5rem' : '0.75rem 1.5rem',
                backgroundColor: '#7a6990',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: isMobile ? '1rem' : '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                width: isMobile ? '100%' : 'auto'
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
              📄 Export Invoice List (CSV)
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
          gap: isMobile ? '1.5rem' : '2rem'
        }}>
          {/* Recent Invoices */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: isMobile ? '1rem' : '1.5rem',
              borderBottom: '1px solid #f3f4f6',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '0.5rem' : '0'
              }}>
                <h2 style={{
                  fontSize: isMobile ? '1.125rem' : '1.25rem',
                  color: '#1f2937',
                  fontWeight: '600',
                  margin: 0
                }}>
                  Recent Invoices
                </h2>
                <Link
                  href="/admin/invoices"
                  style={{
                    color: '#7a6990',
                    textDecoration: 'none',
                    fontSize: isMobile ? '0.8rem' : '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  View All →
                </Link>
              </div>
            </div>
            
            <div style={{ padding: '0' }}>
              {invoices.slice(0, 4).map((invoice, index) => (
                <div key={invoice.id} style={{
                  padding: isMobile ? '0.75rem 1rem' : '1rem 1.5rem',
                  borderBottom: index < Math.min(4, invoices.length - 1) ? '1px solid #f3f4f6' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? '0.5rem' : '0',
                  textAlign: isMobile ? 'center' : 'left'
                }}>
                  <div style={{ width: isMobile ? '100%' : 'auto' }}>
                    <div style={{
                      fontSize: isMobile ? '0.8rem' : '0.875rem',
                      fontWeight: '500',
                      color: '#1f2937',
                      marginBottom: '0.25rem'
                    }}>
                      {invoice.customerName}
                    </div>
                    <div style={{
                      fontSize: isMobile ? '0.7rem' : '0.75rem',
                      color: '#6b7280'
                    }}>
                      {invoice.invoiceNumber}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '0.5rem' : '1rem',
                    flexDirection: isMobile ? 'column' : 'row'
                  }}>
                    <div style={{
                      fontSize: isMobile ? '0.8rem' : '0.875rem',
                      fontWeight: '600',
                      color: '#1f2937'
                    }}>
                      {formatCurrency(invoice.total)}
                    </div>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: isMobile ? '0.65rem' : '0.75rem',
                      fontWeight: '500',
                      backgroundColor: getStatusColor(invoice.status).bg,
                      color: getStatusColor(invoice.status).text,
                      border: `1px solid ${getStatusColor(invoice.status).border}`
                    }}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6',
            padding: isMobile ? '1rem' : '1.5rem'
          }}>
            <h3 style={{
              fontSize: isMobile ? '1rem' : '1.125rem',
              color: '#1f2937',
              fontWeight: '600',
              margin: '0 0 1rem 0',
              textAlign: isMobile ? 'center' : 'left'
            }}>
              Quick Actions
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gap: isMobile ? '1rem' : '0.75rem' 
            }}>
              <Link
                href="/admin/invoices/new"
                style={{
                  display: 'block',
                  padding: isMobile ? '1rem' : '0.75rem 1rem',
                  backgroundColor: '#7a6990',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: isMobile ? '1rem' : '0.875rem',
                  fontWeight: '500',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
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
                Create Invoice
              </Link>
              
              <Link
                href="/admin/customers/new"
                style={{
                  display: 'block',
                  padding: isMobile ? '1rem' : '0.75rem 1rem',
                  backgroundColor: 'transparent',
                  color: '#7a6990',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: isMobile ? '1rem' : '0.875rem',
                  fontWeight: '500',
                  textAlign: 'center',
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
                Add Customer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
