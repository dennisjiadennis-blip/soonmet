import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { GuideProvider } from "@/contexts/GuideContext";
import { UserProvider } from "@/contexts/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Local Insider",
  description: "VIBE LOCALs TRAVEL SMART",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 dark:bg-zinc-950`}
      >
        <LanguageProvider>
          <UserProvider>
            <GuideProvider>
              <Navbar />
              <main className="pb-24 md:pb-0">
                {children}
              </main>
              <BottomNav />
            </GuideProvider>
          </UserProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
