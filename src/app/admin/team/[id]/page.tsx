
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function TeamMemberEditor() {
  const { id } = useParams<{id:string}>();
  const router  = useRouter();
  const isNew   = id === "new";
  const [form, setForm] = useState({ name:"", role:"", bio:"", image:"", linkedin:"", twitter:"", email:"", order:0, active:true });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  useEffect(()=>{
    if(!isNew) fetch(`/api/admin/team/${id}`,{credentials:"include"}).then(r=>r.json()).then(d=>{ if(d) setForm({name:d.name||"",role:d.role||"",bio:d.bio||"",image:d.image||"",linkedin:d.linkedin||"",twitter:d.twitter||"",email:d.email||"",order:d.order||0,active:d.active!==false}); });
  },[id,isNew]);
  const set = (k:string,v:any)=>setForm(f=>({...f,[k]:v}));
  const uploadImg = async (file:File) => {
    setUploading(true);
    const fd = new FormData(); fd.append("file",file); fd.append("folder","jaytech/team");
    const res = await fetch("/api/admin/upload",{method:"POST",body:fd,credentials:"include"});
    const d = await res.json();
    if(d.url){set("image",d.url); toast.success("Photo uploaded!");}
    setUploading(false);
  };
  const save = async () => {
    if(!form.name.trim()) return toast.error("Name required");
    setSaving(true);
    const url  = isNew ? "/api/admin/team" : `/api/admin/team/${id}`;
    const meth = isNew ? "POST" : "PATCH";
    const res  = await fetch(url,{method:meth,headers:{"Content-Type":"application/json"},body:JSON.stringify(form),credentials:"include"});
    if(res.ok){toast.success("Saved!"); if(isNew)router.push("/admin/team");}
    else toast.error("Save failed.");
    setSaving(false);
  };
  const inp = "w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 transition-all";
  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={()=>router.back()} className="text-slate-500 hover:text-white text-sm">← Back</button>
        <h1 className="font-heading font-black text-2xl">{isNew?"Add Team Member":"Edit Member"}</h1>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Full Name *</label><input className={inp} value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Jane Doe"/></div>
          <div><label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Role / Title *</label><input className={inp} value={form.role} onChange={e=>set("role",e.target.value)} placeholder="Lead Developer"/></div>
        </div>
        <div><label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Bio</label><textarea className={inp} rows={3} value={form.bio} onChange={e=>set("bio",e.target.value)} placeholder="Short bio..."/></div>
        <div className="grid grid-cols-3 gap-4">
          <div><label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Email</label><input type="email" className={inp} value={form.email} onChange={e=>set("email",e.target.value)}/></div>
          <div><label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">LinkedIn URL</label><input className={inp} value={form.linkedin} onChange={e=>set("linkedin",e.target.value)}/></div>
          <div><label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">X / Twitter URL</label><input className={inp} value={form.twitter} onChange={e=>set("twitter",e.target.value)}/></div>
        </div>
        <div><label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Display Order</label><input type="number" className={inp} value={form.order} onChange={e=>set("order",+e.target.value)}/></div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <label className="text-slate-500 text-xs uppercase tracking-widest block mb-3">Profile Photo</label>
          {form.image&&<img src={form.image} alt="Photo" className="w-24 h-24 object-cover rounded-full mb-3"/>}
          <input type="file" accept="image/*" className="hidden" id="team-photo" onChange={e=>e.target.files?.[0]&&uploadImg(e.target.files[0])}/>
          <label htmlFor="team-photo" className={`inline-flex items-center gap-2 px-4 py-2 border border-dashed border-slate-700 rounded-xl text-sm text-slate-400 hover:border-teal-400/50 hover:text-teal-400 cursor-pointer transition-all ${uploading?"opacity-50":""}`}>{uploading?"Uploading…":"📷 Upload Photo"}</label>
        </div>
        <button onClick={save} disabled={saving} className="w-full text-white font-heading font-bold py-3.5 rounded-xl hover:opacity-90 disabled:opacity-50" style={{background:"linear-gradient(135deg,#14B8A6,#3B82F6)"}}>
          {saving?"Saving…":"Save Member"}
        </button>
      </div>
    </div>
  );
}
