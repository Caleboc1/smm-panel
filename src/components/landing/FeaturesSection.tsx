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
    <section id="features" className="py-20 px-4 sm:px-6 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{fontFamily:"var(--font-grotesk)"}}>Why Choose Us?</h2>
          <p className="text-foreground/50 max-w-xl mx-auto">Built for Nigerian creators, brands, agencies, and resellers who need results</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="surface-2 border-subtle rounded-2xl p-6 hover:border-violet-500/30 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                <f.icon className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{fontFamily:"var(--font-grotesk)"}}>{f.title}</h3>
              <p className="text-foreground/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
