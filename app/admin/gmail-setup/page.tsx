"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GmailSetupPage() {
  const [step, setStep] = useState<
    "initial" | "authorizing" | "complete" | "error"
  >("initial");
  const [authUrl, setAuthUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [tokens, setTokens] = useState<{
    refresh_token?: string;
    access_token?: string;
    scope?: string;
    token_type?: string;
    expiry_date?: number;
  } | null>(null);
  const router = useRouter();

  const startOAuth2Setup = async () => {
    try {
      setStep("authorizing");
      setError("");

      const response = await fetch("/api/auth/gmail-setup");
      const data = await response.json();

      if (data.success) {
        setAuthUrl(data.authUrl);
        // Open the authorization URL in a new window
        window.open(data.authUrl, "_blank", "width=600,height=700");
      } else {
        throw new Error(data.error || "Failed to get authorization URL");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setStep("error");
    }
  };

  const handleAuthorizationCode = async (code: string) => {
    try {
      const response = await fetch("/api/auth/gmail-setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.success) {
        setTokens(data.tokens);
        setStep("complete");
      } else {
        throw new Error(data.error || "Failed to exchange authorization code");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setStep("error");
    }
  };

  const copyRefreshToken = () => {
    if (tokens?.refresh_token) {
      navigator.clipboard.writeText(tokens.refresh_token);
      alert(
        "Refresh token copied to clipboard! Add it to your .env.local file.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Gmail OAuth2 Setup
          </h1>

          {step === "initial" && (
            <div className="space-y-4">
              <p className="text-gray-600">
                This will set up secure Gmail access using OAuth2 instead of app
                passwords. You&apos;ll need to authorize Serene Spaces to send
                emails on your behalf.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="font-medium text-blue-900 mb-2">
                  Prerequisites:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Google Cloud Project with Gmail API enabled</li>
                  <li>• OAuth2 client ID and client secret</li>
                  <li>• Redirect URI configured</li>
                </ul>
              </div>

              <button
                onClick={startOAuth2Setup}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Start OAuth2 Setup
              </button>
            </div>
          )}

          {step === "authorizing" && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Authorization in Progress
                </h3>
                <p className="text-gray-600 mb-4">
                  A new window should have opened for Google authorization.
                  Complete the authorization and return here.
                </p>

                {authUrl && (
                  <div className="bg-gray-50 rounded-md p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      If the window didn&apos;t open, click this link:
                    </p>
                    <a
                      href={authUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {authUrl}
                    </a>
                  </div>
                )}

                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">
                    After authorization, you&apos;ll get a code. Enter it here:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter authorization code"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          const code = (e.target as HTMLInputElement).value;
                          if (code) handleAuthorizationCode(code);
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.querySelector(
                          'input[placeholder="Enter authorization code"]',
                        ) as HTMLInputElement;
                        if (input?.value) handleAuthorizationCode(input.value);
                      }}
                      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === "complete" && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  OAuth2 Setup Complete!
                </h3>

                <div className="bg-green-50 border border-green-200 rounded-md p-4 text-left">
                  <h4 className="font-medium text-green-900 mb-2">
                    Next Steps:
                  </h4>
                  <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
                    <li>Copy the refresh token below</li>
                    <li>Add it to your .env.local file</li>
                    <li>Restart your development server</li>
                    <li>Test the email functionality</li>
                  </ol>
                </div>

                <div className="mt-4">
                  <button
                    onClick={copyRefreshToken}
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Copy Refresh Token
                  </button>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => router.push("/admin")}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Return to Admin Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === "error" && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Setup Failed
                </h3>

                <p className="text-red-600 mb-4">{error}</p>

                <button
                  onClick={() => setStep("initial")}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
