import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Zap, LayoutDashboard, Package, ShoppingCart, Users } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/dashboard");

  const links = [
    { href:"/admin", label:"Overview", icon:LayoutDashboard },
    { href:"/admin/services", label:"Services", icon:Package },
    { href:"/admin/orders", label:"Orders", icon:ShoppingCart },
    { href:"/admin/users", label:"Users", icon:Users },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <aside className="fixed left-0 top-0 bottom-0 w-56 border-r border-white/5 bg-[#0d0d1a] flex flex-col">
        <div className="h-14 flex items-center px-4 border-b border-white/5">
          <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Admin Panel</span>
        </div>
        <nav className="flex-1 px-2 py-3 flex flex-col gap-1">
          {links.map(l=>(
            <Link key={l.href} href={l.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all">
              <l.icon className="w-4 h-4" />{l.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <Link href="/dashboard" className="text-xs text-white/30 hover:text-white/50">← User Dashboard</Link>
        </div>
      </aside>
      <main className="flex-1 ml-56 p-6">{children}</main>
    </div>
  );
}
