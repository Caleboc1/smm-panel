import { prisma } from "@/lib/prisma";
import { formatNGN } from "@/lib/utils";

const STATUS_COLORS: Record<string,string> = {
  COMPLETED:"text-emerald-400 bg-emerald-400/10", PENDING:"text-yellow-400 bg-yellow-400/10",
  PROCESSING:"text-blue-400 bg-blue-400/10", ACTIVE:"text-blue-400 bg-blue-400/10",
  CANCELLED:"text-red-400 bg-red-400/10", FAILED:"text-red-400 bg-red-400/10",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    take: 100, orderBy: { createdAt: "desc" },
    include: { user:{ select:{ email:true } }, service:true },
  }) as Array<{
    id: string;
    user: { email: string };
    service: { name: string };
    link: string;
    quantity: number;
    charge: number;
    status: string;
    createdAt: string | Date;
  }>;
  const total = await prisma.order.count();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{fontFamily:"var(--font-grotesk)"}}>Orders ({total.toLocaleString()})</h1>
      <div className="surface-2 border-subtle rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-white/[0.02]">
              <tr>{["ID","User","Service","Link","Qty","Charge","Status","Date"].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-foreground/30 uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {orders.map(o=>(
                <tr key={o.id} className="border-t border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-foreground/30 font-mono">#{o.id.slice(-6)}</td>
                  <td className="px-4 py-3 text-foreground/60 max-w-[120px] truncate">{o.user.email}</td>
                  <td className="px-4 py-3 text-foreground/80 max-w-[160px] truncate">{o.service.name}</td>
                  <td className="px-4 py-3 text-foreground max-w-[100px] truncate">{o.link}</td>
                  <td className="px-4 py-3 text-foreground/50 font-mono">{o.quantity.toLocaleString()}</td>
                  <td className="px-4 py-3 text-emerald-400 font-mono">{formatNGN(o.charge)}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status]||"text-foreground bg-white/5"}`}>{o.status}</span></td>
                  <td className="px-4 py-3 text-foreground/30">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
