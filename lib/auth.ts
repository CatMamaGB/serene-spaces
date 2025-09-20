import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

// Test database connection
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connection successful");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw new Error("Database connection failed");
  }
}

// Check if required environment variables are set
const requiredEnvVars = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
};

// For local development, override NEXTAUTH_URL if it's pointing to production
const isLocalDevelopment =
  process.env.NODE_ENV === "development" &&
  process.env.NEXTAUTH_URL?.includes("loveserenespaces.com");

if (isLocalDevelopment) {
  console.warn("⚠️  NEXTAUTH_URL is set to production URL in development mode");
  console.warn("   This will cause OAuth configuration errors");
  console.warn(
    "   Please set NEXTAUTH_URL=http://localhost:3000 for local development",
  );
}

const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error("❌ Missing required environment variables for NextAuth:");
  missingVars.forEach((key) => {
    console.error(`  ${key}: NOT SET`);
  });
  console.error(
    "Available variables:",
    Object.keys(process.env).filter(
      (key) =>
        key.includes("AUTH") ||
        key.includes("GOOGLE") ||
        key.includes("DATABASE"),
    ),
  );
  console.error("Current NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
  console.error(
    "Current DATABASE_URL:",
    process.env.DATABASE_URL ? "SET" : "NOT SET",
  );
  console.error("Environment check - NODE_ENV:", process.env.NODE_ENV);
  console.error("All environment keys:", Object.keys(process.env));

  // In production, throw an error to prevent startup with missing auth
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
  }
}

// Determine the correct base URL for the current environment
const getBaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  return process.env.NEXTAUTH_URL || "https://www.loveserenespaces.com";
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn(message) {
      console.log("✅ SignIn event:", {
        user: message.user?.email,
        account: message.account?.provider,
        isNewUser: message.isNewUser,
      });
      await testDatabaseConnection();
    },
    async signOut(message) {
      console.log("🚪 SignOut event:", {
        session: (message as any).session?.user?.email,
        token: (message as any).token?.email,
      });
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Admin account for loveserenespaces@gmail.com
          const adminEmail = "loveserenespaces@gmail.com";
          const adminPassword = "Spaces123"; // Updated password

          if (credentials.email === adminEmail) {
            // For demo purposes, we'll accept the password directly
            // In production, you'd hash the password and compare
            if (credentials.password === adminPassword) {
              // Check if admin user exists in database, create if not
              let user = await prisma.user.findUnique({
                where: { email: adminEmail },
              });

              if (!user) {
                user = await prisma.user.create({
                  data: {
                    email: adminEmail,
                    name: "Serene Spaces Admin",
                    role: "admin",
                  } as any,
                });
              }

              return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                role: (user as any).role,
              };
            }
          }

          return null;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log("SignIn callback triggered:", {
        userEmail: user?.email,
        provider: account?.provider,
        userId: user?.id,
        accountType: account?.type,
        accountProvider: account?.provider,
      });

      // Only allow sign in for loveserenespaces@gmail.com
      if (account?.provider === "google") {
        if (!user?.email) {
          console.error("No email found in Google OAuth user object");
          return false;
        }

        const isAuthorized = user.email === "loveserenespaces@gmail.com";
        console.log("Google OAuth authorization:", {
          email: user.email,
          authorized: isAuthorized,
          userObject: user,
        });

        if (!isAuthorized) {
          console.log("Access denied for email:", user.email);
        }

        return isAuthorized;
      }

      // Allow credentials provider (email/password) for admin
      if (account?.provider === "credentials") {
        console.log("Credentials provider authorization:", {
          email: user?.email,
          authorized: true,
        });
        return true;
      }

      console.log("Sign in denied for provider:", account?.provider);
      return false;
    },
    async session({ session, token }) {
      console.log("🔑 Session callback:", {
        sessionUser: session.user?.email,
        tokenSub: token.sub,
        tokenEmail: token.email,
        tokenRole: token.role,
      });

      // Ensure session has user ID from token
      if (session.user && token) {
        session.user.id = token.sub || (token.id as string);
        session.user.role = (token.role as string) || "staff";
      }

      console.log("🔑 Session callback result:", {
        sessionUser: session.user?.email,
        sessionUserId: session.user?.id,
        sessionUserRole: session.user?.role,
      });

      return session;
    },
    async jwt({ token, user }) {
      console.log("🎫 JWT callback:", {
        tokenSub: token.sub,
        tokenEmail: token.email,
        tokenRole: token.role,
        userEmail: user?.email,
        userId: user?.id,
        userRole: user?.role,
      });

      // Persist the user ID to the token right after signin
      if (user) {
        token.id = user.id;
        token.role = user.role || "staff";
        token.email = user.email;
      }

      console.log("🎫 JWT callback result:", {
        tokenSub: token.sub,
        tokenEmail: token.email,
        tokenRole: token.role,
        tokenId: token.id,
      });

      return token;
    },
    async redirect({ url, baseUrl }) {
      const correctBaseUrl = getBaseUrl();
      console.log("Redirect callback:", { url, baseUrl, correctBaseUrl });

      // If it's a relative URL, make it absolute
      if (url.startsWith("/")) {
        const redirectUrl = `${correctBaseUrl}${url}`;
        console.log("Redirecting to relative URL:", redirectUrl);
        return redirectUrl;
      }

      // If it's an absolute URL on the same origin, allow it
      try {
        const urlObj = new URL(url);
        if (urlObj.origin === correctBaseUrl) {
          console.log("Redirecting to same origin:", url);
          return url;
        }
      } catch (error) {
        console.error("Invalid URL in redirect:", error);
      }

      // Default to admin dashboard
      console.log("Default redirect to admin dashboard");
      return `${correctBaseUrl}/admin`;
    },
  },
  // Add error handling
  debug: process.env.NODE_ENV === "development",
  // Add custom pages
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});
