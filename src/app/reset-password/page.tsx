"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Unable to reset password");
        return;
      }

      toast.success(data.message || "Password updated");
      router.push("/login");
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
        <div className="bg-white rounded-2xl p-8 border border-violet-100 shadow-xl shadow-violet-100/50">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Image src="/CalebSmmLogo.png" alt="Logo" width={50} height={50} className="rounded-full" />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900">Create a new password</h1>
            <p className="mt-2 text-sm text-gray-500">Choose a strong password with at least 8 characters.</p>
          </div>

          {!token ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Reset link is missing. <Link href="/forgot-password" className="font-semibold underline">Request a new link</Link>.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">New password</label>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 pr-12 border-[1.5px] border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/10 transition-all"
                    placeholder="Minimum 8 characters"
                  />
                  <button type="button" onClick={() => setShow(!show)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Confirm password</label>
                <input
                  type={show ? "text" : "password"}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/10 transition-all"
                  placeholder="Repeat password"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] text-sm">
                {loading ? "Updating..." : "Update password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
