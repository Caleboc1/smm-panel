"use client";
import { formatNGN } from "@/lib/utils";
import { Wallet } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function DashboardTopbar({ user }: { user: any }) {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/user").then(r => r.json()).then(d => setBalance(d?.balance ?? 0));
  }, []);

  return (
    <header className="h-16 border-b border-white/5 bg-[#0d0d1a]/80 backdrop-blur px-4 sm:px-6 flex items-center justify-between">
      <h1 className="text-white/60 text-sm font-medium hidden sm:block">
        Welcome back, <span className="text-white">{user?.name || user?.email}</span>
      </h1>
      <div className="flex items-center gap-4 ml-auto">
        <Link href="/dashboard/wallet" className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors">
          <Wallet className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-emerald-400 font-medium">
            {balance !== null ? formatNGN(balance) : "..."}
          </span>
        </Link>
        <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300 text-sm font-bold">
          {(user?.name || user?.email || "U")[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
}
