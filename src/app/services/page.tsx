"use client";
import { useEffect, useState } from "react";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { formatNGN } from "@/lib/utils";
import { Search, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch("/api/categories").then(r=>r.json()), fetch("/api/services").then(r=>r.json())])
      .then(([cats, svcs]) => { setCategories(cats); setServices(svcs); setFiltered(svcs); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let res = services;
    if (selectedPlatform !== "all") res = res.filter((s:any) => s.category?.platform === selectedPlatform);
    if (search) res = res.filter((s:any) => s.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(res);
  }, [search, selectedPlatform, services]);

  const platforms = [...new Set(categories.map((c:any)=>c.platform))];

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{fontFamily:"var(--font-grotesk)"}}>All Services</h1>
          <p className="text-foreground">Boost your presence across every major platform</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <input value={search} onChange={e=>setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-foreground placeholder-white/20 focus:outline-none focus:border-violet-500/40"
              placeholder="Search services..." />
          </div>
          <div className="relative">
            <select value={selectedPlatform} onChange={e=>setSelectedPlatform(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-foreground/70 focus:outline-none focus:border-violet-500/40 cursor-pointer min-w-[160px]">
              <option value="all">All Platforms</option>
              {platforms.map(p=><option key={p} value={p}>{p}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 pointer-events-none" />
          </div>
        </div>

        <div className="surface-2 border-subtle rounded-2xl overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-foreground/30">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-foreground/30">No services found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/[0.02]">
                  <tr>
                    {["#","Service","Platform","Rate / 1K","Min Order","Max Order",""].map(h=>(
                      <th key={h} className="text-left px-4 py-3 text-foreground/30 font-medium text-xs uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s:any,i:number)=>(
                    <tr key={s.id} className="border-t border-white/[0.03] hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-foreground/20 text-xs">{i+1}</td>
                      <td className="px-4 py-3 text-foreground/80 max-w-xs">
                        <div className="font-medium text-sm">{s.name}</div>
                        {s.description && <div className="text-xs text-foreground/30 mt-0.5 truncate">{s.description}</div>}
                      </td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-white/5 rounded text-foreground/50 text-xs">{s.category?.platform}</span></td>
                      <td className="px-4 py-3 text-emerald-400 font-mono font-medium">{formatNGN(s.rate)}</td>
                      <td className="px-4 py-3 text-foreground font-mono text-xs">{s.minOrder.toLocaleString()}</td>
                      <td className="px-4 py-3 text-foreground font-mono text-xs">{s.maxOrder.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <Link href="/register" className="px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 text-xs rounded-lg border border-violet-500/20 transition-colors whitespace-nowrap">
                          Order Now
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <p className="text-center text-foreground/30 text-sm mt-6">
          <Link href="/register" className="text-violet-400 hover:text-violet-300">Create a free account</Link> to place orders
        </p>
      </div>
      <LandingFooter />
    </div>
  );
}
