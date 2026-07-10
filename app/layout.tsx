import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#006837" },
    { media: "(prefers-color-scheme: dark)", color: "#111815" }
  ],
};

export const metadata: Metadata = {
  title: "ইয়াসের খান চৌধুরী - মাননীয় প্রতিমন্ত্রী | তথ্য ও সম্প্রচার মন্ত্রণালয়",
  description: "শহীদ জিয়ার আদর্শে অনুপ্রাণিত হয়ে, আমরা নান্দাইলের মাটি ও মানুষের অধিকার রক্ষায় এবং একটি আধুনিক, তথ্যসমৃদ্ধ ও গণতান্ত্রিক বাংলাদেশ গড়ার লক্ষ্যে অঙ্গীকারবদ্ধ।",
  icons: {
    icon: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "YKC Portfolio",
  },
  applicationName: "YKC Portfolio",
  other: {
    "mobile-web-app-capable": "yes",
    "format-detection": "telephone=no",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          precedence="default"
        />
      </head>
      <body>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
