"use client";
import { useEffect, useState } from "react";
import { formatNGN } from "@/lib/utils";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";

export default function AdminServicesPage() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [services, setServices] = useState<any[]>([]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:"", categoryId:"", minOrder:"100", maxOrder:"100000", rate:"", description:"", upstreamId:"", refill:false, cancel:false });

  async function load() {
    setLoading(true);
    const [svcs, cats] = await Promise.all([
      fetch("/api/admin/services").then(r=>r.json()),
      fetch("/api/categories").then(r=>r.json()),
    ]);
    setServices(svcs); setCategories(cats); setLoading(false);
  }
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [svcs, cats] = await Promise.all([
        fetch("/api/admin/services").then(r => r.json()),
        fetch("/api/categories").then(r => r.json()),
      ]);
      setServices(svcs);
      setCategories(cats);
      setLoading(false);
    };
    fetchData();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/services", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({...form,minOrder:parseInt(form.minOrder),maxOrder:parseInt(form.maxOrder),rate:parseFloat(form.rate)}) });
    if (res.ok) { toast.success("Service created"); setShowForm(false); load(); }
    else toast.error("Failed to create");
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/admin/services/${id}`, { method:"DELETE" });
    toast.success("Deleted"); load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{fontFamily:"var(--font-grotesk)"}}>Services</h1>
        <button onClick={()=>setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-foreground text-sm font-medium rounded-xl">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {showForm && (
        <div className=" rounded-2xl p-6">
          <h3 className="font-semibold mb-5">New Service</h3>
          <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-4">
            {[
              {label:"Service Name",field:"name",type:"text",placeholder:"e.g. Instagram Followers | HQ | Non Drop"},
              {label:"Upstream API ID",field:"upstreamId",type:"text",placeholder:"ID from wholesale provider"},
              {label:"Rate (NGN per 1000)",field:"rate",type:"number",placeholder:"e.g. 1500"},
              {label:"Min Order",field:"minOrder",type:"number",placeholder:"100"},
              {label:"Max Order",field:"maxOrder",type:"number",placeholder:"100000"},
            ].map(({label,field,type,placeholder})=>(
              <div key={field}>
                <label className="text-xs text-foreground/50 mb-1.5 block">{label}</label>
                <input type={type} 
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value={(form as any)[field]} onChange={e=>setForm({...form,[field]:e.target.value})} placeholder={placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder-white/20 focus:outline-none focus:border-violet-500/40" required={field!=="upstreamId"} />
              </div>
            ))}
            <div>
              <label className="text-xs text-foreground/50 mb-1.5 block">Category</label>
              <select value={form.categoryId} onChange={e=>setForm({...form,categoryId:e.target.value})} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-violet-500/40">
                <option value="">Select category</option>
                {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                categories.map((c:any)=><option key={c.id} value={c.id}>{c.platform} — {c.name}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-foreground/50 mb-1.5 block">Description</label>
              <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder-white/20 focus:outline-none focus:border-violet-500/40 resize-none"
                placeholder="Service description..." />
            </div>
            <div className="sm:col-span-2 flex items-center gap-6">
              {(["refill","cancel"] as const).map(f=>(
                <label key={f} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form[f]} onChange={e=>setForm({...form,[f]:e.target.checked})} className="accent-violet-500" />
                  <span className="text-sm text-foreground/60 capitalize">{f} enabled</span>
                </label>
              ))}
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-foreground text-sm font-medium rounded-xl">Create Service</button>
              <button type="button" onClick={()=>setShowForm(false)} className="px-5 py-2.5 border border-white/10 text-foreground/50 text-sm rounded-xl hover:border-white/20">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className=" rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-white/[0.02]">
              <tr>{["Name","Category","Rate/1K","Min","Max","Active",""].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-foreground/30 uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="px-4 py-10 text-center text-foreground/30">Loading...</td></tr>
              : 
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
              services.map((s:any)=>(
                <tr key={s.id} className="border-t border-white/[0.03]">
                  <td className="px-4 py-3 text-foreground/80 max-w-[200px] truncate">{s.name}</td>
                  <td className="px-4 py-3 text-foreground">{s.category?.platform}</td>
                  <td className="px-4 py-3 text-emerald-400 font-mono">{formatNGN(s.rate)}</td>
                  <td className="px-4 py-3 text-foreground font-mono">{s.minOrder.toLocaleString()}</td>
                  <td className="px-4 py-3 text-foreground font-mono">{s.maxOrder.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${s.isActive?"text-emerald-400 bg-emerald-400/10":"text-red-400 bg-red-400/10"}`}>{s.isActive?"Yes":"No"}</span></td>
                  <td className="px-4 py-3">
                    <button onClick={()=>handleDelete(s.id)} className="text-red-400/40 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
