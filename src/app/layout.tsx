import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignupPrompt from "@/components/SignupPrompt";
import WorryTimeBanner from "@/components/WorryTimeBanner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finch Care - Anxiety Companion",
  description: "A safety-first anxiety companion for in-the-moment resets and gentle skill-building - no streaks, no shame.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Finch Care"
  },
};

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white min-h-screen flex flex-col`}>
        <WorryTimeBanner />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <SignupPrompt />
      </body>
    </html>
  );
}
