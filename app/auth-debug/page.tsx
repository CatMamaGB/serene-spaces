"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function AuthDebug() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("🔍 Auth Debug - Session Status:", status);
    console.log("🔍 Auth Debug - Session Data:", session);
  }, [session, status]);

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Debug</h1>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Status:</h2>
          <p className="text-gray-600">{status}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Session:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold">User Email:</h2>
          <p className="text-gray-600">
            {session?.user?.email || "Not logged in"}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">User ID:</h2>
          <p className="text-gray-600">
            {session?.user?.id || "Not available"}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">User Role:</h2>
          <p className="text-gray-600">
            {session?.user?.role || "Not available"}
          </p>
        </div>
      </div>
    </div>
  );
}
