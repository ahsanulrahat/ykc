import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";

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
  metadataBase: new URL("https://yaserkhanchowdhury.com"),
  title: {
    default: "ইয়াসের খান চৌধুরী - মাননীয় প্রতিমন্ত্রী | তথ্য ও সম্প্রচার মন্ত্রণালয়",
    template: "%s | ইয়াসের খান চৌধুরী"
  },
  description: "ইয়াসের খান চৌধুরী — বাংলাদেশ সরকারের তথ্য ও সম্প্রচার মন্ত্রণালয়ের মাননীয় প্রতিমন্ত্রী এবং ময়মনসিংহ-৯ (নান্দাইল, ১৫৪ নং আসন) নির্বাচনী এলাকার সংসদ সদস্য। শহীদ জিয়ার আদর্শে অনুপ্রাণিত হয়ে গণতান্ত্রিক, তথ্যসমৃদ্ধ ও আধুনিক বাংলাদেশ গড়ার লক্ষ্যে অঙ্গীকারবদ্ধ।",
  keywords: [
    "ইয়াসের খান চৌধুরী",
    "Yaser Khan Chowdhury",
    "নান্দাইল",
    "Nandail",
    "ময়মনসিংহ-৯",
    "বিএনপি",
    "BNP",
    "তথ্য ও সম্প্রচার মন্ত্রণালয়",
    "প্রতিমন্ত্রী",
    "Deputy Minister Bangladesh",
    "Bangladesh",
    "১৫৪ নং আসন",
    "স্মার্ট নান্দাইল ভিশন",
    "Ministry of Information and Broadcasting",
    "Mymensingh 9"
  ],
  authors: [{ name: "Yaser Khan Chowdhury" }],
  creator: "Yaser Khan Chowdhury",
  publisher: "Yaser Khan Chowdhury",
  alternates: {
    canonical: "https://yaserkhanchowdhury.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: "https://yaserkhanchowdhury.com",
    siteName: "ইয়াসের খান চৌধুরী",
    title: "ইয়াসের খান চৌধুরী - মাননীয় প্রতিমন্ত্রী | তথ্য ও সম্প্রচার মন্ত্রণালয়",
    description: "ইয়াসের খান চৌধুরী — তথ্য ও সম্প্রচার মন্ত্রণালয়ের মাননীয় প্রতিমন্ত্রী। নান্দাইলের মাটি ও মানুষের অধিকার রক্ষায় এবং তথ্যসমৃদ্ধ গণতান্ত্রিক বাংলাদেশ গড়ার লক্ষ্যে অঙ্গীকারবদ্ধ।",
    images: [
      {
        url: "/assets/profile-hero.png",
        width: 1200,
        height: 630,
        alt: "ইয়াসের খান চৌধুরী - মাননীয় প্রতিমন্ত্রী",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ইয়াসের খান চৌধুরী - মাননীয় প্রতিমন্ত্রী",
    description: "নান্দাইলের মাটি ও মানুষের অধিকার রক্ষায় এবং তথ্যসমৃদ্ধ গণতান্ত্রিক বাংলাদেশ গড়ার লক্ষ্যে অঙ্গীকারবদ্ধ।",
    images: ["/assets/profile-hero.png"],
  },
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

// JSON-LD structured data for Person/PoliticalPerson
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "ইয়াসের খান চৌধুরী",
  alternateName: "Yaser Khan Chowdhury",
  url: "https://yaserkhanchowdhury.com",
  image: "https://yaserkhanchowdhury.com/assets/profile-hero.png",
  jobTitle: "মাননীয় প্রতিমন্ত্রী, তথ্য ও সম্প্রচার মন্ত্রণালয়",
  worksFor: {
    "@type": "GovernmentOrganization",
    name: "তথ্য ও সম্প্রচার মন্ত্রণালয়, গণপ্রজাতন্ত্রী বাংলাদেশ সরকার",
    url: "https://moi.gov.bd",
  },
  memberOf: {
    "@type": "PoliticalParty",
    name: "বাংলাদেশ জাতীয়তাবাদী দল (বিএনপি)",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "নান্দাইল, ময়মনসিংহ",
    addressCountry: "BD",
  },
  sameAs: [
    "https://www.facebook.com/Nandailykc",
  ],
  description: "ময়মনসিংহ-৯ (নান্দাইল, ১৫৪ নং আসন) নির্বাচনী এলাকার সংসদ সদস্য এবং তথ্য ও সম্প্রচার মন্ত্রণালয়ের মাননীয় প্রতিমন্ত্রী।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Font Awesome — DNS prefetch + preconnect + stylesheet */}
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          precedence="default"
        />
        {/* Google Fonts preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Bangla font preconnect + preload */}
        <link rel="preconnect" href="https://fonts.maateen.me" />
        <link rel="dns-prefetch" href="https://fonts.maateen.me" />
      </head>
      <body>
        <ThemeProvider>
          <ScrollProgress />
          <Header />
          <main>{children}</main>
          <Footer />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
