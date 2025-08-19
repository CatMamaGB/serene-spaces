'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    setIsSubmitting(false);
    
    // In a real app, you would send this data to your backend
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '3rem 1rem'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '3.5rem 2.5rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h1 style={{
            color: '#7a6990',
            fontSize: '2.75rem',
            fontWeight: '700',
            marginBottom: '1.25rem',
            letterSpacing: '-0.025em',
            lineHeight: '1.2'
          }}>
            Contact Us
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1.125rem',
            lineHeight: '1.7',
            maxWidth: '480px',
            margin: '0 auto'
          }}>
            Have a question or need our services? Send us a message and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          {/* Name Field */}
          <div>
            <label htmlFor="name" style={{
              display: 'block',
              color: '#374151',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.75rem',
              letterSpacing: '0.025em'
            }}>
              Full Name *
            </label>
                         <input
               type="text"
               id="name"
               name="name"
               value={formData.name}
               onChange={handleInputChange}
               required
               style={{
                 width: '100%',
                 padding: '1rem 1.25rem',
                 border: '1px solid #e5e7eb',
                 borderRadius: '10px',
                 fontSize: '1rem',
                 transition: 'all 0.2s ease',
                 boxSizing: 'border-box',
                 backgroundColor: 'white',
                 color: '#374151',
                 lineHeight: '1.5'
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

          {/* Email Field */}
          <div>
            <label htmlFor="email" style={{
              display: 'block',
              color: '#374151',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.75rem',
              letterSpacing: '0.025em'
            }}>
              Email Address *
            </label>
                         <input
               type="email"
               id="email"
               name="email"
               value={formData.email}
               onChange={handleInputChange}
               required
               style={{
                 width: '100%',
                 padding: '1rem 1.25rem',
                 border: '1px solid #e5e7eb',
                 borderRadius: '10px',
                 fontSize: '1rem',
                 transition: 'all 0.2s ease',
                 boxSizing: 'border-box',
                 backgroundColor: 'white',
                 color: '#374151',
                 lineHeight: '1.5'
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

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" style={{
              display: 'block',
              color: '#374151',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.75rem',
              letterSpacing: '0.025em'
            }}>
              Phone Number
            </label>
                         <input
               type="tel"
               id="phone"
               name="phone"
               value={formData.phone}
               onChange={handleInputChange}
               style={{
                 width: '100%',
                 padding: '1rem 1.25rem',
                 border: '1px solid #e5e7eb',
                 borderRadius: '10px',
                 fontSize: '1rem',
                 transition: 'all 0.2s ease',
                 boxSizing: 'border-box',
                 backgroundColor: 'white',
                 color: '#374151',
                 lineHeight: '1.5'
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

          {/* Message Field */}
          <div>
            <label htmlFor="message" style={{
              display: 'block',
              color: '#374151',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.75rem',
              letterSpacing: '0.025em'
            }}>
              Message *
            </label>
                         <textarea
               id="message"
               name="message"
               value={formData.message}
               onChange={handleInputChange}
               required
               rows={5}
               style={{
                 width: '100%',
                 padding: '1rem 1.25rem',
                 border: '1px solid #e5e7eb',
                 borderRadius: '10px',
                 fontSize: '1rem',
                 transition: 'all 0.2s ease',
                 resize: 'vertical',
                 fontFamily: 'inherit',
                 boxSizing: 'border-box',
                 backgroundColor: 'white',
                 color: '#374151',
                 lineHeight: '1.5'
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

                     {/* Submit Button */}
           <button
             type="submit"
             disabled={isSubmitting}
             style={{
               backgroundColor: '#7a6990',
               color: 'white',
               border: 'none',
               borderRadius: '12px',
               padding: '1.25rem 2.5rem',
               fontSize: '1.1rem',
               fontWeight: '600',
               cursor: isSubmitting ? 'not-allowed' : 'pointer',
               transition: 'all 0.3s ease',
               marginTop: '1.5rem',
               opacity: isSubmitting ? 0.7 : 1,
               boxShadow: '0 4px 12px rgba(122, 105, 144, 0.2)'
             }}
             onMouseEnter={(e) => {
               if (!isSubmitting) {
                 e.currentTarget.style.backgroundColor = '#5f4b6a';
                 e.currentTarget.style.transform = 'translateY(-2px)';
                 e.currentTarget.style.boxShadow = '0 6px 20px rgba(122, 105, 144, 0.3)';
               }
             }}
             onMouseLeave={(e) => {
               if (!isSubmitting) {
                 e.currentTarget.style.backgroundColor = '#7a6990';
                 e.currentTarget.style.transform = 'translateY(0)';
                 e.currentTarget.style.boxShadow = '0 4px 12px rgba(122, 105, 144, 0.2)';
               }
             }}
           >
             {isSubmitting ? 'Sending...' : 'Send Message'}
           </button>
        </form>

                 {/* Contact Info */}
         <div style={{
           marginTop: '4rem',
           paddingTop: '3rem',
           borderTop: '1px solid #f3f4f6',
           textAlign: 'center'
         }}>
           <p style={{
             color: '#6b7280',
             fontSize: '1rem',
             marginBottom: '1.5rem',
             fontWeight: '500'
           }}>
             Prefer to call or email directly?
           </p>
           <div style={{
             display: 'flex',
             justifyContent: 'center',
             gap: '3rem',
             flexWrap: 'wrap'
           }}>
             <div>
               <p style={{
                 color: '#7a6990',
                 fontWeight: '700',
                 margin: '0 0 0.5rem 0',
                 fontSize: '1rem'
               }}>
                 Phone
               </p>
               <p style={{
                 color: '#6b7280',
                 margin: '0',
                 fontSize: '1.1rem'
               }}>
                 (555) 123-4567
               </p>
             </div>
                         <div>
              <p style={{
                color: '#7a6990',
                fontWeight: '700',
                margin: '0 0 0.5rem 0',
                fontSize: '1rem'
              }}>
                Email
              </p>
              <p style={{
                color: '#6b7280',
                margin: '0',
                fontSize: '1.1rem'
              }}>
                loveserenespaces@gmail.com
              </p>
            </div>
          </div>
          
          {/* Social Media Links */}
          <div style={{
            marginTop: '2.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid #f3f4f6',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#7a6990',
              fontWeight: '700',
              margin: '0 0 1rem 0',
              fontSize: '1rem'
            }}>
              Follow Us
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <a 
                href="https://instagram.com/loveserenespaces" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: '#7a6990',
                  textDecoration: 'none',
                  fontSize: '1.5rem',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '2px solid #e2e8f0'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#E4405F';
                  e.currentTarget.style.backgroundColor = 'rgba(228, 64, 95, 0.1)';
                  e.currentTarget.style.borderColor = '#E4405F';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#7a6990';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
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
                  color: '#7a6990',
                  textDecoration: 'none',
                  fontSize: '1.5rem',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '2px solid #e2e8f0'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#1877F2';
                  e.currentTarget.style.backgroundColor = 'rgba(24, 119, 242, 0.1)';
                  e.currentTarget.style.borderColor = '#1877F2';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#7a6990';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                title="Follow us on Facebook"
              >
                📘
              </a>
              <a 
                href="mailto:loveserenespaces@gmail.com"
                style={{
                  color: '#7a6990',
                  textDecoration: 'none',
                  fontSize: '1.5rem',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '2px solid #e2e8f0'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#EA4335';
                  e.currentTarget.style.backgroundColor = 'rgba(234, 67, 53, 0.1)';
                  e.currentTarget.style.borderColor = '#EA4335';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#7a6990';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                title="Email us directly"
              >
                ✉️
              </a>
            </div>
            <p style={{
              color: '#6b7280',
              fontSize: '0.9rem',
              margin: '0'
            }}>
              @loveserenespaces • loveserenespaces.com
            </p>
          </div>
         </div>
      </div>
    </div>
  );
}
