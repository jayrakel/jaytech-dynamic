"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

export default function PortfolioAdmin() {
  const [projects, setProjects] = useState<any[]>([]);
  
  const load = () => fetch("/api/admin/portfolio",{credentials:"include"}).then(r=>r.json()).then(d=>Array.isArray(d)&&setProjects(d));
  
  // ✅ THE FIX: Wrap load() so it doesn't return a Promise to React
  useEffect(() => {
    load();
  }, []);

  const del = async (id:string) => {
    if (!confirm("Delete project?")) return;
    await fetch(`/api/admin/portfolio/${id}`,{method:"DELETE",credentials:"include"});
    toast.success("Deleted"); load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-heading font-black text-2xl">Portfolio</h1><p className="text-slate-500 text-sm">{projects.length} projects</p></div>
        <Link href="/admin/portfolio/new" className="text-white font-heading font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90" style={{background:"linear-gradient(135deg,#14B8A6,#3B82F6)"}}>+ Add Project</Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(p=>(
          <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-teal-400/25 transition-all group">
            {p.image?<Image src={p.image} alt={p.title} width={400} height={200} className="w-full h-36 object-cover"/>:<div className="w-full h-36 bg-slate-800 flex items-center justify-center text-3xl">📁</div>}
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <span className="font-heading font-bold text-sm">{p.title}</span>
                {p.featured&&<span className="text-[10px] text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded-full">Featured</span>}
              </div>
              <span className="text-xs text-slate-500 block mb-3">{p.category}</span>
              <div className="flex gap-2">
                <Link href={`/admin/portfolio/${p.id}`} className="flex-1 text-center py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs transition-all">Edit</Link>
                <button onClick={()=>del(p.id)} className="flex-1 py-1.5 bg-red-400/10 hover:bg-red-400/20 rounded-lg text-xs text-red-400 transition-all">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {projects.length===0&&<div className="col-span-3 text-center py-16 text-slate-500">No projects yet. <Link href="/admin/portfolio/new" className="text-teal-400">Add your first →</Link></div>}
      </div>
    </div>
  );
}