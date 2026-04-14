import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatNGN } from "@/lib/utils";

export function ServicesPreview({ services }: { services: any[] }) {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold" style={{fontFamily:"var(--font-grotesk)"}}>Popular Services</h2>
          <Link href="/services" className="flex items-center gap-1 text-violet-400 hover:text-violet-300 text-sm font-medium">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {services.length === 0 ? (
          <div className="text-center py-16 text-foreground/30 surface-2 border-subtle rounded-2xl">
            Services will appear here once added from the admin panel.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="text-left px-4 py-3 text-foreground font-medium">Service</th>
                  <th className="text-left px-4 py-3 text-foreground font-medium hidden md:table-cell">Platform</th>
                  <th className="text-right px-4 py-3 text-foreground font-medium">Rate / 1K</th>
                  <th className="text-right px-4 py-3 text-foreground font-medium hidden sm:table-cell">Min</th>
                  <th className="text-right px-4 py-3 text-foreground font-medium hidden sm:table-cell">Max</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s: any) => (
                  <tr key={s.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground/80 max-w-xs truncate">{s.name}</td>
                    <td className="px-4 py-3 text-foreground hidden md:table-cell">{s.category?.platform}</td>
                    <td className="px-4 py-3 text-right text-emerald-400 font-mono">{formatNGN(s.rate)}</td>
                    <td className="px-4 py-3 text-right text-foreground hidden sm:table-cell font-mono">{s.minOrder.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-foreground hidden sm:table-cell font-mono">{s.maxOrder.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
