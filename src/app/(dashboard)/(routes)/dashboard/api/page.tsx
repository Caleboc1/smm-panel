"use client";
import { useEffect, useState } from "react";
import { Code, Copy, Check, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function ApiPage() {
  const [apiKey, setApiKey] = useState("");
  const [copied, setCopied] = useState(false);
  const BASE = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => { fetch("/api/user").then(r=>r.json()).then(d=>setApiKey(d?.apiKey||"")); }, []);

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
    toast.success("Copied!");
  }

  const endpoints = [
    { method:"POST", path:"/api/v1", action:"services", desc:"Get all available services", body:`{ "key": "${apiKey||"YOUR_API_KEY"}", "action": "services" }` },
    { method:"POST", path:"/api/v1", action:"add", desc:"Place a new order", body:`{ "key": "${apiKey||"YOUR_API_KEY"}", "action": "add", "service": "SERVICE_ID", "link": "https://...", "quantity": 1000 }` },
    { method:"POST", path:"/api/v1", action:"status", desc:"Check order status", body:`{ "key": "${apiKey||"YOUR_API_KEY"}", "action": "status", "order": "ORDER_ID" }` },
    { method:"POST", path:"/api/v1", action:"balance", desc:"Check account balance", body:`{ "key": "${apiKey||"YOUR_API_KEY"}", "action": "balance" }` },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold" style={{fontFamily:"var(--font-grotesk)"}}>API Access</h2>

      <div className=" rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <Code className="w-4 h-4 text-violet-400" />
          <h3 className="font-semibold" style={{fontFamily:"var(--font-grotesk)"}}>Your API Key</h3>
        </div>
        <p className="text-foreground text-sm mb-4">Use this key to access the API. Keep it secret.</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-foreground/70 truncate">
            {apiKey || "—"}
          </div>
          <button onClick={()=>copy(apiKey)} className="flex items-center gap-2 px-4 py-3 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 rounded-xl text-sm transition-colors">
            {copied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="surface-2 border-subtle rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="font-semibold" style={{fontFamily:"var(--font-grotesk)"}}>API Reference</h3>
          <p className="text-foreground text-sm mt-1">All requests are POST to <code className="text-violet-400">{BASE}/api/v1</code></p>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {endpoints.map((ep) => (
            <div key={ep.action} className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 text-xs font-bold bg-blue-500/20 text-blue-400 rounded">{ep.method}</span>
                <code className="text-sm text-foreground/70">{ep.path}</code>
                <span className="text-xs text-foreground/30">action: <span className="text-violet-400">{ep.action}</span></span>
              </div>
              <p className="text-sm text-foreground/50 mb-3">{ep.desc}</p>
              <div className="relative bg-black/40 rounded-xl p-4">
                <pre className="text-xs text-foreground/60 overflow-x-auto">{ep.body}</pre>
                <button onClick={()=>copy(ep.body)} className="absolute top-3 right-3 text-foreground/20 hover:text-foreground/50 transition-colors">
                  <Copy className="w-3.5 h-3.5"/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
