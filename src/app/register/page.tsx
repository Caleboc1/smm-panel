"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Zap } from "lucide-react";
import Image from "next/image";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "SMMPanel";

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
    <div className="min-h-screen relative flex items-center justify-center px-4 relative overflow-hidden font-space-mono">
       <div className="absolute inset-0 pointer-events-none animated-grid-wave"
        style={{
          backgroundImage: "linear-gradient(rgba(124,58,237,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,.06) 1px,transparent 1px)",
          backgroundSize: "48px 48px"
        }} />
      {/* Background blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] bg-violet-200 rounded-full opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-[220px] h-[220px] bg-purple-200 rounded-full opacity-40 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[140px] h-[140px] bg-violet-100 rounded-full opacity-60 pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        {/* Floating tags */}
        <div className="absolute -top-4 -right-2 bg-white border border-violet-100 rounded-xl px-3 py-1.5 text-xs font-semibold text-violet-700 flex items-center gap-2 shadow-sm">
          <span className="w-2 h-2 bg-violet-400 rounded-full"></span> Free to start
        </div>
        <div className="absolute -bottom-4 -left-2 bg-white border border-violet-100 rounded-xl px-3 py-1.5 text-xs font-semibold text-violet-700 shadow-sm">
          18,000+ creators trust us
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-2">Get started</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-violet-100 shadow-xl shadow-violet-100/50">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
              <Image src={"/CalebSmmLogo.png"} alt="Logo" width={50} height={50} className="rounded-full" />
  
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "name" as const, label: "Full name", type: "text", placeholder: "John Doe" },
              { key: "email" as const, label: "Email address", type: "email", placeholder: "you@example.com" },
              { key: "password" as const, label: "Password", type: "password", placeholder: "Min. 8 characters" },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required
                  className="w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/10 transition-all"
                  placeholder={placeholder} />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] text-sm">
              {loading ? "Creating account..." : "Create account — it's free"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            By signing up you agree to our{" "}
            <Link href="/terms" className="text-violet-600 hover:text-violet-500">Terms</Link>
            {" & "}
            <Link href="/privacy" className="text-violet-600 hover:text-violet-500">Privacy Policy</Link>
          </p>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-600 font-bold hover:text-violet-500">Sign in</Link>
          </p>
        </div>

        {/* Trust row */}
        <div className="flex items-center justify-center gap-6 mt-5">
          {["No credit card", "Instant access", "NGN pricing"].map(t => (
            <div key={t} className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>{t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}