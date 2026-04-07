import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/components/ui/ToastContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://auraix.entrext.com'),
  title: "Auraix — Your Digital Aura, Powered by AI.",
  description:
    "Create a stunning link-in-bio page in seconds. Powered by AI, designed for creators.",
  keywords: ["link in bio", "auraix", "link page", "social links", "ai bio generator", "entrext labs"],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Auraix — Your Digital Aura, Powered by AI.",
    description: "Create a stunning link-in-bio page in seconds. Powered by AI, designed for creators.",
    url: 'https://auraix.entrext.com',
    siteName: 'Auraix',
    images: [
      {
        url: '/logo.png', // Ideally a dedicated OG image should be used
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Auraix — Your Digital Aura, Powered by AI.",
    description: "Create a stunning link-in-bio page in seconds. Powered by AI, designed for creators.",
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Auraix',
    url: 'https://auraix.entrext.com',
    logo: 'https://auraix.entrext.com/logo.png',
    sameAs: [
      'https://www.instagram.com/entrext.labs/',
      'http://linkedin.com/company/entrext/',
    ],
  };

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body className={`${inter.variable} ${inter.className}`} suppressHydrationWarning>
          <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
