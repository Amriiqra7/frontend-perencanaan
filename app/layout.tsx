import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import ThemeProvider from "@/components/dashboard/ThemeProvider";
import ConditionalDashboardLayout from "@/components/dashboard/ConditionalDashboardLayout";
import ToastProviderWrapper from "@/components/providers/ToastProviderWrapper";
import { Suspense } from "react";
import Loading from "./loading";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard - Perencanaan",
  description: "Dashboard aplikasi perencanaan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body
        className="antialiased"
      >
        <Suspense fallback={<Loading />}>
          <ThemeProvider>
            <ToastProviderWrapper>
              <ConditionalDashboardLayout>
                {children}
              </ConditionalDashboardLayout>
            </ToastProviderWrapper>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
