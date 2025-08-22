"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GmailSetupPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if we just completed the OAuth flow
    const connected = searchParams.get("connected");
    if (connected === "1") {
      setIsConnected(true);
    }
  }, [searchParams]);

  const startOAuth2Setup = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Redirect to the start route which will redirect to Google
      window.location.href = "/api/auth/gmail/start";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const copyRefreshTokenInstructions = () => {
    const instructions = `1. Complete the OAuth2 setup above
2. Check your server logs for the refresh token
3. Add it to your environment variables:
   GMAIL_REFRESH_TOKEN="your_token_here"
4. Restart your server and test email functionality`;

    navigator.clipboard.writeText(instructions);
    alert("Instructions copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Gmail OAuth2 Setup
          </h1>

          {!isConnected ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                This will set up secure Gmail access using OAuth2. You&apos;ll
                need to authorize Serene Spaces to send emails on your behalf.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="font-medium text-blue-900 mb-2">
                  Prerequisites:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Google Cloud Project with Gmail API enabled</li>
                  <li>• OAuth2 client ID and client secret</li>
                  <li>• Redirect URI configured in Google Cloud</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h3 className="font-medium text-yellow-900 mb-2">Important:</h3>
                <p className="text-sm text-yellow-800">
                  Make sure your Google Cloud OAuth2 client has these redirect
                  URIs:
                </p>
                <ul className="text-sm text-yellow-800 mt-2 space-y-1">
                  <li>
                    •{" "}
                    <code className="bg-yellow-100 px-1 rounded">
                      http://localhost:3000/api/auth/callback/google
                    </code>
                  </li>
                  <li>
                    •{" "}
                    <code className="bg-yellow-100 px-1 rounded">
                      https://www.loveserenespaces.com/api/auth/callback/google
                    </code>
                  </li>
                </ul>
              </div>

              <button
                onClick={startOAuth2Setup}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Starting..." : "Connect Gmail Account"}
              </button>
            </div>
          ) : (
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
                    <li>Check your server logs for the refresh token</li>
                    <li>Add it to your environment variables</li>
                    <li>Restart your server</li>
                    <li>Test the email functionality</li>
                  </ol>
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    onClick={copyRefreshTokenInstructions}
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Copy Instructions
                  </button>

                  <button
                    onClick={() => router.push("/admin")}
                    className="block w-full text-blue-600 hover:text-blue-800 underline"
                  >
                    Return to Admin Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
