import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from '@vercel/analytics/next';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InsideX",
  description: "Track real-time stock prices, get personalised alerts and explore detailed company insights.",
  icons: {
    icon: '/favicon.svg',
  },
};

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
        <div className="min-h-screen w-full relative bg-black">
           {/* Subtle Background */}
           <div
             className="absolute inset-0 z-0"
             style={{
               background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(107, 114, 128, 0.05), transparent 70%), #000000",
             }}
           />
          
          {/* Background Blur Overlay */}
          <div className="absolute inset-0 z-5 backdrop-blur-sm bg-black/20" />
          
          {/* Content/Components */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
