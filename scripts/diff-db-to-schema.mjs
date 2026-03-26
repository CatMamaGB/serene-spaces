import "dotenv/config";
import { execSync } from "node:child_process";

const url =
  process.env.PRISMA_DATABASE_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const out = execSync(
  `npx prisma migrate diff --from-url ${JSON.stringify(url)} --to-schema-datamodel prisma/schema.prisma --script`,
  { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
);
console.log(out || "(empty diff — database already matches schema.prisma)");
