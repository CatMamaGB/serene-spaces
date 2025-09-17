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
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn() {
      await testDatabaseConnection();
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
        },
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

            try {
              // Admin account for loveserenespaces@gmail.com
              const adminEmail = "loveserenespaces@gmail.com";
              const adminPassword = "admin123"; // In production, use environment variable
              
              if (credentials.email === adminEmail) {
                // For demo purposes, we'll accept the password directly
                // In production, you'd hash the password and compare
                if (credentials.password === adminPassword) {
                  return {
                    id: "admin",
                    email: adminEmail,
                    name: "Serene Spaces Admin",
                    image: null,
                  };
                }
              }
          
          return null;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      }
    }),
  ],
        callbacks: {
          async signIn({ user, account, profile }) {
            console.log("SignIn callback triggered:", { 
              userEmail: user?.email, 
              provider: account?.provider,
              userId: user?.id 
            });
            
            // Only allow sign in for loveserenespaces@gmail.com
            if (account?.provider === "google") {
              const isAuthorized = user.email === "loveserenespaces@gmail.com";
              console.log("Google OAuth authorization:", { 
                email: user.email, 
                authorized: isAuthorized 
              });
              return isAuthorized;
            }
            
            // Allow credentials provider (email/password) for admin
            if (account?.provider === "credentials") {
              console.log("Credentials provider authorization:", { 
                email: user?.email, 
                authorized: true 
              });
              return true;
            }
            
            console.log("Sign in denied for provider:", account?.provider);
            return false;
          },
    async session({ session, user }) {
      // Ensure session has user ID
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
          async redirect({ url, baseUrl }) {
            console.log("Redirect callback:", { url, baseUrl });
            
            // Allows relative callback URLs
            if (url.startsWith("/")) {
              const redirectUrl = `${baseUrl}${url}`;
              console.log("Redirecting to:", redirectUrl);
              return redirectUrl;
            }
            
            // Allows callback URLs on the same origin
            try {
              const urlObj = new URL(url);
              if (urlObj.origin === baseUrl) {
                console.log("Redirecting to same origin:", url);
                return url;
              }
            } catch (error) {
              console.error("Invalid URL in redirect:", error);
            }
            
            console.log("Default redirect to baseUrl:", baseUrl);
            return baseUrl;
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
