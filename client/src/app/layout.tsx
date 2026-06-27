import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZakatChain — Automated Zakat for the Modern World",
  description:
    "Calculate, verify, and distribute your Zakat directly on the Stellar network. Transparent, efficient, and fully Shariah-compliant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-text-main font-sans">
        <WalletProvider>
          <Navbar />
          <div className="flex flex-1">
            {children}
          </div>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
