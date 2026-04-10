import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatNGN } from "@/lib/utils";
import { ShoppingCart, TrendingUp, Clock, CheckCircle, Wallet, Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [user, totalOrders, pendingOrders, completedOrders, recentOrders] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { balance: true, name: true } }),
    prisma.order.count({ where: { userId } }),
    prisma.order.count({ where: { userId, status: { in: ["PENDING", "PROCESSING", "ACTIVE"] } } }),
    prisma.order.count({ where: { userId, status: "COMPLETED" } }),
    prisma.order.findMany({
      where: { userId }, take: 5,
      include: { service: { include: { category: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const stats = [
    { label: "Wallet Balance", value: formatNGN(user?.balance ?? 0), icon: Wallet, color: "text-emerald-400", bg: "bg-white", href: "/dashboard/wallet" },
    { label: "Total Orders", value: totalOrders.toString(), icon: ShoppingCart, color: "text-blue-400", bg: "bg-white", href: "/dashboard/orders" },
    { label: "Active Orders", value: pendingOrders.toString(), icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10", href: "/dashboard/orders?status=active" },
    { label: "Completed", value: completedOrders.toString(), icon: CheckCircle, color: "text-violet-400", bg: "bg-violet-500/10", href: "/dashboard/orders?status=completed" },
  ];

  const statusColors: Record<string, string> = {
    COMPLETED: "text-emerald-400 bg-emerald-400/10",
    PENDING: "text-yellow-400 bg-yellow-400/10",
    PROCESSING: "text-blue-400 bg-blue-400/10",
    ACTIVE: "text-blue-400 bg-blue-400/10",
    CANCELLED: "text-red-400 bg-red-400/10",
    FAILED: "text-red-400 bg-red-400/10",
    PARTIAL: "text-orange-400 bg-orange-400/10",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{fontFamily:"var(--font-grotesk)"}}>Dashboard</h2>
        <Link href="/dashboard/new-order"
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> New Order
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}
            className="bg-background rounded-2xl p-5 hover:border-violet-500/20 transition-all group">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</div>
            <div className="text-xs text-white/40 mt-1">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className=" border-subtle rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-semibold" style={{fontFamily:"var(--font-grotesk)"}}>Recent Orders</h3>
          <Link href="/dashboard/orders" className="text-sm text-violet-400 hover:text-violet-300">View all</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="px-6 py-12 text-center text-white/30 bg-white">
            <ShoppingCart className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p>No orders yet.</p>
            <Link href="/dashboard/new-order" className="mt-3 inline-block text-violet-400 text-sm">Place your first order →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/[0.02]">
                  {["Service","Qty","Charge","Status","Date"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-white/30 font-medium text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id} className="border-t border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-white/80 max-w-[200px] truncate">{o.service.name}</td>
                    <td className="px-4 py-3 text-white/50 font-mono">{o.quantity.toLocaleString()}</td>
                    <td className="px-4 py-3 text-emerald-400 font-mono">{formatNGN(o.charge)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[o.status] || "text-white/40"}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/30 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
