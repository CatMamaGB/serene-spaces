'use client';

import { PRICING, PRICE_LABELS, TAX_RATE, type PriceCode } from '@/lib/pricing';

type Customer = { 
  id: string; 
  name: string; 
  email?: string | null;
  address?: string | null;
  phone?: string | null;
};

type InvoiceItem = {
  code: Exclude<PriceCode, 'TAX_RATE'> | 'REPAIRS';
  description: string;
  quantity: number;
  unitAmount: number;
  taxable: boolean;
  notes?: string;
};

type InvoicePreviewProps = {
  customer: Customer | null;
  items: InvoiceItem[];
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  notes?: string;
  onEdit: () => void;
  onSend: () => void;
  sending: boolean;
};

export default function InvoicePreview({
  customer,
  items,
  invoiceNumber,
  issueDate,
  dueDate,
  notes,
  onEdit,
  onSend,
  sending
}: InvoicePreviewProps) {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitAmount), 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

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

  if (!customer) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: '#666'
      }}>
        Please select a customer to preview the invoice
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: '1px solid #e9ecef',
      overflow: 'hidden',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#7a6990',
        color: 'white',
        padding: '40px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          margin: '0 0 16px 0',
          fontWeight: '700'
        }}>
          Serene Spaces
        </h1>
        <p style={{
          fontSize: '1.1rem',
          margin: '0',
          opacity: '0.9'
        }}>
          Professional Horse Blanket & Equipment Care
        </p>
      </div>

      {/* Invoice Details */}
      <div style={{ padding: '40px' }}>
        {/* Invoice Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '40px'
        }}>
          <div>
            <h2 style={{
              fontSize: '2rem',
              margin: '0 0 8px 0',
              color: '#1a1a1a'
            }}>
              INVOICE
            </h2>
            <p style={{
              margin: '0',
              color: '#666',
              fontSize: '1.1rem'
            }}>
              #{invoiceNumber}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '0.9rem' }}>
                Issue Date
              </p>
              <p style={{ margin: '0', color: '#1a1a1a', fontWeight: '600' }}>
                {formatDate(issueDate)}
              </p>
              <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                Due Date
              </p>
              <p style={{ margin: '0', color: '#1a1a1a', fontWeight: '600' }}>
                {formatDate(dueDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '24px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          marginBottom: '40px'
        }}>
          <h3 style={{
            fontSize: '1.2rem',
            margin: '0 0 16px 0',
            color: '#1a1a1a'
          }}>
            Bill To:
          </h3>
          <p style={{
            margin: '0 0 8px 0',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#1a1a1a'
          }}>
            {customer.name}
          </p>
          {customer.email && (
            <p style={{ margin: '0 0 8px 0', color: '#666' }}>
              {customer.email}
            </p>
          )}
          {customer.phone && (
            <p style={{ margin: '0 0 8px 0', color: '#666' }}>
              {customer.phone}
            </p>
          )}
          {customer.address && (
            <p style={{ margin: '0', color: '#666' }}>
              {customer.address}
            </p>
          )}
        </div>

        {/* Services Table */}
        <div style={{ marginBottom: '40px' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #e9ecef'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{
                  padding: '16px',
                  textAlign: 'left',
                  borderBottom: '1px solid #e9ecef',
                  color: '#1a1a1a',
                  fontWeight: '600'
                }}>
                  Service
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'center',
                  borderBottom: '1px solid #e9ecef',
                  color: '#1a1a1a',
                  fontWeight: '600'
                }}>
                  Qty
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'right',
                  borderBottom: '1px solid #e9ecef',
                  color: '#1a1a1a',
                  fontWeight: '600'
                }}>
                  Unit Price
                </th>
                <th style={{
                  padding: '16px',
                  textAlign: 'right',
                  borderBottom: '1px solid #e9ecef',
                  color: '#1a1a1a',
                  fontWeight: '600'
                }}>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td style={{
                    padding: '16px',
                    borderBottom: '1px solid #e9ecef',
                    color: '#1a1a1a'
                  }}>
                    <div>
                      <div style={{ fontWeight: '500' }}>
                        {item.description}
                      </div>
                      {item.notes && (
                        <div style={{
                          fontSize: '0.9rem',
                          color: '#666',
                          marginTop: '4px',
                          fontStyle: 'italic'
                        }}>
                          {item.notes}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{
                    padding: '16px',
                    textAlign: 'center',
                    borderBottom: '1px solid #e9ecef',
                    color: '#1a1a1a'
                  }}>
                    {item.quantity}
                  </td>
                  <td style={{
                    padding: '16px',
                    textAlign: 'right',
                    borderBottom: '1px solid #e9ecef',
                    color: '#1a1a1a'
                  }}>
                    {formatCurrency(item.unitAmount)}
                  </td>
                  <td style={{
                    padding: '16px',
                    textAlign: 'right',
                    borderBottom: '1px solid #e9ecef',
                    color: '#1a1a1a',
                    fontWeight: '500'
                  }}>
                    {formatCurrency(item.quantity * item.unitAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '40px'
        }}>
          <div style={{ width: '300px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #e9ecef'
            }}>
              <span style={{ color: '#666' }}>Subtotal:</span>
              <span style={{ fontWeight: '500' }}>{formatCurrency(subtotal)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #e9ecef'
            }}>
              <span style={{ color: '#666' }}>Tax (6.25%):</span>
              <span style={{ fontWeight: '500' }}>{formatCurrency(tax)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '16px 0',
              fontSize: '1.2rem',
              fontWeight: '700',
              color: '#7a6990'
            }}>
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {notes && (
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            marginBottom: '40px'
          }}>
            <h4 style={{
              fontSize: '1rem',
              margin: '0 0 12px 0',
              color: '#1a1a1a'
            }}>
              Notes:
            </h4>
            <p style={{ margin: '0', color: '#666', lineHeight: '1.6' }}>
              {notes}
            </p>
          </div>
        )}

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          padding: '20px',
          borderTop: '1px solid #e9ecef',
          marginTop: '40px'
        }}>
          <p style={{
            margin: '0',
            color: '#666',
            fontSize: '0.9rem'
          }}>
            Thank you for choosing Serene Spaces!
          </p>
          <p style={{
            margin: '8px 0 0 0',
            color: '#666',
            fontSize: '0.9rem'
          }}>
            Questions? Contact us at loveserenespaces@gmail.com or (815) 621-3509
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          marginTop: '40px'
        }}>
          <button
            onClick={onEdit}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#7a6990',
              border: '2px solid #7a6990',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Edit Invoice
          </button>
          <button
            onClick={onSend}
            disabled={sending}
            style={{
              padding: '12px 32px',
              backgroundColor: '#7a6990',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: sending ? 'not-allowed' : 'pointer',
              opacity: sending ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
          >
            {sending ? 'Sending...' : 'Send Invoice'}
          </button>
        </div>
      </div>
    </div>
  );
}
