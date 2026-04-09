"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "SMMPanel";

export function LandingNav() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#0a0a0f]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl" style={{fontFamily:"var(--font-grotesk)"}}>
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-gradient">{APP_NAME}</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <Link href="/services" className="hover:text-white transition-colors">Services</Link>
          <Link href="/api-docs" className="hover:text-white transition-colors">API</Link>
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <Link href="/dashboard" className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-white/70 hover:text-white text-sm transition-colors">Sign In</Link>
              <Link href="/register" className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-white/70" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#0a0a0f] px-4 py-4 flex flex-col gap-4">
          <Link href="/services" className="text-white/70 hover:text-white">Services</Link>
          <Link href="/api-docs" className="text-white/70 hover:text-white">API</Link>
          {session ? (
            <Link href="/dashboard" className="text-center px-4 py-2 bg-violet-600 text-white rounded-lg">Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="text-white/70">Sign In</Link>
              <Link href="/register" className="text-center px-4 py-2 bg-violet-600 text-white rounded-lg">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
