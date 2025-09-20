import type { ReactNode } from "react";
import AdminNavigation from "./components/AdminNavigation";

// Server-side configuration for all admin routes
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminNavigation>{children}</AdminNavigation>;
}
