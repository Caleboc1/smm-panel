"use client";
import { useEffect, useState } from "react";
import { formatNGN } from "@/lib/utils";
import { Search, RefreshCw, Download } from "lucide-react";

const USD_TO_NGN = 1600;
const MARKUP = 2.5;

export default function UpstreamPage() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [services, setServices] = useState<any[]>([]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [syncing, setSyncing] = useState(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [syncResult, setSyncResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/upstream");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setServices(Array.isArray(data.services) ? data.services : []);
      setBalance(data.balance);
    }      // eslint-disable-next-line @typescript-eslint/no-explicit-any 
    catch (e: any) {
      setError(e.message || "Failed to fetch from Peakerr");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSync() {
    setSyncing(true);
    setSyncResult(null);
    const res = await fetch("/api/admin/services/sync", { method: "POST" });
    const data = await res.json();
    setSyncResult(data);
    setSyncing(false);
  }

  // Get unique categories from services
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categories = ["all", ...Array.from(new Set(services.map((s: any) => s.category)))];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filtered = services.filter((s: any) => {
    const matchCat = selectedCategory === "all" || s.category === selectedCategory;
    const matchSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()) ||
      String(s.service).includes(search);
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Peakerr Services</h1>
          <p className="text-sm text-gray-500 mt-1">
            Live services from your upstream provider
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {balance && (
            <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">
              Peakerr Balance: <span className="font-mono">${parseFloat(balance.balance).toFixed(4)} USD</span>
            </div>
          )}
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-medium rounded-xl transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button onClick={handleSync} disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-foreground text-sm font-medium rounded-xl transition-colors">
            <Download className="w-4 h-4" />
            {syncing ? "Importing..." : "Import All to Panel"}
          </button>
        </div>
      </div>

      {/* Sync result */}
      {syncResult && (
        <div className={`p-4 rounded-xl border text-sm ${syncResult.error ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
          {syncResult.error
            ? `❌ ${syncResult.error}`
            : `✓ Import complete — ${syncResult.created} new services added, ${syncResult.skipped} already existed out of ${syncResult.total} total`}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          ❌ {error} — check that your UPSTREAM_API_KEY is correct in .env
        </div>
      )}

      {/* Pricing info */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Services", value: services.length },
          { label: "USD → NGN Rate", value: `$1 = ₦${USD_TO_NGN.toLocaleString()}` },
          { label: "Your Markup", value: `${MARKUP}x (${((MARKUP - 1) * 100).toFixed(0)}% profit)` },
        ].map(item => (
          <div key={item.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-lg font-bold text-gray-900">{item.value}</div>
            <div className="text-xs text-gray-400 mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, category or service ID..."
            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-violet-400" />
        </div>
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:border-violet-400 min-w-[200px]">
          {categories.map(c => (
            <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>
          ))}
        </select>
      </div>

      {/* Services table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-400">
            <RefreshCw className="w-6 h-6 mx-auto mb-3 animate-spin opacity-40" />
            Fetching services from Peakerr...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400">No services found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["ID", "Service Name", "Category", "Type", "Their Rate (USD)", "Your Rate (NGN)", "Your Profit/1K", "Min", "Max", "Refill", "Cancel"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-gray-400 text-xs font-medium uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {      
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                filtered.map((s: any) => {
                  const theirRateNGN = parseFloat(s.rate) * USD_TO_NGN;
                  const yourRate = Math.ceil(theirRateNGN * MARKUP);
                  const profit = yourRate - theirRateNGN;
                  return (
                    <tr key={s.service} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{s.service}</td>
                      <td className="px-4 py-3 max-w-[220px]">
                        <div className="text-gray-800 font-medium text-xs leading-snug">{s.name}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-[140px] truncate">{s.category}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">{s.type}</span>
                      </td>
                      <td className="px-4 py-3 text-red-500 font-mono text-xs">${parseFloat(s.rate).toFixed(4)}</td>
                      <td className="px-4 py-3">
                        <div className="text-emerald-600 font-mono text-xs font-semibold">{formatNGN(yourRate)}</div>
                      </td>
                      <td className="px-4 py-3 text-violet-600 font-mono text-xs">{formatNGN(profit)}</td>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{parseInt(s.min).toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{parseInt(s.max).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.refill ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                          {s.refill ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.cancel ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
                          {s.cancel ? "Yes" : "No"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
              Showing {filtered.length} of {services.length} services
            </div>
          </div>
        )}
      </div>
    </div>
  );
}