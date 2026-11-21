"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { formatNGN } from "@/lib/utils";

type ManualDeposit = {
  id: string;
  amount: number;
  reference: string | null;
  status: "PENDING" | "COMPLETED" | "FAILED";
  description: string | null;
  createdAt: string;
  senderName?: string;
  user: { email: string; name: string | null; balance: number };
};

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "text-emerald-400 bg-emerald-400/10",
  PENDING: "text-yellow-400 bg-yellow-400/10",
  FAILED: "text-red-400 bg-red-400/10",
};

export default function ManualDepositsPage() {
  const [deposits, setDeposits] = useState<ManualDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/manual-deposits");
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Unable to load deposits");
        return;
      }
      setDeposits(data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function review(transactionId: string, action: "approve" | "reject") {
    setReviewing(transactionId);
    try {
      const res = await fetch("/api/admin/manual-deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Review failed");
        return;
      }
      toast.success(action === "approve" ? "Wallet credited" : "Deposit rejected");
      await load();
    } finally {
      setReviewing(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-grotesk)" }}>Manual Deposits</h1>
          <p className="text-sm text-foreground/40">Confirm OPay transfers before crediting customer wallets.</p>
        </div>
        <button onClick={load} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-foreground/60 hover:text-foreground">
          Refresh
        </button>
      </div>

      <div className="surface-2 border-subtle rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-14 text-center text-foreground/30">Loading deposits...</div>
        ) : deposits.length === 0 ? (
          <div className="py-14 text-center text-foreground/30">No manual deposits yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-white/[0.02]">
                <tr>{["Customer", "Amount", "Sender account name", "Reference", "Status", "Date", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-foreground/30 uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {deposits.map((deposit) => (
                  <tr key={deposit.id} className="border-t border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="text-foreground/80">{deposit.user.name || deposit.user.email}</div>
                      <div className="text-foreground/30">{deposit.user.email}</div>
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-emerald-400">{formatNGN(deposit.amount)}</td>
                    <td className="px-4 py-3 text-foreground/70">{deposit.description?.replace(/^Manual transfer from /, "") || "—"}</td>
                    <td className="px-4 py-3 font-mono text-foreground/60">{deposit.reference}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 ${STATUS_COLORS[deposit.status] || "bg-white/5 text-foreground/50"}`}>{deposit.status}</span>
                    </td>
                    <td className="px-4 py-3 text-foreground/30">{new Date(deposit.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                    <td className="px-4 py-3">
                      {deposit.status === "PENDING" ? (
                        <div className="flex gap-2">
                          <button disabled={reviewing === deposit.id} onClick={() => review(deposit.id, "approve")}
                            className="rounded-lg bg-emerald-500 px-3 py-1.5 font-semibold text-white disabled:opacity-50">
                            Approve
                          </button>
                          <button disabled={reviewing === deposit.id} onClick={() => review(deposit.id, "reject")}
                            className="rounded-lg bg-red-500 px-3 py-1.5 font-semibold text-white disabled:opacity-50">
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-foreground/30">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
