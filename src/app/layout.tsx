import type { Metadata } from "next";
import { Inter, Space_Grotesk, Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });

export const metadata: Metadata = {
  title: { default: process.env.NEXT_PUBLIC_APP_NAME || "SMM Panel", template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME || "SMM Panel"}` },
  description: "Nigeria's fastest and cheapest SMM panel. Buy Instagram, TikTok, YouTube, Twitter followers, likes, views instantly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(inter.variable, grotesk.variable, "font-sans", geist.variable)}>
      <body className="bg-background text-white antialiased">
        <Providers>
          {children}
          <Toaster position="top-right" toastOptions={{ style: { background: "#1a1a2e", color: "#fff", border: "1px solid #2d2d4e" } }} />
        </Providers>
      </body>
    </html>
  );
}
