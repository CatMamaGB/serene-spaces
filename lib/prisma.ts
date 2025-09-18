import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Use PRISMA_DATABASE_URL if available (Accelerate), otherwise fall back to DATABASE_URL
const getDatabaseUrl = () => {
  return process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    errorFormat: "pretty",
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
