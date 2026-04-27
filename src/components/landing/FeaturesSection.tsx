"use client";

import { Zap, Shield, Clock, BarChart3, Repeat, Headphones } from "lucide-react";

const features = [
  { icon: Zap, title: "Instant Delivery", desc: "Orders start processing within seconds. Watch your numbers grow in real-time." },
  { icon: Shield, title: "Account Safe", desc: "Real-velocity delivery patterns that never trigger platform risk detection." },
  { icon: Clock, title: "24/7 Support", desc: "Trained support team available round the clock via WhatsApp and Telegram." },
  { icon: BarChart3, title: "Order Tracking", desc: "Full dashboard with live order status, progress tracking, and history." },
  { icon: Repeat, title: "Refill Guarantee", desc: "Drop protection with automatic refills on eligible services." },
  { icon: Headphones, title: "Reseller API", desc: "Full REST API access to build your own SMM business on our infrastructure." },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 relative font-space-mono">

      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,58,237,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,.06) 1px,transparent 1px)",
          backgroundSize: "48px 48px"
        }}
      />

      {/* Blobs */}
      <div className="absolute -top-30 -left-20 w-100 h-100 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(124,58,237,.35) 0%,transparent 70%)" }} />
      <div className="absolute -bottom-25 -right-20 w-90 h-90 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(167,139,250,.2) 0%,transparent 70%)" }} />
      <div className="absolute top-[40%] left-[60%] w-50 h-50 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(52,211,153,.12) 0%,transparent 70%)" }} />

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div
          className="text-center mb-14"
          data-aos="fade-up"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-climate-crisis)" }}
          >
            Why Choose Us?
          </h2>
          <p className="text-foreground/50 max-w-xl mx-auto">
            Built for Nigerian creators, brands, agencies, and resellers who need results
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, index) => (
            <div
              key={f.title}
              data-aos="fade-up"
              data-aos-delay={index * 100} // 🔥 smooth stagger
              className="surface-2 border-subtle rounded-2xl p-6 
              transition-all duration-300 
              hover:border-violet-500/30 hover:-translate-y-1 hover:shadow-lg group"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4 
                transition-all duration-300 group-hover:bg-violet-500/20 group-hover:scale-110">
                <f.icon className="w-5 h-5 text-violet-400" />
              </div>

              {/* Title */}
              <h3
                className="font-semibold text-lg mb-2"
                style={{ fontFamily: "var(--font-grotesk)" }}
              >
                {f.title}
              </h3>

              {/* Description */}
              <p className="text-foreground/50 text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}