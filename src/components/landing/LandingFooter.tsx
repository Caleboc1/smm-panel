import Link from "next/link";
import { Zap } from "lucide-react";
import Image from "next/image";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "SMMPanel";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/5 pt-12 px-4 sm:px-6 relative ">
      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(124,58,237,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,.06) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />

      {/* Blobs */}
      
      <div className="absolute -top-30 -left-20 w-100 h-100 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(124,58,237,.35) 0%,transparent 70%)" }} />
      <div className="absolute -bottom-25 -right-20 w-90 h-90 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(167,139,250,.2) 0%,transparent 70%)" }} />
      <div className="absolute top-[40%] left-[60%] w-50 h-50 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(52,211,153,.12) 0%,transparent 70%)" }} />

      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-3" style={{ fontFamily: "var(--font-grotesk)" }}>
              <Link href="/" className="flex items-center gap-2 font-bold text-xl" style={{ fontFamily: "var(--font-grotesk)" }}>
                <Image src={"/CalebSmmLogo.png"} alt="Logo" width={50} height={50} className="rounded-full" />
                <span className="text-gradient">{APP_NAME}</span>
              </Link>
            </div>
            <p className="text-foreground text-sm leading-relaxed font-space-mono">Nigeria&apos;s fastest and most affordable SMM panel. Trusted by creators, brands, and agencies.</p>
          </div>
          <div>
            <h4 className="font-medium font-climate-crisis mb-3 text-foreground/80">Services</h4>
            <div className="flex flex-col gap-2 text-sm text-foreground  font-space-mono">
              <Link href="/services?platform=Instagram" className="hover:text-foreground/70 transition-colors">Instagram</Link>
              <Link href="/services?platform=TikTok" className="hover:text-foreground/70 transition-colors">TikTok</Link>
              <Link href="/services?platform=YouTube" className="hover:text-foreground/70 transition-colors">YouTube</Link>
              <Link href="/services?platform=Twitter" className="hover:text-foreground/70 transition-colors">Twitter/X</Link>
            </div>
          </div>
          <div>
            <h4 className="font-medium font-climate-crisis mb-3 text-foreground/80">Account</h4>
            <div className="flex flex-col gap-2 text-sm text-foreground  font-space-mono">
              <Link href="/register" className="hover:text-foreground/70 transition-colors">Sign Up</Link>
              <Link href="/login" className="hover:text-foreground/70 transition-colors">Sign In</Link>
              <Link href="/dashboard/wallet" className="hover:text-foreground/70 transition-colors">Fund Wallet</Link>
              <Link href="/dashboard/orders" className="hover:text-foreground/70 transition-colors">Order History</Link>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-foreground/80 font-climate-crisis">Support</h4>
            <div className="flex flex-col gap-2 text-sm text-foreground  font-space-mono">
              <Link href="/api-docs" className="hover:text-foreground/70 transition-colors">API Docs</Link>
              <a href="https://wa.me/234XXXXXXXXXX" className="hover:text-foreground/70 transition-colors">WhatsApp</a>
              <a href="https://t.me/yourtelegram" className="hover:text-foreground/70 transition-colors">Telegram</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-foreground/30  font-space-mono">
          <span>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-foreground/50 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground/50 transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
