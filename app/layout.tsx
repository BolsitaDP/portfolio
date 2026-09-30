import type { Metadata } from "next";
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
  weight: [ "400", "500", "600" ],
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
  other: { "darkreader-lock": "true" },
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
