"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Unable to send reset link");
        return;
      }

      setSent(true);
      toast.success(data.message || "Reset link sent");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden font-space-mono">
      <div className="absolute inset-0 pointer-events-none animated-grid-wave"
        style={{
          backgroundImage: "linear-gradient(rgba(124,58,237,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,.06) 1px,transparent 1px)",
          backgroundSize: "48px 48px"
        }} />
      <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] bg-violet-200 rounded-full opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-[220px] h-[220px] bg-purple-200 rounded-full opacity-40 pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        <div className="text-center mb-6">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-500">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-violet-100 shadow-xl shadow-violet-100/50">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Image src="/CalebSmmLogo.png" alt="Logo" width={50} height={50} className="rounded-full" />
          </div>

          <div className="text-center mb-6">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <Mail className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Reset your password</h1>
            <p className="mt-2 text-sm text-gray-500">
              Enter your account email and we&apos;ll send a reset link if the account exists.
            </p>
          </div>

          {sent ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              Check your email for a password reset link. The link expires in 1 hour.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/10 transition-all"
                  placeholder="Enter your email"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] text-sm">
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
