/**
 * Authentication Layout
 * Clean architecture: Layout khusus untuk halaman authentication
 * Tidak menggunakan DashboardLayout karena ini adalah jembatan untuk mendapatkan token
 */

import type { Metadata } from "next";
import ThemeProvider from "@/components/dashboard/ThemeProvider";

export const metadata: Metadata = {
  title: "Authentication - Perencanaan",
  description: "Authentication page",
};

export default function AuthenticationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
