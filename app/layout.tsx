import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Signalist",
  description: "Track real-time stock prices, get personalised alerts and explore detailed company insights.",
};

/**
 * Provides the application's root HTML layout, applying global font variables and a dark theme while rendering page content.
 *
 * @param children - The page or application content to render inside the document body
 * @returns The root HTML structure (`<html>` with `<body>`) for the application
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
