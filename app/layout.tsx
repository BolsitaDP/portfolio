import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Shippori_Mincho, Yuji_Boku } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: [ "latin" ],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: [ "latin" ],
});

const shipporiMincho = Shippori_Mincho({
  variable: "--font-shippori-mincho",
  weight: "400",
  subsets: [ "latin" ],
});

const yujiBoku = Yuji_Boku({
  variable: "--font-yuji-boku",
  weight: "400",
  subsets: [ "latin" ],
});

const siteUrl = "https://bolsitadp.github.io/portfolio/";
const title = "Santiago Giraldo - Web & Mobile Developer";
const description =
  "Web & Mobile Developer in Manizales, Colombia, building production apps with React, React Native and Next.js.";
const shareImage = {
  url: "og.png",
  width: 1200,
  height: 630,
  alt: "Santiago Giraldo — Web & Mobile Developer",
  type: "image/png",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Santiago Giraldo",
    title,
    description,
    locale: "es_CO",
    alternateLocale: [ "en_US" ],
    images: [ shareImage ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ shareImage ],
  },
  other: { "darkreader-lock": "true" },
};

// Browser chrome follows the washi and sumi backgrounds from app/globals.css.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f0e7" },
    { media: "(prefers-color-scheme: dark)", color: "#171310" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${shipporiMincho.variable} ${yujiBoku.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
