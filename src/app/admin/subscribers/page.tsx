
"use client";
import { useEffect, useState } from "react";
export default function SubscribersAdmin() {
  const [subs, setSubs] = useState<any[]>([]);
  useEffect(()=>{ fetch("/api/admin/subscribers",{credentials:"include"}).then(r=>r.json()).then(d=>Array.isArray(d)&&setSubs(d)); },[]);
  const active = subs.filter(s=>s.status==="ACTIVE").length;
  return (
    <div className="p-8">
      <div className="flex items-center gap-6 mb-6">
        <div><h1 className="font-heading font-black text-2xl">Subscribers</h1><p className="text-slate-500 text-sm">{active} active · {subs.length} total</p></div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[{l:"Active",v:active,c:"teal"},{l:"Pending",v:subs.filter(s=>s.status==="PENDING").length,c:"yellow"},{l:"Unsubscribed",v:subs.filter(s=>s.status==="UNSUBSCRIBED").length,c:"red"}].map(s=>(
          <div key={s.l} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
            <div className="font-heading font-black text-3xl mb-1" style={{background:"linear-gradient(135deg,#14B8A6,#3B82F6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{s.v}</div>
            <div className="text-slate-500 text-xs uppercase tracking-wider">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {subs.map(s=>(
          <div key={s.id} className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{background:"linear-gradient(135deg,#14B8A6,#3B82F6)"}}>{s.email[0].toUpperCase()}</div>
            <div className="flex-1">
              <div className="font-medium text-sm">{s.email}</div>
              {s.name&&<div className="text-slate-500 text-xs">{s.name}</div>}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${s.status==="ACTIVE"?"text-green-400 bg-green-400/10":s.status==="PENDING"?"text-yellow-400 bg-yellow-400/10":"text-slate-500 bg-slate-800"}`}>{s.status}</span>
            <span className="text-slate-600 text-xs">{new Date(s.createdAt).toLocaleDateString()}</span>
          </div>
        ))}
        {subs.length===0&&<div className="text-center py-16 text-slate-500">No subscribers yet.</div>}
      </div>
    </div>
  );
}
