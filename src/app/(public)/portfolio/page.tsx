"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

export default function PortfolioPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filter, setFilter]   = useState("all");
  const [settings, setSettings] = useState<Record<string,string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    Promise.all([
      fetch("/api/portfolio").then(r => r.json()),
      fetch("/api/settings").then(r => r.json())
    ]).then(([projectData, settingsData]) => {
      setProjects(projectData);
      setSettings(settingsData);
      setLoading(false); 
    }).catch(() => {
      setLoading(false);
    });
  }, []);
  
  const cats = ["all", ...Array.from(new Set(projects.map(p => p.category)))];
  const filtered = filter === "all" ? projects : projects.filter(p => p.category === filter);

  // ✅ FIX: Instead of a second spinner, return null.
  // The GlobalLoader is already on top, so this prevents "flicker" 
  // without showing a second conflicting animation.
  if (loading) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        <ScrollReveal className="mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/5 text-teal-400 text-xs font-heading font-bold tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-dot"></span>
            Portfolio
          </span>
          <h1 className="font-heading font-black text-5xl mb-4">Work We&apos;re <span className="grad-text">Proud Of</span></h1>
          
          <p className="text-slate-400 text-lg max-w-xl">
            {settings.stat_projects || '150+'} projects delivered across Kenya and East Africa.
          </p>
        </ScrollReveal>

        <div className="flex gap-2 flex-wrap mb-10">
          {cats.map(c => (
            <button 
              key={c} 
              onClick={()=>setFilter(c as string)} 
              className={`px-5 py-2 rounded-full text-sm font-bold font-heading transition-all ${filter===c?"grad-bg text-white shadow-lg shadow-teal-500/20":"border border-slate-700 text-slate-400 hover:border-teal-400/40 hover:text-teal-400"}`}
            >
              {String(c).charAt(0).toUpperCase()+String(c).slice(1)}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <Link href={`/portfolio/${p.id}`} key={p.id} className={`group block relative rounded-2xl overflow-hidden border border-slate-800 hover:border-teal-400/35 transition-all cursor-pointer hover:-translate-y-1 ${i===0?"md:col-span-2":""}`}>
              {p.image ? (
                <Image src={p.image} alt={p.title} width={800} height={400} className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${i===0?"h-80":"h-60"}`}/>
              ) : (
                <div className={`w-full bg-slate-800 flex items-center justify-center text-4xl ${i===0?"h-80":"h-60"}`}>📁</div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <span className="text-[10px] font-heading font-bold tracking-widest uppercase text-teal-400 bg-teal-400/15 px-3 py-1 rounded-full w-fit mb-2">{p.category}</span>
                <h3 className="font-heading font-bold text-lg text-white">{p.title}</h3>
                <p className="text-slate-400 text-sm mt-1 line-clamp-2">{p.description}</p>
                <span className="mt-4 text-teal-400 text-sm font-bold flex items-center gap-2">View Case Study <span className="group-hover:translate-x-1 transition-transform">→</span></span>
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No projects found. <Link href="/admin/portfolio" className="text-teal-400 underline">Add one in admin →</Link>
          </div>
        )}
      </div>
    </div>
  );
}