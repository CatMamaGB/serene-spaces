#!/usr/bin/env node
/**
 * Generate bcrypt hash for ADMIN_PASSWORD_HASH (NextAuth credentials provider).
 * Usage: node scripts/hash-admin-password.mjs "your-secret-password"
 */
import bcrypt from "bcryptjs";

const pwd = process.argv[2];
if (!pwd) {
  console.error('Usage: node scripts/hash-admin-password.mjs "<password>"');
  process.exit(1);
}

console.log(bcrypt.hashSync(pwd, 12));
