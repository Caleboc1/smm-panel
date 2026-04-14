"use client";
import { useEffect, useState } from "react";
import { formatNGN } from "@/lib/utils";
import { ClipboardList, RefreshCw } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "text-emerald-400 bg-emerald-400/10",
  PENDING: "text-yellow-400 bg-yellow-400/10",
  PROCESSING: "text-blue-400 bg-blue-400/10",
  ACTIVE: "text-blue-400 bg-blue-400/10",
  CANCELLED: "text-red-400 bg-red-400/10",
  FAILED: "text-red-400 bg-red-400/10",
  PARTIAL: "text-orange-400 bg-orange-400/10",
  REFUNDED: "text-purple-400 bg-purple-400/10",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  async function load(p = 1) {
    setLoading(true);
    const res = await fetch(`/api/orders?page=${p}`);
    const data = await res.json();
    setOrders(data.orders || []);
    setTotal(data.total || 0);
    setLoading(false);
  }

  useEffect(() => { load(page); }, [page]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{fontFamily:"var(--font-grotesk)"}}>My Orders <span className="text-foreground/30 text-lg">({total})</span></h2>
        <button onClick={() => load(page)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/50 hover:text-foreground border border-white/10 hover:border-white/20 rounded-xl transition-all">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className=" border-subtle rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-foreground/30">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-foreground/30">
            <ClipboardList className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.02]">
                <tr>
                  {["Order ID","Service","Link","Qty","Charge","Status","Date"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-foreground/30 font-medium text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o:any) => (
                  <tr key={o.id} className="border-t border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-foreground/30 font-mono text-xs">#{o.id.slice(-8)}</td>
                    <td className="px-4 py-3 text-foreground/80 max-w-[180px]">
                      <div className="truncate text-xs">{o.service?.name}</div>
                      <div className="text-foreground/30 text-xs">{o.service?.category?.platform}</div>
                    </td>
                    <td className="px-4 py-3 text-foreground text-xs max-w-[120px] truncate">{o.link}</td>
                    <td className="px-4 py-3 text-foreground/60 font-mono text-xs">{o.quantity.toLocaleString()}</td>
                    <td className="px-4 py-3 text-emerald-400 font-mono text-xs">{formatNGN(o.charge)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[o.status] || "text-foreground bg-white/5"}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground/30 text-xs whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString("en-NG", { day:"numeric", month:"short", year:"numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {total > 20 && (
          <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-foreground/30">Showing {Math.min(page*20, total)} of {total}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p=>p-1)}
                className="px-3 py-1.5 text-xs border border-white/10 rounded-lg disabled:opacity-30 hover:border-white/20 transition-colors">Prev</button>
              <button disabled={page * 20 >= total} onClick={() => setPage(p=>p+1)}
                className="px-3 py-1.5 text-xs border border-white/10 rounded-lg disabled:opacity-30 hover:border-white/20 transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
