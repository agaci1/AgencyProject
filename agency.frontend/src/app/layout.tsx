import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
// import Script from "next/script"; // ✅ Import Script
import "./globals.css";

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
  icons: {
    icon: '/logo1122.JPG',
    shortcut: '/logo1122.JPG',
    apple: '/logo1122.JPG',
  },
  openGraph: {
    title: "RILINDI SHPK - Best Travel Agency in Albania",
    description: "Discover the natural beauty and rich culture of the Albanian Alps through our authentic tours.",
    type: "website",
    images: [
      {
        url: '/logo1122.JPG',
        width: 1200,
        height: 630,
        alt: 'RILINDI SHPK - Best Travel Agency in Albania',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RILINDI SHPK - Best Travel Agency in Albania',
    description: 'Discover the natural beauty and rich culture of the Albanian Alps through our authentic tours.',
    images: ['/logo1122.JPG'],
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
