import { Geist, Geist_Mono } from "next/font/google";
import { Barlow } from "next/font/google";
import "./globals.css";
import FooterBar from "./layouts/footer_bar/footer_bar";
import { HeaderBar } from "./layouts/headerBar/headerBar";
import type { Metadata } from "next";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-barlow",
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "SignEd | Home",
  description: "Staging home for the SignEd web application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${barlow.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <HeaderBar />
        {children}
        {/* <FooterBar /> */}
      </body>
    </html>
  );
}
