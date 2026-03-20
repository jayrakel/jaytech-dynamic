
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function MessagesPage() {
  const [msgs, setMsgs] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  useEffect(()=>{ fetch(`/api/admin/messages${filter!=="all"?`?status=${filter.toUpperCase()}`:""}`,{credentials:"include"}).then(r=>r.json()).then(d=>Array.isArray(d)&&setMsgs(d)); },[filter]);
  const sc = (s:string) => ({UNREAD:"text-yellow-400 bg-yellow-400/10",READ:"text-blue-400 bg-blue-400/10",REPLIED:"text-green-400 bg-green-400/10",ARCHIVED:"text-slate-500 bg-slate-800"}[s]||"");
  return (
    <div className="p-8">
      <h1 className="font-heading font-black text-2xl mb-1">Messages</h1>
      <p className="text-slate-500 text-sm mb-6">All contact form submissions</p>
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all","unread","read","replied","archived"].map(f=><button key={f} onClick={()=>setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${filter===f?"text-white":"border border-slate-700 text-slate-400 hover:border-teal-400/40 hover:text-teal-400"}`} style={filter===f?{background:"linear-gradient(135deg,#14B8A6,#3B82F6)"}:{}}>{f}</button>)}
      </div>
      <div className="space-y-2">
        {msgs.map(m=>(
          <Link key={m.id} href={`/admin/messages/${m.id}`} className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 hover:border-teal-400/25 rounded-2xl transition-all">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{background:"linear-gradient(135deg,#14B8A6,#3B82F6)"}}>{m.firstName[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-heading font-bold text-sm">{m.firstName} {m.lastName}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${sc(m.status)}`}>{m.status}</span>
                {m.service&&<span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{m.service}</span>}
              </div>
              <p className="text-slate-500 text-xs truncate">{m.message}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-slate-400 text-xs">{m.email}</div>
              <div className="text-slate-600 text-[10px] mt-1">{new Date(m.createdAt).toLocaleDateString()}</div>
            </div>
          </Link>
        ))}
        {msgs.length===0&&<div className="text-center py-16 text-slate-500">No messages found.</div>}
      </div>
    </div>
  );
}
