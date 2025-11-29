import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Ultra-Modern Resume Builder",
  description: "Create stunning resumes using modern templates, download as PDF, and manage your profile effortlessly.",
  keywords: ["resume", "cv", "job", "builder", "template", "pdf", "career", "professional"],
  authors: [{ name: "Resume Builder Team" }],
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Ultra-Modern Resume Builder",
    description: "Create stunning resumes with templates, downloads and customization.",
    url: "https://resume-builder.ultra-modern.com",
    siteName: "ResumeBuilder",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
