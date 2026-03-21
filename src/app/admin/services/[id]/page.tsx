"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ICONS = [
  { value: "code-slash",    label: "💻 Web Dev"     },
  { value: "phone",         label: "📱 Mobile Apps" },
  { value: "megaphone",     label: "📣 Marketing"   },
  { value: "cloud-arrow-up",label: "☁️ Cloud"       },
  { value: "shield-lock",   label: "🔒 Security"    },
  { value: "tools",         label: "🔧 IT Support"  },
  { value: "chart-bar",     label: "📊 Analytics"   },
  { value: "globe",         label: "🌐 Other"       },
];

export default function ServiceEditor() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();
  const isNew   = id === "new";

  const [form, setForm] = useState({
    title: "", description: "", icon: "code-slash",
    features: [""], order: 0, active: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/services/${id}`, { credentials: "include" })
        .then(r => r.json())
        .then(d => {
          if (d) setForm({
            title:       d.title       || "",
            description: d.description || "",
            icon:        d.icon        || "code-slash",
            features:    d.features?.length ? d.features : [""],
            order:       d.order       || 0,
            active:      d.active      !== false,
          });
        });
    }
  }, [id, isNew]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  // Feature list helpers
  const setFeature = (i: number, val: string) => {
    const f = [...form.features];
    f[i] = val;
    set("features", f);
  };
  const addFeature    = () => set("features", [...form.features, ""]);
  const removeFeature = (i: number) => set("features", form.features.filter((_: any, idx: number) => idx !== i));

  const save = async () => {
    if (!form.title.trim()) return toast.error("Title required");
    if (!form.description.trim()) return toast.error("Description required");
    setSaving(true);
    const payload = {
      ...form,
      features: form.features.map((f: string) => f.trim()).filter(Boolean),
    };
    const url  = isNew ? "/api/admin/services" : `/api/admin/services/${id}`;
    const meth = isNew ? "POST" : "PATCH";
    const res  = await fetch(url, {
      method: meth,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    if (res.ok) {
      toast.success(isNew ? "Service created!" : "Service saved!");
      router.push("/admin/services");
    } else {
      toast.error("Save failed.");
    }
    setSaving(false);
  };

  const inp = "w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 transition-all";

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-white text-sm transition-colors">← Back</button>
        <h1 className="font-heading font-black text-2xl">{isNew ? "New Service" : "Edit Service"}</h1>
      </div>

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Service Title *</label>
          <input className={inp} value={form.title} onChange={e => set("title", e.target.value)} placeholder="Web Development" />
        </div>

        {/* Description */}
        <div>
          <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Description *</label>
          <textarea className={inp} rows={3} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Brief description shown on the services page..." />
        </div>

        {/* Icon picker */}
        <div>
          <label className="text-slate-500 text-xs uppercase tracking-widest block mb-3">Icon</label>
          <div className="grid grid-cols-4 gap-2">
            {ICONS.map(ic => (
              <button
                key={ic.value}
                onClick={() => set("icon", ic.value)}
                className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all text-center ${form.icon === ic.value ? "text-white border-2 border-teal-400" : "bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"}`}
                style={form.icon === ic.value ? { background: "linear-gradient(135deg,rgba(20,184,166,.2),rgba(59,130,246,.2))" } : {}}
              >
                {ic.label}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-slate-500 text-xs uppercase tracking-widest">Features / Bullet Points</label>
            <button onClick={addFeature} className="text-teal-400 text-xs hover:text-teal-300 font-bold transition-colors">+ Add Feature</button>
          </div>
          <div className="space-y-2">
            {form.features.map((f: string, i: number) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-teal-400 text-xs flex-shrink-0">✓</span>
                <input
                  className={`${inp} flex-1`}
                  value={f}
                  onChange={e => setFeature(i, e.target.value)}
                  placeholder={`Feature ${i + 1}...`}
                />
                {form.features.length > 1 && (
                  <button onClick={() => removeFeature(i)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-red-400 transition-colors text-lg flex-shrink-0">×</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order & Active */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Display Order</label>
            <input type="number" className={inp} value={form.order} onChange={e => set("order", +e.target.value)} />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => set("active", !form.active)}
                className={`relative w-11 h-6 rounded-full transition-colors ${form.active ? "bg-teal-500" : "bg-slate-700"}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.active ? "translate-x-5" : ""}`} />
              </div>
              <span className="text-sm text-slate-300">{form.active ? "Visible on site" : "Hidden"}</span>
            </label>
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="w-full text-white font-heading font-bold py-3.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
          style={{ background: "linear-gradient(135deg,#14B8A6,#3B82F6)" }}
        >
          {saving ? "Saving…" : isNew ? "Create Service" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}