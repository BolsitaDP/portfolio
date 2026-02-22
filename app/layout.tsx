import type { Metadata } from "next";
import { Geist, Geist_Mono, Yuji_Boku } from "next/font/google";
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

const yujiBoku = Yuji_Boku({
  variable: "--font-yuji-boku",
  weight: "400",
  subsets: [ "latin" ],
});

export const metadata: Metadata = {
  title: "Santiago Giraldo - Web & Mobile Developer",
  description: "Santiago Giraldo's web development portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${yujiBoku.variable} antialiased`}
      >
        <I18nProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </I18nProvider>
      </body>
    </html>
  );
}
