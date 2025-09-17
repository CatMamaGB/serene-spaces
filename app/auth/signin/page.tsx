"use client";

import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SignInContent() {
  const [providers, setProviders] = useState<Record<
    string,
    { id: string; name: string }
  > | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMethod, setLoginMethod] = useState<"email" | "google">("email");
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  useEffect(() => {
    const loadProviders = async () => {
      const providers = await getProviders();
      setProviders(providers);
    };
    loadProviders();

    // Hide navigation and override body styles
    const nav = document.querySelector('nav') as HTMLElement;
    const body = document.body;
    const rootDiv = document.querySelector('div[style*="min-height:100vh"]') as HTMLElement;
    
    if (nav) nav.style.display = 'none';
    if (body) {
      body.style.backgroundColor = 'transparent';
      body.style.margin = '0';
      body.style.padding = '0';
    }
    if (rootDiv) {
      rootDiv.style.backgroundColor = 'transparent';
      rootDiv.style.minHeight = '100vh';
    }

    // Cleanup function
    return () => {
      if (nav) nav.style.display = '';
      if (body) {
        body.style.backgroundColor = '';
        body.style.margin = '';
        body.style.padding = '';
      }
      if (rootDiv) {
        rootDiv.style.backgroundColor = '';
        rootDiv.style.minHeight = '';
      }
    };
  }, []);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else if (result?.ok) {
        window.location.href = callbackUrl;
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn("google", { callbackUrl });
    } catch (err) {
      setError("Google sign in failed. Please try again.");
      setIsLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "OAuthCallback":
        return "There was an issue with the authentication process. Please try again.";
      case "Configuration":
        return "There is a problem with the server configuration. Please contact support.";
      case "AccessDenied":
        return "You do not have permission to sign in.";
      case "Verification":
        return "The verification link has expired or has already been used.";
      case "Default":
      default:
        return "Please try again or contact support if the problem persists.";
    }
  };

  return (
    <div>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 16px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #0f172a 0%, #7c3aed 50%, #0f172a 100%)',
          minHeight: '100vh',
          width: '100vw',
          height: '100vh'
        }}
      >
      {/* Background Pattern */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(120,119,198,0.1), transparent 50%)'
        }}
      ></div>
      
      <div style={{
        position: 'relative',
        maxWidth: '512px',
        width: '100%',
        zIndex: 10
      }}>
        {/* Login Container */}
        <div 
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            width: '100%',
            maxWidth: '512px',
            margin: '0 auto'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ 
              fontSize: '30px', 
              fontWeight: 'bold', 
              color: 'white', 
              letterSpacing: '-0.025em',
              margin: '0 0 4px 0'
            }}>
              Serene Spaces
            </h1>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#c4b5fd',
              margin: '0 0 12px 0'
            }}>
              Admin Portal
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: '#d1d5db',
              margin: '0'
            }}>
              Sign in to access your business dashboard
            </p>
          </div>

          {/* Error Message */}
          {(error || searchParams.get("error")) && (
            <div style={{
              marginBottom: '24px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ display: 'flex' }}>
                <div style={{ flexShrink: 0 }}>
                  <svg
                    style={{ height: '20px', width: '20px', color: '#f87171' }}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div style={{ marginLeft: '12px' }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#fecaca',
                    margin: '0 0 8px 0'
                  }}>
                    Sign in failed
                  </h3>
                  <div style={{ fontSize: '14px', color: '#fca5a5' }}>
                    <p style={{ margin: 0 }}>{error || getErrorMessage(searchParams.get("error"))}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Login Form Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Login Method Toggle */}
            <div style={{ 
              display: 'flex', 
              borderRadius: '8px', 
              backgroundColor: 'rgba(255, 255, 255, 0.05)', 
              padding: '4px',
              marginBottom: '24px'
            }}>
              <button
                onClick={() => setLoginMethod("email")}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: loginMethod === "email" ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  color: loginMethod === "email" ? 'white' : '#d1d5db',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Email & Password
              </button>
              <button
                onClick={() => setLoginMethod("google")}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: loginMethod === "google" ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  color: loginMethod === "google" ? 'white' : '#d1d5db',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Google
              </button>
            </div>

            {/* Email/Password Form */}
            {loginMethod === "email" && (
              <form onSubmit={handleEmailSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label htmlFor="email" style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#e5e7eb', 
                    marginBottom: '8px' 
                  }}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none',
                      backdropFilter: 'blur(10px)'
                    }}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="password" style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#e5e7eb', 
                    marginBottom: '8px' 
                  }}>
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none',
                      backdropFilter: 'blur(10px)'
                    }}
                    placeholder="Enter your password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '12px 16px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '500',
                    borderRadius: '8px',
                    color: 'white',
                    backgroundColor: '#7c3aed',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.5 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isLoading ? (
                    <>
                      <svg
                        style={{
                          animation: 'spin 1s linear infinite',
                          marginRight: '12px',
                          height: '20px',
                          width: '20px',
                          color: 'white'
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          style={{ opacity: 0.25 }}
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          style={{ opacity: 0.75 }}
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            )}

            {/* Google Sign In */}
            {loginMethod === "google" && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  style={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '16px 24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderRadius: '12px',
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.5 : 1,
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    outline: 'none'
                  }}
                >
                  {isLoading ? (
                    <svg
                      style={{
                        animation: 'spin 1s linear infinite',
                        marginRight: '12px',
                        height: '24px',
                        width: '24px',
                        color: 'white'
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        style={{ opacity: 0.25 }}
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        style={{ opacity: 0.75 }}
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <span style={{
                      position: 'absolute',
                      left: '0',
                      top: '0',
                      bottom: '0',
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '24px'
                    }}>
                      <svg
                        style={{ height: '24px', width: '24px' }}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </span>
                  )}
                  {isLoading ? "Signing in..." : "Continue with Google"}
                </button>
              </div>
            )}

            {/* Help Section */}
            <div style={{ 
              paddingTop: '16px', 
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              marginTop: '24px'
            }}>
              <button
                onClick={() => setShowHelp(!showHelp)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  fontSize: '14px',
                  color: '#d1d5db',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#d1d5db';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <svg
                  style={{
                    width: '16px',
                    height: '16px',
                    marginRight: '8px',
                    transition: 'transform 0.2s ease',
                    transform: showHelp ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                Need help signing in?
              </button>
              
              {showHelp && (
                <div style={{
                  marginTop: '16px',
                  padding: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'white',
                    margin: '0 0 8px 0'
                  }}>
                    Sign-in Help
                  </h4>
                  <ul style={{
                    fontSize: '12px',
                    color: '#d1d5db',
                    margin: '0',
                    paddingLeft: '16px',
                    lineHeight: '1.5'
                  }}>
                    <li style={{ marginBottom: '4px' }}>• Use your admin email and password to sign in</li>
                    <li style={{ marginBottom: '4px' }}>• Or sign in with your Google account</li>
                    <li style={{ marginBottom: '4px' }}>• Make sure you have admin access permissions</li>
                    <li style={{ marginBottom: '4px' }}>• If you're having trouble, try clearing your browser cache</li>
                    <li>• Contact support if issues persist</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <div style={{ fontSize: '14px', color: '#9ca3af' }}>
            By signing in, you agree to our{" "}
            <a
              href="/terms"
              style={{
                fontWeight: '500',
                color: '#c4b5fd',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#a78bfa'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#c4b5fd'}
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              style={{
                fontWeight: '500',
                color: '#c4b5fd',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#a78bfa'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#c4b5fd'}
            >
              Privacy Policy
            </a>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #0f172a 0%, #7c3aed 50%, #0f172a 100%)',
          minHeight: '100vh',
          width: '100vw',
          height: '100vh'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{
            animation: 'spin 1s linear infinite',
            borderRadius: '50%',
            height: '48px',
            width: '48px',
            borderBottom: '2px solid white',
            margin: '0 auto 16px auto'
          }}></div>
          <div style={{ color: 'white', fontSize: '18px', fontWeight: '500' }}>Loading...</div>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}