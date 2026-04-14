import Link from "next/link";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
   

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm mb-8">
          <Zap className="w-3.5 h-3.5" />
          <span>Nigeria's Fastest SMM Panel</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6" style={{fontFamily:"var(--font-grotesk)"}}>
          Grow Your Social Media{" "}
          <span className="text-gradient">Fast, Safe & Trusted</span>
        </h1>

        <p className="text-lg sm:text-xl text-foreground/60 max-w-2xl mx-auto mb-10">
          Boost followers, likes, views, and engagement across every platform instantly.
          Affordable NGN pricing, automated delivery, 24/7 support.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/register" className="flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-foreground font-semibold rounded-xl transition-all hover:scale-105 glow">
            Start Growing Now <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/services" className="flex items-center gap-2 px-8 py-4 border border-white/10 hover:border-white/20 text-foreground/80 hover:text-foreground font-medium rounded-xl transition-all">
            View Services
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-foreground/50">
          <div className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-emerald-400" /> Account-safe delivery</div>
          <div className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-yellow-400" /> Instant start</div>
          <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-400" /> 18,000+ customers</div>
        </div>
      </div>
    </section>
  );
}
