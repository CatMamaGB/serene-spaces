-- Safe to run on production: creates the table only if it does not exist (no data loss).
-- After this succeeds, mark the migration as applied (see scripts/prisma-without-reset.txt).

CREATE TABLE IF NOT EXISTS "ContactInquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactInquiry_pkey" PRIMARY KEY ("id")
);
