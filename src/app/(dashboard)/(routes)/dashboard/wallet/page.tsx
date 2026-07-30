"use client";
import { useEffect, useState } from "react";
import { formatNGN } from "@/lib/utils";
import toast from "react-hot-toast";
import { Wallet, ArrowUpRight, Clock, Copy } from "lucide-react";

type ManualPayment = {
  reference: string;
  payment: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    confirmationTime: string;
  };
};

const MANUAL_ACCOUNT = {
  bankName: "OPay",
  accountNumber: "8106963552",
  accountName: "Caleb Ogeneochuko",
};

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [txns, setTxns] = useState<any[]>([]);
  const [manualPayment, setManualPayment] = useState<ManualPayment | null>(null);

  useEffect(() => {
    fetch("/api/user").then(r=>r.json()).then(d => setBalance(d?.balance ?? 0));
    fetch("/api/wallet/transactions").then(r=>r.json()).then(d => setTxns(d || [])).catch(()=>{});
  }, []);

  async function copy(value: string, label: string) {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  }

  async function handleFund(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt < 100) { toast.error("Minimum deposit is ₦100"); return; }
    setLoading(true);
    const res = await fetch("/api/wallet/fund", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({amount:amt}) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { toast.error(data.error); return; }
    setManualPayment(data);
    toast.success("Transfer details generated");
    fetch("/api/wallet/transactions").then(r=>r.json()).then(d => setTxns(d || [])).catch(()=>{});
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
            <div className="flex items-center gap-2 text-foreground text-sm mb-4">
              <Wallet className="w-4 h-4" /> Available Balance
            </div>
            <div className="text-4xl font-bold font-mono text-foreground mb-1">{formatNGN(balance)}</div>
            <p className="text-foreground text-xs">Add funds below to place orders</p>
          </div>
        </div>

        {/* Fund wallet */}
        <div className="surface-2 border-subtle rounded-2xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{fontFamily:"var(--font-grotesk)"}}>
            <ArrowUpRight className="w-4 h-4 text-violet-400" /> Manual Bank Transfer
          </h3>
          <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-4">
            {[
              ["Bank", MANUAL_ACCOUNT.bankName],
              ["Account number", MANUAL_ACCOUNT.accountNumber],
              ["Account name", MANUAL_ACCOUNT.accountName],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 border-t border-white/5 py-2 first:border-t-0 first:pt-0 last:pb-0 text-sm">
                <span className="text-foreground/50">{label}</span>
                <button type="button" onClick={() => copy(value, label)} className="flex items-center gap-1 font-mono font-semibold text-foreground hover:text-violet-500">
                  {value} <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="mb-4 rounded-xl border border-yellow-400/20 bg-yellow-400/10 p-3 text-xs text-yellow-700">
            Transfer to the OPay account below. Use your generated reference as the transfer narration where possible. Wallet confirmation takes about 5 minutes after payment is received.
          </div>
          <form onSubmit={handleFund} className="space-y-4">
            <div>
              <label className="text-xs text-foreground/50 mb-2 block">Quick amounts</label>
              <div className="grid grid-cols-3 gap-2">
                {presets.map(p => (
                  <button key={p} type="button" onClick={() => setAmount(String(p))}
                    className={`py-2 text-xs rounded-lg border transition-colors ${amount === String(p) ? "border-violet-500/50 bg-violet-500/10 text-violet-300" : "border-white/10 text-foreground/50 hover:border-white/20 hover:text-foreground/70"}`}>
                    {formatNGN(p)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-foreground/50 mb-1.5 block">Or enter amount (₦)</label>
              <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} min="100"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder-white/20 focus:outline-none focus:border-violet-500/40 font-mono"
                placeholder="500" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-foreground font-semibold rounded-xl transition-colors">
              {loading ? "Generating..." : "Generate Transfer Details"}
            </button>
            <p className="text-center text-xs text-foreground/25">Manual transfer. NGN only.</p>
          </form>
          {manualPayment && (
            <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <div className="mb-3 text-sm font-semibold text-emerald-700">Transfer exactly {formatNGN(parseFloat(amount))}</div>
              {[
                ["Bank", manualPayment.payment.bankName],
                ["Account number", manualPayment.payment.accountNumber],
                ["Account name", manualPayment.payment.accountName],
                ["Reference", manualPayment.reference],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 border-t border-emerald-500/10 py-2 text-sm">
                  <span className="text-foreground/50">{label}</span>
                  <button type="button" onClick={() => copy(value, label)} className="flex items-center gap-1 font-mono font-semibold text-foreground hover:text-violet-500">
                    {value} <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <p className="mt-3 text-xs text-emerald-700">
                Your wallet will be credited after admin confirmation, usually within {manualPayment.payment.confirmationTime}.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction history */}
      <div className="surface-2 border-subtle rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="font-semibold" style={{fontFamily:"var(--font-grotesk)"}}>Transaction History</h3>
        </div>
        {txns.length === 0 ? (
          <div className="py-12 text-center text-foreground/30">
            <Clock className="w-6 h-6 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No transactions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
            txns.map((t:any) => (
              <div key={t.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/80">{t.description || (t.type === "CREDIT" ? "Wallet top-up" : "Order payment")}</p>
                  <p className="text-xs text-foreground/30 mt-0.5">{new Date(t.createdAt).toLocaleDateString("en-NG", {day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</p>
                </div>
                <div className="text-right">
                  <span className={`font-mono font-semibold ${t.type === "CREDIT" ? "text-emerald-400" : "text-red-400"}`}>
                    {t.type === "CREDIT" ? "+" : "-"}{formatNGN(t.amount)}
                  </span>
                  <p className={`text-xs mt-0.5 ${t.status === "COMPLETED" ? "text-foreground/30" : "text-yellow-400/70"}`}>{t.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
