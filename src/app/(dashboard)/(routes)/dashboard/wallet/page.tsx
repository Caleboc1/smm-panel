"use client";
import { useEffect, useState } from "react";
import { formatNGN } from "@/lib/utils";
import toast from "react-hot-toast";
import { Wallet, ArrowUpRight, Clock } from "lucide-react";

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [txns, setTxns] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/user").then(r=>r.json()).then(d => setBalance(d?.balance ?? 0));
    fetch("/api/wallet/transactions").then(r=>r.json()).then(d => setTxns(d || [])).catch(()=>{});

    // Auto-verify if redirected from Paystack
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      fetch("/api/wallet/verify", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({reference:ref}) })
        .then(r=>r.json()).then(d => {
          if (d.message) { toast.success(`Wallet credited ${d.amount ? formatNGN(d.amount) : ""}`); fetch("/api/user").then(r=>r.json()).then(u=>setBalance(u?.balance??0)); }
          else toast.error(d.error || "Verification failed");
        });
      window.history.replaceState({}, "", "/dashboard/wallet");
    }
  }, []);

  async function handleFund(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt < 100) { toast.error("Minimum deposit is ₦100"); return; }
    setLoading(true);
    const res = await fetch("/api/wallet/fund", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({amount:amt}) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { toast.error(data.error); return; }
    window.location.href = data.url;
  }

  const presets = [500, 1000, 2000, 5000, 10000, 20000];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold" style={{fontFamily:"var(--font-grotesk)"}}>Wallet</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Balance card */}
        <div className="bg-white rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32  rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-white/40 text-sm mb-4">
              <Wallet className="w-4 h-4" /> Available Balance
            </div>
            <div className="text-4xl font-bold font-mono text-white mb-1">{formatNGN(balance)}</div>
            <p className="text-white/30 text-xs">Add funds below to place orders</p>
          </div>
        </div>

        {/* Fund wallet */}
        <div className="surface-2 border-subtle rounded-2xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{fontFamily:"var(--font-grotesk)"}}>
            <ArrowUpRight className="w-4 h-4 text-violet-400" /> Add Funds
          </h3>
          <form onSubmit={handleFund} className="space-y-4">
            <div>
              <label className="text-xs text-white/50 mb-2 block">Quick amounts</label>
              <div className="grid grid-cols-3 gap-2">
                {presets.map(p => (
                  <button key={p} type="button" onClick={() => setAmount(String(p))}
                    className={`py-2 text-xs rounded-lg border transition-colors ${amount === String(p) ? "border-violet-500/50 bg-violet-500/10 text-violet-300" : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"}`}>
                    {formatNGN(p)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Or enter amount (₦)</label>
              <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} min="100"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/40 font-mono"
                placeholder="500" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors">
              {loading ? "Redirecting..." : "Pay with Paystack"}
            </button>
            <p className="text-center text-xs text-white/25">Secured by Paystack. NGN only.</p>
          </form>
        </div>
      </div>

      {/* Transaction history */}
      <div className="surface-2 border-subtle rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="font-semibold" style={{fontFamily:"var(--font-grotesk)"}}>Transaction History</h3>
        </div>
        {txns.length === 0 ? (
          <div className="py-12 text-center text-white/30">
            <Clock className="w-6 h-6 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No transactions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {txns.map((t:any) => (
              <div key={t.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">{t.description || (t.type === "CREDIT" ? "Wallet top-up" : "Order payment")}</p>
                  <p className="text-xs text-white/30 mt-0.5">{new Date(t.createdAt).toLocaleDateString("en-NG", {day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</p>
                </div>
                <div className="text-right">
                  <span className={`font-mono font-semibold ${t.type === "CREDIT" ? "text-emerald-400" : "text-red-400"}`}>
                    {t.type === "CREDIT" ? "+" : "-"}{formatNGN(t.amount)}
                  </span>
                  <p className={`text-xs mt-0.5 ${t.status === "COMPLETED" ? "text-white/30" : "text-yellow-400/70"}`}>{t.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
