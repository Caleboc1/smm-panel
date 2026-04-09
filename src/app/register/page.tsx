"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Zap } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); setLoading(false); return; }
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      router.push("/dashboard");
    } catch { toast.error("Something went wrong"); setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[100px]" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl mb-6" style={{fontFamily:"var(--font-grotesk)"}}>
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center"><Zap className="w-5 h-5 text-white" /></div>
            <span className="text-gradient">{process.env.NEXT_PUBLIC_APP_NAME || "SMMPanel"}</span>
          </Link>
          <h1 className="text-2xl font-bold" style={{fontFamily:"var(--font-grotesk)"}}>Create your account</h1>
          <p className="text-white/40 text-sm mt-1">Start growing in minutes</p>
        </div>
        <div className="surface-2 border-subtle rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {(["name","email","password"] as const).map((field) => (
              <div key={field}>
                <label className="text-sm text-white/60 mb-1.5 block capitalize">{field === "name" ? "Full Name" : field}</label>
                <input type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                  value={form[field]} onChange={e => setForm({...form, [field]: e.target.value})} required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
                  placeholder={field === "name" ? "John Doe" : field === "email" ? "you@example.com" : "••••••••"} />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-400 hover:text-violet-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
