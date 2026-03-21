"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

const ICON_MAP: Record<string, string> = {
  "code-slash": "💻", "phone": "📱", "megaphone": "📣",
  "cloud-arrow-up": "☁️", "shield-lock": "🔒", "tools": "🔧",
};

export default function ServicesAdmin() {
  const [services, setServices] = useState<any[]>([]);

  const load = () =>
    fetch("/api/admin/services", { credentials: "include" })
      .then(r => r.json())
      .then(d => Array.isArray(d) && setServices(d));

  useEffect(() => { load(); }, []);

  const del = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This will also remove it from the public site.`)) return;
    const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) { toast.success("Service deleted"); load(); }
    else toast.error("Delete failed");
  };

  const toggleActive = async (id: string, active: boolean) => {
    await fetch(`/api/admin/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
      credentials: "include",
    });
    load();
  };

  const moveOrder = async (id: string, direction: "up" | "down") => {
    const idx = services.findIndex(s => s.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= services.length) return;
    const a = services[idx];
    const b = services[swapIdx];
    await Promise.all([
      fetch(`/api/admin/services/${a.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: b.order }), credentials: "include" }),
      fetch(`/api/admin/services/${b.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: a.order }), credentials: "include" }),
    ]);
    load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-black text-2xl">Services</h1>
          <p className="text-slate-500 text-sm">{services.length} services · shown on public site</p>
        </div>
        <Link
          href="/admin/services/new"
          className="text-white font-heading font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all"
          style={{ background: "linear-gradient(135deg,#14B8A6,#3B82F6)" }}
        >
          + Add Service
        </Link>
      </div>

      <div className="space-y-2">
        {services.map((svc, i) => (
          <div
            key={svc.id}
            className={`flex items-center gap-4 p-4 bg-slate-900 border rounded-2xl transition-all ${svc.active ? "border-slate-800 hover:border-teal-400/25" : "border-slate-800 opacity-50"}`}
          >
            {/* Order controls */}
            <div className="flex flex-col gap-0.5 flex-shrink-0">
              <button onClick={() => moveOrder(svc.id, "up")} disabled={i === 0} className="w-6 h-6 rounded text-slate-600 hover:text-teal-400 disabled:opacity-20 text-xs flex items-center justify-center">▲</button>
              <button onClick={() => moveOrder(svc.id, "down")} disabled={i === services.length - 1} className="w-6 h-6 rounded text-slate-600 hover:text-teal-400 disabled:opacity-20 text-xs flex items-center justify-center">▼</button>
            </div>

            <div className="text-2xl w-8 text-center flex-shrink-0">{ICON_MAP[svc.icon] || "⚙️"}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="font-heading font-bold text-sm">{svc.title}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${svc.active ? "text-green-400 bg-green-400/10" : "text-slate-500 bg-slate-800"}`}>
                  {svc.active ? "Visible" : "Hidden"}
                </span>
                <span className="text-[10px] text-slate-600">#{svc.order}</span>
              </div>
              <p className="text-slate-500 text-xs truncate">{svc.description}</p>
              <p className="text-slate-600 text-[10px] mt-0.5">{svc.features?.length || 0} features</p>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => toggleActive(svc.id, svc.active)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${svc.active ? "bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20" : "bg-green-400/10 text-green-400 hover:bg-green-400/20"}`}
              >
                {svc.active ? "Hide" : "Show"}
              </button>
              <Link
                href={`/admin/services/${svc.id}`}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 transition-all"
              >
                Edit
              </Link>
              <button
                onClick={() => del(svc.id, svc.title)}
                className="px-3 py-1.5 bg-red-400/10 hover:bg-red-400/20 rounded-lg text-xs text-red-400 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            No services yet.{" "}
            <Link href="/admin/services/new" className="text-teal-400 hover:underline">
              Add your first service →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}