
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function MessageDetail() {
  const { id } = useParams<{id:string}>();
  const router = useRouter();
  const [msg, setMsg] = useState<any>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  useEffect(()=>{ if(id) fetch(`/api/admin/messages/${id}`,{credentials:"include"}).then(r=>r.json()).then(setMsg); },[id]);
  const sendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    const res = await fetch(`/api/admin/messages/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({reply}),credentials:"include"});
    if (res.ok) { toast.success("Reply sent to client!"); const d = await res.json(); setMsg(d); setReply(""); }
    else toast.error("Failed to send.");
    setSending(false);
  };
  const archive = async () => {
    await fetch(`/api/admin/messages/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"ARCHIVED"}),credentials:"include"});
    toast.success("Archived."); router.push("/admin/messages");
  };
  if (!msg) return <div className="p-8 text-slate-500 animate-pulse">Loading message…</div>;
  return (
    <div className="p-8 max-w-3xl">
      <button onClick={()=>router.back()} className="text-slate-500 hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors">← Back to Messages</button>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-5">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{background:"linear-gradient(135deg,#14B8A6,#3B82F6)"}}>{msg.firstName[0]}</div>
            <div><div className="font-heading font-bold text-lg">{msg.firstName} {msg.lastName}</div><a href={`mailto:${msg.email}`} className="text-teal-400 text-sm hover:underline">{msg.email}</a>{msg.phone&&<span className="text-slate-500 text-sm ml-3">{msg.phone}</span>}</div>
          </div>
          <div className="text-right text-xs text-slate-500"><div>{new Date(msg.createdAt).toLocaleString()}</div>{msg.service&&<div className="text-teal-400 mt-1">{msg.service}</div>}{msg.budget&&<div className="text-slate-500 mt-0.5">{msg.budget}</div>}</div>
        </div>
        <div className="p-5 bg-slate-800 rounded-xl text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{msg.message}</div>
      </div>
      {msg.reply&&(
        <div className="bg-slate-900 border border-teal-400/20 rounded-2xl p-6 mb-5">
          <div className="text-xs text-teal-400 font-bold uppercase tracking-widest mb-3">Reply Sent — {new Date(msg.repliedAt).toLocaleString()}</div>
          <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{msg.reply}</div>
        </div>
      )}
      {msg.status!=="REPLIED"&&(
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="font-heading font-bold mb-4">Reply to {msg.firstName}</h3>
          <textarea rows={6} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 mb-4 resize-none transition-all" placeholder={`Hi ${msg.firstName},\n\nThank you for reaching out...`} value={reply} onChange={e=>setReply(e.target.value)} />
          <div className="flex gap-3">
            <button onClick={sendReply} disabled={sending||!reply.trim()} className="text-white font-heading font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 text-sm" style={{background:"linear-gradient(135deg,#14B8A6,#3B82F6)"}}>
              {sending?"Sending…":"Send Reply via Email →"}
            </button>
            <button onClick={archive} className="border border-slate-700 text-slate-400 font-bold px-4 py-3 rounded-xl hover:border-red-400/40 hover:text-red-400 transition-all text-sm">Archive</button>
          </div>
        </div>
      )}
    </div>
  );
}
