"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

export default function TeamAdmin() {
  const [members, setMembers] = useState<any[]>([]);
  
  const load = () => fetch("/api/admin/team",{credentials:"include"}).then(r=>r.json()).then(d=>Array.isArray(d)&&setMembers(d));
  
  // ✅ THE FIX: Wrap load() in an anonymous function so it doesn't return a Promise
  useEffect(() => {
    load();
  }, []);
  
  const del = async (id:string) => {
    if(!confirm("Remove team member?")) return;
    await fetch(`/api/admin/team/${id}`,{method:"DELETE",credentials:"include"});
    toast.success("Removed"); 
    load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-heading font-black text-2xl">Team Members</h1><p className="text-slate-500 text-sm">{members.length} members</p></div>
        <Link href="/admin/team/new" className="text-white font-heading font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90" style={{background:"linear-gradient(135deg,#14B8A6,#3B82F6)"}}>+ Add Member</Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map(m=>(
          <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-teal-400/25 transition-all">
            {m.image?<Image src={m.image} alt={m.name} width={400} height={200} className="w-full h-40 object-cover object-top"/>:<div className="w-full h-40 bg-slate-800 flex items-center justify-center text-5xl">👤</div>}
            <div className="p-4">
              <div className="font-heading font-bold text-sm">{m.name}</div>
              <div className="text-teal-400 text-xs mt-0.5 mb-3">{m.role}</div>
              <div className="flex gap-2">
                <Link href={`/admin/team/${m.id}`} className="flex-1 text-center py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs transition-all">Edit</Link>
                <button onClick={()=>del(m.id)} className="flex-1 py-1.5 bg-red-400/10 hover:bg-red-400/20 rounded-lg text-xs text-red-400 transition-all">Remove</button>
              </div>
            </div>
          </div>
        ))}
        {members.length===0&&<div className="col-span-3 text-center py-16 text-slate-500">No team members. <Link href="/admin/team/new" className="text-teal-400">Add one →</Link></div>}
      </div>
    </div>
  );
}