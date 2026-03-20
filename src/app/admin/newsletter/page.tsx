
"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
export default function NewsletterAdmin() {
  const [form, setForm]   = useState({ subject:"", content:"" });
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [subCount, setSubCount] = useState(0);
  useEffect(()=>{
    fetch("/api/admin/newsletter",{credentials:"include"}).then(r=>r.json()).then(d=>Array.isArray(d)&&setHistory(d));
    fetch("/api/admin/subscribers",{credentials:"include"}).then(r=>r.json()).then(d=>Array.isArray(d)&&setSubCount(d.filter((s:any)=>s.status==="ACTIVE").length));
  },[]);
  const send = async () => {
    if(!form.subject.trim()||!form.content.trim()) return toast.error("Subject and content required");
    if(!confirm(`Send to ${subCount} active subscribers?`)) return;
    setSending(true);
    const res = await fetch("/api/admin/newsletter",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form),credentials:"include"});
    const d = await res.json();
    if(res.ok){ toast.success(`Sent to ${d.sentCount} subscribers!`); setForm({subject:"",content:""}); fetch("/api/admin/newsletter",{credentials:"include"}).then(r=>r.json()).then(d=>Array.isArray(d)&&setHistory(d)); }
    else toast.error(d.error||"Send failed.");
    setSending(false);
  };
  const inp = "w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 transition-all";
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-heading font-black text-2xl mb-1">Newsletter</h1>
      <p className="text-slate-500 text-sm mb-8">{subCount} active subscribers</p>
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-heading font-bold text-lg mb-4">Compose Newsletter</h2>
          <div className="space-y-4">
            <div><label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Subject *</label><input className={inp} value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} placeholder="Monthly Tech Digest — March 2025"/></div>
            <div><label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Content (HTML or plain text) *</label><textarea className={inp} rows={14} value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} placeholder="<h2>This month in tech...</h2><p>Your content here...</p>"/></div>
            <button onClick={send} disabled={sending||subCount===0} className="w-full text-white font-heading font-bold py-3.5 rounded-xl hover:opacity-90 disabled:opacity-50" style={{background:"linear-gradient(135deg,#14B8A6,#3B82F6)"}}>
              {sending?`Sending to ${subCount}…`:`Send to ${subCount} Subscribers →`}
            </button>
            {subCount===0&&<p className="text-xs text-yellow-400 text-center">No active subscribers to send to.</p>}
          </div>
        </div>
        <div>
          <h2 className="font-heading font-bold text-lg mb-4">Sent History</h2>
          <div className="space-y-3">
            {history.map(n=>(
              <div key={n.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="font-medium text-sm mb-1">{n.subject}</div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>📧 {n.sentCount} sent</span>
                  <span>{n.sentAt?new Date(n.sentAt).toLocaleDateString():""}</span>
                </div>
              </div>
            ))}
            {history.length===0&&<p className="text-slate-600 text-sm">No newsletters sent yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
