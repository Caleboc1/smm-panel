"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Zap, Eye, EyeOff } from "lucide-react";

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
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[100px]" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl mb-6" style={{fontFamily:"var(--font-grotesk)"}}>
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center"><Zap className="w-5 h-5 text-foreground" /></div>
            <span className="text-gradient">{process.env.NEXT_PUBLIC_APP_NAME || "SMMPanel"}</span>
          </Link>
          <h1 className="text-2xl font-bold" style={{fontFamily:"var(--font-grotesk)"}}>Welcome back</h1>
          <p className="text-foreground text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="surface-2 border-subtle rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-sm text-foreground/60 mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-sm text-foreground/60 mb-1.5 block">Password</label>
              <div className="relative">
                <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-foreground placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-foreground font-semibold rounded-xl transition-colors">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="text-center text-foreground text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-violet-400 hover:text-violet-300">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
