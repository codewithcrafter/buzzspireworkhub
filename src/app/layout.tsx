import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BuzzSpire WorkHub — Employee Attendance & Workplace Management",
    template: "%s | BuzzSpire WorkHub",
  },
  description: "Enterprise SaaS platform for employee attendance tracking, leave requests, department operations, and workforce administration.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 font-sans text-slate-900 selection:bg-indigo-600 selection:text-white">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
