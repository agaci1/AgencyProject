import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
// import Script from "next/script"; // ✅ Import Script
import "./globals.css";
import { SessionManager } from "@/components/session-manager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RILINDI SHPK - Best Travel Agency in Albania",
  description: "Discover the natural beauty and rich culture of the Albanian Alps through our authentic tours. Best travel agency in Albania for unforgettable experiences.",
  keywords: "Albania travel, Albanian Alps, Koman ferry, Valbonë, Fierza, Tirana tours, best travel agency Albania",
  authors: [{ name: "RILINDI SHPK" }],
  metadataBase: new URL('https://rilindishpk.com'),
  alternates: {
    canonical: '/',
  },
  applicationName: "RILINDI SHPK",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo1122.JPG', type: 'image/jpeg' },
      { url: '/logo1122.JPG', sizes: '16x16', type: 'image/jpeg' },
      { url: '/logo1122.JPG', sizes: '32x32', type: 'image/jpeg' },
      { url: '/logo1122.JPG', sizes: '48x48', type: 'image/jpeg' },
    ],
    shortcut: '/favicon.ico',
    apple: '/logo1122.JPG',
  },
  openGraph: {
    title: "RILINDI SHPK - Best Travel Agency in Albania",
    description: "Discover the natural beauty and rich culture of the Albanian Alps through our authentic tours.",
    type: "website",
    url: "https://rilindishpk.com",
    siteName: "RILINDI SHPK",
    locale: "en_US",
    images: [
      {
        url: '/logo1122.JPG',
        width: 1200,
        height: 630,
        alt: 'RILINDI SHPK - Best Travel Agency in Albania',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RILINDI SHPK - Best Travel Agency in Albania',
    description: 'Discover the natural beauty and rich culture of the Albanian Alps through our authentic tours.',
    images: ['/logo1122.JPG'],
    creator: '@rilindishpk',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'your-google-verification-code',
  },
  other: {
    'msapplication-TileColor': '#000000',
    'theme-color': '#000000',
    'apple-mobile-web-app-title': 'RILINDI SHPK',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'msapplication-config': 'none',
    'msapplication-TileImage': '/logo1122.JPG',
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
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/jpeg" href="/logo1122.JPG" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo1122.JPG" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}
      >
        <SessionManager />
        {children}
      </body>
    </html>
  );
}
