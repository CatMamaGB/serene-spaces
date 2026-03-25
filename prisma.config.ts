import "dotenv/config";
import { defineConfig } from "prisma/config";

// Database URL stays in prisma/schema.prisma (env("DATABASE_URL")).
// Omit datasource here so the config loads without DATABASE_URL (e.g. CI validate).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
