import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { NavDrawerProvider } from "@/components/layout/NavDrawerContext";
import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Garage CRM",
  description: "Garage management system MVP",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-full min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <NavDrawerProvider>
          <Sidebar />
          <MobileNavDrawer />
          <div className="flex min-w-0 flex-1 flex-col">{children}</div>
        </NavDrawerProvider>
      </body>
    </html>
  );
}
