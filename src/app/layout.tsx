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
  title: "Auraix — Your Digital Aura, Powered by AI.",
  description:
    "Create a stunning link-in-bio page in seconds. Powered by AI, designed for creators.",
  keywords: ["link in bio", "auraix", "link page", "social links", "ai bio generator"],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
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
