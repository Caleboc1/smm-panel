import { prisma } from "@/lib/prisma";
import { formatNGN } from "@/lib/utils";

export default async function AdminOverview() {
  const [users, orders, revenue, services] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.transaction.aggregate({ where: { type:"CREDIT", status:"COMPLETED" }, _sum: { amount: true } }),
    prisma.service.count({ where: { isActive: true } }),
  ]);

  const stats = [
    { label:"Total Users", value: users.toLocaleString() },
    { label:"Total Orders", value: orders.toLocaleString() },
    { label:"Total Revenue", value: formatNGN(revenue._sum.amount || 0) },
    { label:"Active Services", value: services.toLocaleString() },
  ];

  const recentOrders = await prisma.order.findMany({
    take: 10, orderBy: { createdAt: "desc" },
    include: { user: { select:{ email:true } }, service: true },
  }) as Array<{
    id: string;
    user: { email: string };
    service: { name: string };
    quantity: number;
    charge: number;
    status: string;
    createdAt: string | Date;
  }>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{fontFamily:"var(--font-grotesk)"}}>Admin Overview</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s=>(
          <div key={s.label} className="surface-2 border-subtle rounded-2xl p-5">
            <div className="text-2xl font-bold font-mono text-white mb-1">{s.value}</div>
            <div className="text-xs text-white/40">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="surface-2 border-subtle rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5"><h3 className="font-semibold">Recent Orders</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-white/[0.02]">
              <tr>{["User","Service","Qty","Charge","Status","Date"].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-white/30 uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {recentOrders.map(o=>(
                <tr key={o.id} className="border-t border-white/[0.03]">
                  <td className="px-4 py-3 text-white/60">{o.user.email}</td>
                  <td className="px-4 py-3 text-white/80 max-w-[150px] truncate">{o.service.name}</td>
                  <td className="px-4 py-3 text-white/50 font-mono">{o.quantity.toLocaleString()}</td>
                  <td className="px-4 py-3 text-emerald-400 font-mono">{formatNGN(o.charge)}</td>
                  <td className="px-4 py-3 text-white/50">{o.status}</td>
                  <td className="px-4 py-3 text-white/30">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
