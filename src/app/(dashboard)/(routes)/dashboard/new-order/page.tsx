"use client";
import { useEffect, useState } from "react";
import { formatNGN, calcCharge } from "@/lib/utils";
import toast from "react-hot-toast";
import { Search, ShoppingCart, ChevronDown } from "lucide-react";

export default function NewOrderPage() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categories, setCategories] = useState<any[]>([]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [services, setServices] = useState<any[]>([]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selected, setSelected] = useState<any>(null);
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetch("/api/categories").then(r=>r.json()), fetch("/api/services").then(r=>r.json())])
      .then(([cats, svcs]) => { setCategories(cats); setServices(svcs); setFiltered(svcs); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = services;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (selectedCat !== "all") result = result.filter((s:any) => s.categoryId === selectedCat);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (search) result = result.filter((s:any) => s.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [search, selectedCat, services]);

  const charge = selected && quantity ? calcCharge(selected.rate, parseInt(quantity) || 0) : 0;
  const needsComment = selected?.type === "CUSTOM_COMMENTS";

  async function handleOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) { toast.error("Select a service"); return; }
    const qty = parseInt(quantity);
    if (qty < selected.minOrder || qty > selected.maxOrder) {
      toast.error(`Quantity must be between ${selected.minOrder} and ${selected.maxOrder}`);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: selected.id, link, quantity: qty, customComment: comment }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }
      toast.success("Order placed successfully!");
      setLink(""); setQuantity(""); setComment(""); setSelected(null);
    } catch { toast.error("Something went wrong"); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold" style={{fontFamily:"var(--font-grotesk)"}}>New Order</h2>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Service selector */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder-white/20 focus:outline-none focus:border-violet-500/40"
                placeholder="Search services..." />
            </div>
            <div className="relative">
              <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-8 text-sm text-foreground/70 focus:outline-none focus:border-violet-500/40 cursor-pointer">
                <option value="all">All Platforms</option>
                {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                categories.map((c:any) => <option key={c.id} value={c.id}>{c.platform} — {c.name}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/30 pointer-events-none" />
            </div>
          </div>

          <div className="surface-2 border-subtle rounded-2xl overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-foreground/30">Loading services...</div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-foreground/30">No services found</div>
            ) : (
              <div className="overflow-y-auto max-h-[500px]">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-[#1a1a2e]">
                    <tr>
                      {["ID","Service","Rate/1K","Min","Max"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-foreground/30 font-medium text-xs uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    filtered.map((s:any) => (
                      <tr key={s.id}
                        onClick={() => { setSelected(s); setQuantity(String(s.minOrder)); }}
                        className={`border-t border-white/[0.03] cursor-pointer transition-colors ${selected?.id === s.id ? "bg-background border-violet-500/20" : "hover:bg-white/[0.03]"}`}>
                        <td className="px-4 py-3 text-foreground/30 text-xs font-mono">{s.id.slice(-6)}</td>
                        <td className="px-4 py-3 text-foreground/80 max-w-[220px]">
                          <div className="truncate">{s.name}</div>
                          <div className="text-xs text-foreground/30 mt-0.5">{s.category?.platform}</div>
                        </td>
                        <td className="px-4 py-3 text-emerald-400 font-mono text-xs">{formatNGN(s.rate)}</td>
                        <td className="px-4 py-3 text-foreground text-xs font-mono">{s.minOrder.toLocaleString()}</td>
                        <td className="px-4 py-3 text-foreground text-xs font-mono">{s.maxOrder.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Order form */}
        <div className="surface-2 border-subtle rounded-2xl p-6 h-fit sticky top-20">
          <h3 className="font-semibold mb-5" style={{fontFamily:"var(--font-grotesk)"}}>Order Details</h3>
          {selected && (
            <div className="mb-4 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <p className="text-violet-300 text-sm font-medium truncate">{selected.name}</p>
              <p className="text-violet-400/60 text-xs mt-0.5">{formatNGN(selected.rate)} per 1,000</p>
            </div>
          )}
          <form onSubmit={handleOrder} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-foreground/50 mb-1.5 block">Link / Username</label>
              <input value={link} onChange={e => setLink(e.target.value)} required disabled={!selected}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder-white/20 focus:outline-none focus:border-violet-500/40 disabled:opacity-40"
                placeholder="https://..." />
            </div>
            <div>
              <label className="text-xs text-foreground/50 mb-1.5 block">
                Quantity {selected && <span className="text-foreground/30">({selected.minOrder.toLocaleString()} – {selected.maxOrder.toLocaleString()})</span>}
              </label>
              <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required disabled={!selected}
                min={selected?.minOrder} max={selected?.maxOrder}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder-white/20 focus:outline-none focus:border-violet-500/40 disabled:opacity-40"
                placeholder="1000" />
            </div>
            {needsComment && (
              <div>
                <label className="text-xs text-foreground/50 mb-1.5 block">Custom Comments (one per line)</label>
                <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder-white/20 focus:outline-none focus:border-violet-500/40 resize-none"
                  placeholder="Enter comments..." />
              </div>
            )}
            <div className="border-t border-white/5 pt-4 flex items-center justify-between">
              <span className="text-sm text-foreground">Total Charge</span>
              <span className="text-lg font-bold font-mono text-emerald-400">{charge > 0 ? formatNGN(charge) : "—"}</span>
            </div>
            <button type="submit" disabled={submitting || !selected}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-foreground font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
