import Link from "next/link";
import { Zap } from "lucide-react";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "SMMPanel";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/5 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-3" style={{fontFamily:"var(--font-grotesk)"}}>
              <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-gradient">{APP_NAME}</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">Nigeria's fastest and most affordable SMM panel. Trusted by creators, brands, and agencies.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-white/80">Services</h4>
            <div className="flex flex-col gap-2 text-sm text-white/40">
              <Link href="/services?platform=Instagram" className="hover:text-white/70 transition-colors">Instagram</Link>
              <Link href="/services?platform=TikTok" className="hover:text-white/70 transition-colors">TikTok</Link>
              <Link href="/services?platform=YouTube" className="hover:text-white/70 transition-colors">YouTube</Link>
              <Link href="/services?platform=Twitter" className="hover:text-white/70 transition-colors">Twitter/X</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-white/80">Account</h4>
            <div className="flex flex-col gap-2 text-sm text-white/40">
              <Link href="/register" className="hover:text-white/70 transition-colors">Sign Up</Link>
              <Link href="/login" className="hover:text-white/70 transition-colors">Sign In</Link>
              <Link href="/dashboard/wallet" className="hover:text-white/70 transition-colors">Fund Wallet</Link>
              <Link href="/dashboard/orders" className="hover:text-white/70 transition-colors">Order History</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-white/80">Support</h4>
            <div className="flex flex-col gap-2 text-sm text-white/40">
              <Link href="/api-docs" className="hover:text-white/70 transition-colors">API Docs</Link>
              <a href="https://wa.me/234XXXXXXXXXX" className="hover:text-white/70 transition-colors">WhatsApp</a>
              <a href="https://t.me/yourtelegram" className="hover:text-white/70 transition-colors">Telegram</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <span>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-white/50 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white/50 transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
