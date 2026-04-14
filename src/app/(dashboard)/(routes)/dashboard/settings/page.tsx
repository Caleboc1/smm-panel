"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Settings, User } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (session?.user?.name) setName(session.user.name); }, [session]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/user/update", { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({name}) });
    setSaving(false);
    if (res.ok) toast.success("Profile updated");
    else toast.error("Failed to update");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold" style={{fontFamily:"var(--font-grotesk)"}}>Settings</h2>
      <div className="surface-2 border-subtle rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-violet-400" />
          <h3 className="font-semibold" style={{fontFamily:"var(--font-grotesk)"}}>Profile</h3>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs text-foreground/50 mb-1.5 block">Full Name</label>
            <input value={name} onChange={e=>setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder-white/20 focus:outline-none focus:border-violet-500/40" />
          </div>
          <div>
            <label className="text-xs text-foreground/50 mb-1.5 block">Email</label>
            <input value={session?.user?.email || ""} disabled
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground cursor-not-allowed" />
          </div>
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-foreground text-sm font-medium rounded-xl transition-colors">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
