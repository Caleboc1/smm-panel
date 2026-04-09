import { prisma } from "@/lib/prisma";
import { formatNGN } from "@/lib/utils";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id:true, name:true, email:true, balance:true, role:true, createdAt:true, _count:{ select:{ orders:true } } },
  });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{fontFamily:"var(--font-grotesk)"}}>Users ({users.length})</h1>
      <div className="surface-2 border-subtle rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.02]">
              <tr>{["Name","Email","Balance","Orders","Role","Joined"].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-white/30 text-xs uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {users.map(u=>(
                <tr key={u.id} className="border-t border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white/80">{u.name||"—"}</td>
                  <td className="px-4 py-3 text-white/60 text-xs">{u.email}</td>
                  <td className="px-4 py-3 text-emerald-400 font-mono text-xs">{formatNGN(u.balance)}</td>
                  <td className="px-4 py-3 text-white/50">{u._count.orders}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${u.role==="ADMIN"?"text-violet-400 bg-violet-400/10":"text-white/30 bg-white/5"}`}>{u.role}</span></td>
                  <td className="px-4 py-3 text-white/30 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
