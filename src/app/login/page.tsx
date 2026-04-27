"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Zap, Eye, EyeOff } from "lucide-react";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "SMMPanel";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) { toast.error("Invalid email or password"); return; }
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-violet-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] bg-violet-200 rounded-full opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-[220px] h-[220px] bg-purple-200 rounded-full opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[160px] h-[160px] bg-violet-100 rounded-full opacity-60 pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        {/* Floating tags */}
        <div className="absolute -top-4 -left-2 bg-white border border-violet-100 rounded-xl px-3 py-1.5 text-xs font-semibold text-violet-700 flex items-center gap-2 shadow-sm">
          <span className="w-2 h-2 bg-emerald-400 rounded-full"></span> Secured & Trusted
        </div>
        <div className="absolute -bottom-4 -right-2 bg-white border border-violet-100 rounded-xl px-3 py-1.5 text-xs font-semibold text-violet-700 shadow-sm">
          72M+ orders fulfilled
        </div>

        {/* Heading above card */}
        <div className="text-center mb-6">
          <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-2">Welcome back</p>
          <h1 className="text-3xl font-extrabold text-[#1e1b4b] leading-tight">
            Sign in to<br />your panel
          </h1>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-violet-100 shadow-xl shadow-violet-100/50">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#1e1b4b]">{APP_NAME}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/10 transition-all"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full px-4 py-3 pr-12 border-[1.5px] border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/10 transition-all"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-right mt-1.5">
                <Link href="/forgot-password" className="text-xs text-violet-600 font-semibold hover:text-violet-500">
                  Forgot password?
                </Link>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] text-sm">
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <p className="text-center text-sm text-gray-500">
            New here?{" "}
            <Link href="/register" className="text-violet-600 font-bold hover:text-violet-500">
              Create a free account
            </Link>
          </p>
        </div>

        {/* Trust row */}
        <div className="flex items-center justify-center gap-6 mt-5">
          {["SSL Secured", "NGN Payments", "Instant orders"].map(t => (
            <div key={t} className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>{t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}