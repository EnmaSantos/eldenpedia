import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EldenPedia | The Lands Between Guide",
  description: "A fast, clean, and useful guide for Elden Ring players.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${inter.variable} antialiased bg-background text-foreground font-sans`}
      >
        <Navbar />
        <main className="min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
