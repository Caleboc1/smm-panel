import Link from "next/link";
import { ArrowRight, Shield, Zap, Users, Clock } from "lucide-react";
import { CountUp } from "@/components/CountUp";

export function HeroSection() {
  const stats = [
    { num: "72", suffix: "M+", label: "Orders done" },
    { num: "18", suffix: "K+", label: "Customers" },
    { num: "30", suffix: "+", label: "Platforms" },
    { num: "99.9", suffix: "%", label: "Uptime" },
  ];

  const trust = [
    { color: "bg-emerald-400", text: "Account-safe delivery" },
    { color: "bg-yellow-400", text: "Starts in seconds" },
    { color: "bg-blue-400", text: "24/7 support" },
    { color: "bg-violet-400", text: "NGN pricing" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">

      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none animated-grid-wave"
        style={{
          backgroundImage: "linear-gradient(rgba(124,58,237,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,.06) 1px,transparent 1px)",
          backgroundSize: "48px 48px"
        }} />

      {/* Blobs - Hidden on mobile to reduce clutter */}
      <div className="absolute -top-30 -left-20 w-100 h-100 rounded-full pointer-events-none hidden md:block"
        style={{ background: "radial-gradient(circle,rgba(124,58,237,.35) 0%,transparent 70%)" }} />
      <div className="absolute -bottom-25 -right-20 w-90 h-90 rounded-full pointer-events-none hidden md:block"
        style={{ background: "radial-gradient(circle,rgba(167,139,250,.2) 0%,transparent 70%)" }} />
      <div className="absolute top-[40%] left-[60%] w-50 h-50 rounded-full pointer-events-none hidden lg:block"
        style={{ background: "radial-gradient(circle,rgba(52,211,153,.12) 0%,transparent 70%)" }} />

      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 py-16 sm:py-20 md:py-24 max-w-5xl mx-auto">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-[10px] sm:text-xs font-semibold tracking-wider uppercase mb-6 sm:mb-8">
          <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
          Nigeria's #1 SMM Panel
        </div>

        {/* Headline — Climate Crisis font */}
        <h1 className="font-climate-crisis text-3xl sm:text-5xl md:text-7xl mb-4 sm:mb-5 px-2" data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="800"
          data-aos-easing="ease-out-cubic">
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

        <p className="text-base sm:text-lg font-space-grotesk max-w-xl leading-relaxed mb-8 sm:mb-10 px-4" data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="800">
          Buy followers, likes, views and engagement across every platform.
          NGN pricing, instant delivery, zero stress.
        </p>

        {/* Stats bar - Wrap on mobile */}
        <div className="grid grid-cols-2 sm:flex sm:divide-x divide-gray border border-gray rounded-2xl overflow-hidden bg-violet-300 mb-8 sm:mb-10 w-full sm:w-auto" >
          {stats.map((s) => (
            <div key={s.label} className="px-4 sm:px-6 py-3 sm:py-4 text-center">
              <div className="font-climate text-xl sm:text-2xl text-[#a78bfa] leading-none mb-1">
                <CountUp end={parseFloat(s.num)} suffix={s.suffix} duration={2000} />
              </div>
              <div className="text-[8px] sm:text-[10px] uppercase tracking-widest font-medium text-white/70">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTAs - Stack on mobile */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-10 sm:mb-12 w-full sm:w-auto px-4 sm:px-0  font-space-mono" data-aos="fade-up"
          data-aos-delay="400"
          data-aos-duration="800">
          <Link href="/register"
            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-violet-600 hover:bg-violet-500  font-bold rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/25 text-sm tracking-wide w-full sm:w-auto">
            Start Growing Now <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/services"
            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 font-semibold rounded-2xl transition-all text-sm w-full sm:w-auto">
            Browse Services
          </Link>
        </div>

        {/* Trust row - Wrap on mobile */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 px-4  font-space-mono" data-aos="fade-in"
          data-aos-delay="500"
          data-aos-duration="700">
          {trust.map((t, i) => (
            <div key={t.text} className="flex items-center gap-2">
              {i > 0 && <span className="hidden sm:block w-px h-3 bg-white/10" />}
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs  font-medium">
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