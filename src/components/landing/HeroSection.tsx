import Link from "next/link";
import { ArrowRight, Shield, Zap, Users, Clock } from "lucide-react";

export function HeroSection() {
  const stats = [
    { num: "72M+", label: "Orders done" },
    { num: "18K+", label: "Customers" },
    { num: "30+",  label: "Platforms" },
    { num: "99.9%", label: "Uptime" },
  ];

  const trust = [
    { color: "bg-emerald-400", text: "Account-safe delivery" },
    { color: "bg-yellow-400",  text: "Starts in seconds" },
    { color: "bg-blue-400",    text: "24/7 support" },
    { color: "bg-violet-400",  text: "NGN pricing" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden bg-[#0f0a1e]">

      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(124,58,237,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,.06) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />

      {/* Blobs */}
      <div className="absolute top-[-120px] left-[-80px] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(124,58,237,.35) 0%,transparent 70%)" }} />
      <div className="absolute bottom-[-100px] right-[-80px] w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(167,139,250,.2) 0%,transparent 70%)" }} />
      <div className="absolute top-[40%] left-[60%] w-[200px] h-[200px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(52,211,153,.12) 0%,transparent 70%)" }} />

      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 py-24 max-w-5xl mx-auto">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold tracking-wider uppercase mb-8">
          <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
          Nigeria's #1 SMM Panel
        </div>

        {/* Headline — Climate Crisis font */}
        <h1 className="font-climate-crisis text-6xl sm:text-7xl md:text-8xl leading-[1.05] text-white mb-5">
          Grow Smarter.{" "}
          <span style={{
            background: "linear-gradient(135deg, #a78bfa, #34d399)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Go Viral Faster.
          </span>
        </h1>

        <p className="text-lg text-white/50 max-w-xl leading-relaxed mb-10">
          Buy followers, likes, views and engagement across every platform.
          NGN pricing, instant delivery, zero stress.
        </p>

        {/* Stats bar */}
        <div className="flex divide-x divide-white/10 border border-white/10 rounded-2xl overflow-hidden bg-white/[0.03] mb-10">
          {stats.map((s) => (
            <div key={s.label} className="px-6 py-4 text-center">
              <div className="font-climate text-2xl text-violet-300 leading-none mb-1">{s.num}</div>
              <div className="text-[10px] text-white/35 uppercase tracking-widest font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-12">
          <Link href="/register"
            className="flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/25 text-sm tracking-wide">
            Start Growing Now <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/services"
            className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/80 hover:text-white font-semibold rounded-2xl transition-all text-sm">
            Browse Services
          </Link>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {trust.map((t, i) => (
            <div key={t.text} className="flex items-center gap-2">
              {i > 0 && <span className="hidden sm:block w-px h-3 bg-white/10" />}
              <div className="flex items-center gap-1.5 text-xs text-white/40 font-medium">
                <span className={`w-1.5 h-1.5 rounded-full ${t.color}`} />
                {t.text}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}