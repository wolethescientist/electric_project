import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import PerformanceMonitoring from "@/components/PerformanceMonitoring";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "NEMSA Electric Meter Portal",
  description: "Nigerian Electricity Management Services Agency (NEMSA) - Safety, Quality and Efficient Service Delivery. Monitor and manage electrical installations, meters and instruments compliance in Nigeria.",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NEMSA Portal"
  },
  icons: {
    icon: [
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/icon-152x152.png", sizes: "152x152", type: "image/png" }
    ]
  },
  keywords: ["NEMSA", "Nigerian Electricity Management Services Agency", "electric meter", "electrical installations", "regulation", "compliance", "monitoring", "dashboard", "analytics", "Nigeria", "NESI"],
  authors: [{ name: "Nigerian Electricity Management Services Agency (NEMSA)" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: process.env.NEXT_PUBLIC_DOMAIN || 'https://nemsa-portal.gov.ng',
    title: 'NEMSA Electric Meter Portal',
    description: 'Nigerian Electricity Management Services Agency - Safety, Quality and Efficient Service Delivery',
    siteName: 'NEMSA Electric Meter Portal',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEMSA Electric Meter Portal',
    description: 'Nigerian Electricity Management Services Agency - Safety, Quality and Efficient Service Delivery',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Layout>{children}</Layout>
        <ServiceWorkerRegistration />
        <PerformanceMonitoring />
      </body>
    </html>
  );
}
