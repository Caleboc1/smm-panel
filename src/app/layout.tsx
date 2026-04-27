import type { Metadata } from "next";
import { Inter, Space_Grotesk, Geist, Climate_Crisis , Space_Mono} from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import AOSProvider from "@/components/AOSProvider";


const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: true,
});

const climateCrisis = Climate_Crisis({
  variable: "--font-climate-crisis",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: { default: process.env.NEXT_PUBLIC_APP_NAME || "SMM Panel", template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME || "SMM Panel"}` },
  description: "Nigeria's fastest and cheapest SMM panel. Buy Instagram, TikTok, YouTube, Twitter followers, likes, views instantly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" >
      <body   className={`${spaceGrotesk.variable} ${climateCrisis.variable} ${spaceMono.variable} antialiased`}>
        <Providers>
        <AOSProvider />
          {children}
          <Toaster position="top-right" toastOptions={{ style: { background: "#1a1a2e", color: "#fff", border: "1px solid #2d2d4e" } }} />
        </Providers>
      </body>
    </html>
  );
}
