"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, ClipboardList, Wallet, Settings, Zap, Code, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "SMMPanel";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/new-order", label: "New Order", icon: ShoppingCart },
  { href: "/dashboard/orders", label: "My Orders", icon: ClipboardList },
  { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { href: "/dashboard/api", label: "API Access", icon: Code },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const path = usePathname();
  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col border-r border-white/5 bg-[#0d0d1a]">
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg" style={{ fontFamily: "var(--font-grotesk)" }}>
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-foreground" />
          </div>
          <span className="text-gradient">{APP_NAME}</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {links.map((l) => {
          const active = path === l.href || (l.href !== "/dashboard" && path.startsWith(l.href));
          return (
            <Link key={l.href} href={l.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/20"
                  : "text-foreground/50 hover:text-foreground/80 hover:bg-white/5"
              )}>
              <l.icon className="w-4 h-4" />
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 pb-4">
        <Link href="/"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:text-foreground/70 hover:bg-white/5 transition-all">
          <LogOut className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </aside>
  );
}