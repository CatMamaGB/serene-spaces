import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { logger } from "./logger";
import { getResolvedDatabaseUrl } from "./env-server";

/** Email allowed for credentials sign-in (default: production admin inbox). */
const adminEmail =
  process.env.ADMIN_EMAIL?.trim() || "loveserenespaces@gmail.com";

/** Auth.js accepts NEXTAUTH_SECRET or AUTH_SECRET; Vercel often only sets AUTH_SECRET. */
function getAuthSecret(): string | undefined {
  const s =
    process.env.NEXTAUTH_SECRET?.trim() || process.env.AUTH_SECRET?.trim();
  return s || undefined;
}

// Test database connection
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    logger.debug("Database connection successful");
  } catch (error) {
    logger.errorFrom("Database connection test", error);
    throw new Error("Database connection failed");
  }
}

// Check if required environment variables are set
const requiredEnvVars = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_OR_AUTH_SECRET: getAuthSecret(),
  /** Any of PRISMA_DATABASE_URL | DATABASE_URL | POSTGRES_URL (see lib/env-server.ts) */
  DATABASE_URL: getResolvedDatabaseUrl(),
};

// For local development, override NEXTAUTH_URL if it's pointing to production
const isLocalDevelopment =
  process.env.NODE_ENV === "development" &&
  process.env.NEXTAUTH_URL?.includes("loveserenespaces.com");

if (isLocalDevelopment) {
  logger.warn(
    "NEXTAUTH_URL points at production in development; set NEXTAUTH_URL=http://localhost:3000 for local OAuth",
  );
}

const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  logger.error(
    "Missing required environment variables for NextAuth (set NEXTAUTH_SECRET or AUTH_SECRET, plus the others below):",
    missingVars.join(", "),
  );
  missingVars.forEach((key) => logger.error(`  ${key}: NOT SET`));
  logger.debug(
    "Auth-related env key names present:",
    Object.keys(process.env).filter(
      (key) =>
        key.includes("AUTH") ||
        key.includes("GOOGLE") ||
        key.includes("DATABASE"),
    ),
  );
  logger.debug("NEXTAUTH_URL set:", !!process.env.NEXTAUTH_URL);
  logger.debug(
    "Database URL set (PRISMA_DATABASE_URL | DATABASE_URL | POSTGRES_URL):",
    !!getResolvedDatabaseUrl(),
  );
  logger.debug("NODE_ENV:", process.env.NODE_ENV);

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
  return process.env.NEXTAUTH_URL || "https://loveserenespaces.com";
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  secret: getAuthSecret(),
  events: {
    async signIn(message) {
      logger.debug("SignIn event:", {
        user: message.user?.email,
        account: message.account?.provider,
        isNewUser: message.isNewUser,
      });
      await testDatabaseConnection();
    },
    async signOut(message) {
      logger.debug("SignOut event:", {
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
          if (String(credentials.email).trim() !== adminEmail) {
            return null;
          }

          const hash = process.env.ADMIN_PASSWORD_HASH?.trim();
          if (!hash) {
            if (process.env.NODE_ENV === "production") {
              logger.error(
                "ADMIN_PASSWORD_HASH is not set; credentials login is disabled. Set a bcrypt hash in env or use Google sign-in.",
              );
            } else {
              logger.warn(
                "ADMIN_PASSWORD_HASH not set; credentials login disabled. Generate: node scripts/hash-admin-password.mjs",
              );
            }
            return null;
          }

          const passwordOk = await bcrypt.compare(
            String(credentials.password),
            hash,
          );
          if (!passwordOk) {
            return null;
          }

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
        } catch (error) {
          logger.errorFrom("Credentials authorize", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      logger.debug("SignIn callback:", {
        userEmail: user?.email,
        provider: account?.provider,
        userId: user?.id,
      });

      // Only allow sign in for loveserenespaces@gmail.com
      if (account?.provider === "google") {
        if (!user?.email) {
          logger.error("No email found in Google OAuth user object");
          return false;
        }

        const isAuthorized = user.email === adminEmail;
        logger.debug("Google OAuth authorization:", {
          email: user.email,
          authorized: isAuthorized,
        });

        if (!isAuthorized) {
          logger.debug("Access denied for email:", user.email);
        }

        return isAuthorized;
      }

      // Allow credentials provider (email/password) for admin
      if (account?.provider === "credentials") {
        logger.debug("Credentials provider authorized:", user?.email);
        return true;
      }

      logger.debug("Sign in denied for provider:", account?.provider);
      return false;
    },
    async session({ session, token }) {
      logger.debug("Session callback:", {
        sessionUser: session.user?.email,
        tokenSub: token.sub,
        tokenRole: token.role,
      });

      // Ensure session has user ID from token
      if (session.user && token) {
        session.user.id = token.sub || (token.id as string);
        session.user.role = (token.role as string) || "staff";
      }

      logger.debug("Session callback result:", {
        sessionUserId: session.user?.id,
        sessionUserRole: session.user?.role,
      });

      return session;
    },
    async jwt({ token, user }) {
      logger.debug("JWT callback:", {
        tokenSub: token.sub,
        userId: user?.id,
      });

      // Persist the user ID to the token right after signin
      if (user) {
        token.id = user.id;
        token.role = user.role || "staff";
        token.email = user.email;
      }

      // Primary admin inbox always gets admin role (matches Google OAuth allowlist)
      const tokenEmail = (user?.email || token.email) as string | undefined;
      if (tokenEmail === adminEmail) {
        token.role = "admin";
      }

      logger.debug("JWT callback result:", { tokenSub: token.sub, tokenRole: token.role });

      return token;
    },
    async redirect({ url, baseUrl }) {
      const correctBaseUrl = getBaseUrl();
      logger.debug("Redirect callback:", { url, baseUrl, correctBaseUrl });

      // If it's a relative URL, make it absolute
      if (url.startsWith("/")) {
        const redirectUrl = `${correctBaseUrl}${url}`;
        logger.debug("Redirecting to relative URL:", redirectUrl);
        return redirectUrl;
      }

      // If it's an absolute URL on the same origin, allow it
      try {
        const urlObj = new URL(url);
        if (urlObj.origin === correctBaseUrl) {
          logger.debug("Redirecting to same origin:", url);
          return url;
        }
      } catch (error) {
        logger.errorFrom("Invalid URL in redirect", error);
      }

      logger.debug("Default redirect to admin dashboard");
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
