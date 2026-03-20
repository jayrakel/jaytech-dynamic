"use client";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [settings, setSettings] = useState<Record<string,string>>({});
  const router = useRouter();

  // Fetch the public settings to get the logo and site name
  useEffect(() => {
    fetch("/api/settings").then(r=>r.json()).then(setSettings).catch(()=>console.log("Settings not loaded"));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    const res = await signIn("credentials", { ...form, redirect: false });
    if (res?.ok) { router.push("/admin"); }
    else { setError("Invalid email or password."); setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4" style={{backgroundImage:"linear-gradient(rgba(20,184,166,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(20,184,166,.03) 1px,transparent 1px)",backgroundSize:"60px 60px"}}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          
          {/* Dynamically show logo if it exists, otherwise fallback to JT */}
          {settings.logo_url ? (
            <img src={settings.logo_url} alt="Logo" className="h-20 mx-auto mb-4 object-contain" />
          ) : (
            <div className="w-12 h-12 mx-auto rounded-xl grad-bg flex items-center justify-center font-heading font-bold text-white text-lg mb-4">JT</div>
          )}

          <h1 className="font-heading font-black text-2xl">Admin Login</h1>
          <p className="text-slate-500 text-sm mt-1">{settings.site_name || "Jay TechWave Solutions"}</p>
        </div>
        <div className="p-8 card-dark rounded-2xl">
          {error && <div className="mb-4 p-3 bg-red-400/10 border border-red-400/30 rounded-xl text-red-400 text-sm">{error}</div>}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-slate-500 text-xs uppercase tracking-widest mb-2">Email</label>
              <input required type="email" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 transition-all" placeholder="admin@jaytechwavesolutions.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
            </div>
            <div>
              <label className="block text-slate-500 text-xs uppercase tracking-widest mb-2">Password</label>
              <input required type="password" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 transition-all" placeholder="••••••••" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
            </div>
            <button type="submit" disabled={loading} className="w-full grad-bg text-white font-heading font-bold py-3.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 mt-2">
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}