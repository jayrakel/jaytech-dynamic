
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function ProjectEditor() {
  const { id } = useParams<{id:string}>();
  const router  = useRouter();
  const isNew   = id === "new";
  const [form, setForm] = useState({ title:"", description:"", category:"Web Development", tags:"", image:"", liveUrl:"", githubUrl:"", featured:false, order:0 });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  useEffect(()=>{
    if(!isNew) fetch(`/api/admin/portfolio/${id}`,{credentials:"include"}).then(r=>r.json()).then(d=>{
      if(d) setForm({title:d.title||"",description:d.description||"",category:d.category||"Web Development",tags:d.tags?.join(",")||"",image:d.image||"",liveUrl:d.liveUrl||"",githubUrl:d.githubUrl||"",featured:d.featured||false,order:d.order||0});
    });
  },[id,isNew]);
  const set = (k:string,v:any)=>setForm(f=>({...f,[k]:v}));
  const uploadImg = async (file:File) => {
    setUploading(true);
    const fd = new FormData(); fd.append("file",file); fd.append("folder","jaytech/portfolio");
    const res = await fetch("/api/admin/upload",{method:"POST",body:fd,credentials:"include"});
    const d = await res.json();
    if(d.url){set("image",d.url); toast.success("Uploaded!");}
    setUploading(false);
  };
  const save = async () => {
    setSaving(true);
    const payload = {...form, tags:form.tags.split(",").map((t:string)=>t.trim()).filter(Boolean)};
    const url  = isNew ? "/api/admin/portfolio" : `/api/admin/portfolio/${id}`;
    const meth = isNew ? "POST" : "PATCH";
    const res  = await fetch(url,{method:meth,headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),credentials:"include"});
    if(res.ok){toast.success("Saved!"); if(isNew){const d=await res.json();router.push(`/admin/portfolio/${d.id}`);}}
    else toast.error("Save failed.");
    setSaving(false);
  };
  const inp = "w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 transition-all";
  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={()=>router.back()} className="text-slate-500 hover:text-white text-sm transition-colors">← Back</button>
        <h1 className="font-heading font-black text-2xl">{isNew?"Add Project":"Edit Project"}</h1>
      </div>
      <div className="space-y-4">
        <div><label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Title *</label><input className={inp} value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Project name" /></div>
        <div><label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Description *</label><textarea className={inp} rows={3} value={form.description} onChange={e=>set("description",e.target.value)} placeholder="What was built..." /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Category</label>
            <select className={inp} value={form.category} onChange={e=>set("category",e.target.value)}>
              {["Web Development","App Development","Digital Marketing","Cloud Solutions","Cybersecurity","UI/UX Design"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Display Order</label><input type="number" className={inp} value={form.order} onChange={e=>set("order",+e.target.value)} /></div>
        </div>
        <div><label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Tags</label><input className={inp} value={form.tags} onChange={e=>set("tags",e.target.value)} placeholder="react, nodejs, mpesa" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Live URL</label><input className={inp} value={form.liveUrl} onChange={e=>set("liveUrl",e.target.value)} placeholder="https://..." /></div>
          <div><label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">GitHub URL</label><input className={inp} value={form.githubUrl} onChange={e=>set("githubUrl",e.target.value)} placeholder="https://github.com/..." /></div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <label className="text-slate-500 text-xs uppercase tracking-widest block mb-3">Project Image</label>
          {form.image&&<img src={form.image} alt="Project" className="w-full h-40 object-cover rounded-xl mb-3"/>}
          <input type="file" accept="image/*" className="hidden" id="proj-img" onChange={e=>e.target.files?.[0]&&uploadImg(e.target.files[0])} />
          <label htmlFor="proj-img" className={`w-full flex items-center justify-center gap-2 py-3 border border-dashed border-slate-700 rounded-xl text-sm text-slate-400 hover:border-teal-400/50 hover:text-teal-400 transition-all cursor-pointer ${uploading?"opacity-50":""}`}>
            {uploading?"Uploading…":"📷 Upload Image"}
          </label>
        </div>
        <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl">
          <input type="checkbox" id="feat" checked={form.featured} onChange={e=>set("featured",e.target.checked)} className="accent-teal-400 w-4 h-4"/>
          <label htmlFor="feat" className="text-sm text-slate-300 cursor-pointer">Mark as Featured (shown on homepage)</label>
        </div>
        <button onClick={save} disabled={saving} className="w-full text-white font-heading font-bold py-3.5 rounded-xl hover:opacity-90 disabled:opacity-50" style={{background:"linear-gradient(135deg,#14B8A6,#3B82F6)"}}>
          {saving?"Saving…":"Save Project"}
        </button>
      </div>
    </div>
  );
}
