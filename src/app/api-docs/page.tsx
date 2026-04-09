import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Code } from "lucide-react";

export default function ApiDocsPage() {
  const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://yourpanel.com";
  const endpoints = [
    { action:"services", desc:"Returns a list of all active services with rates and limits.", body:`{ "key": "YOUR_API_KEY", "action": "services" }`, response:`[{ "service": "id", "name": "...", "rate": 1500, "min": 100, "max": 100000 }]` },
    { action:"add", desc:"Place a new order. Balance is deducted immediately.", body:`{ "key": "YOUR_API_KEY", "action": "add", "service": "SERVICE_ID", "link": "https://...", "quantity": 1000 }`, response:`{ "order": "ORDER_ID" }` },
    { action:"status", desc:"Check the status of an existing order.", body:`{ "key": "YOUR_API_KEY", "action": "status", "order": "ORDER_ID" }`, response:`{ "order": "id", "status": "PROCESSING", "remains": 800, "start_count": 200 }` },
    { action:"balance", desc:"Check your current NGN wallet balance.", body:`{ "key": "YOUR_API_KEY", "action": "balance" }`, response:`{ "balance": 5000, "currency": "NGN" }` },
  ];
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <LandingNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-violet-600/20 rounded-xl flex items-center justify-center"><Code className="w-5 h-5 text-violet-400"/></div>
            <h1 className="text-3xl font-bold" style={{fontFamily:"var(--font-grotesk)"}}>API Documentation</h1>
          </div>
          <p className="text-white/50 leading-relaxed">Build your own SMM reseller business on top of our infrastructure. All requests use POST to a single endpoint. Authentication uses your API key available in your dashboard.</p>
        </div>

        <div className="surface-2 border-subtle rounded-2xl p-5 mb-8">
          <p className="text-xs text-white/40 mb-2 uppercase tracking-wide font-medium">Base Endpoint</p>
          <code className="text-violet-400 text-sm">{BASE}/api/v1</code>
          <p className="text-xs text-white/30 mt-2">All requests: <span className="text-white/50">POST</span> with <span className="text-white/50">Content-Type: application/json</span></p>
        </div>

        <div className="space-y-6">
          {endpoints.map(ep=>(
            <div key={ep.action} className="surface-2 border-subtle rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">POST</span>
                <code className="text-white/70 text-sm">action: <span className="text-violet-400">{ep.action}</span></code>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-white/50 text-sm">{ep.desc}</p>
                <div>
                  <p className="text-xs text-white/30 mb-2 uppercase tracking-wide">Request Body</p>
                  <pre className="bg-black/40 rounded-xl p-4 text-xs text-white/60 overflow-x-auto">{ep.body}</pre>
                </div>
                <div>
                  <p className="text-xs text-white/30 mb-2 uppercase tracking-wide">Response</p>
                  <pre className="bg-black/40 rounded-xl p-4 text-xs text-emerald-400/70 overflow-x-auto">{ep.response}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <LandingFooter />
    </div>
  );
}
