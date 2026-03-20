
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function BlogEditor() {
  const { id } = useParams<{id:string}>();
  const router  = useRouter();
  const isNew   = id === "new";
  const [form, setForm] = useState({ title:"", excerpt:"", content:"", category:"Technology", tags:"", published:false, featured:false, coverImage:"" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  useEffect(()=>{
    if (!isNew) fetch(`/api/admin/blogs/${id}`,{credentials:"include"}).then(r=>r.json()).then(d=>{
      if(d) setForm({title:d.title||"",excerpt:d.excerpt||"",content:d.content||"",category:d.category||"Technology",tags:d.tags?.join(",")||"",published:d.published||false,featured:d.featured||false,coverImage:d.coverImage||""});
    });
  },[id,isNew]);
  const set = (k:string,v:any)=>setForm(f=>({...f,[k]:v}));
  const uploadImg = async (file: File) => {
    setUploading(true);
    const fd = new FormData(); fd.append("file",file); fd.append("folder","jaytech/blog");
    const res = await fetch("/api/admin/upload",{method:"POST",body:fd,credentials:"include"});
    const d   = await res.json();
    if (d.url) { set("coverImage",d.url); toast.success("Image uploaded!"); }
    setUploading(false);
  };
  const save = async () => {
    if (!form.title.trim()) return toast.error("Title required");
    setSaving(true);
    const payload = { ...form, tags: form.tags.split(",").map((t:string)=>t.trim()).filter(Boolean) };
    const url  = isNew ? "/api/admin/blogs" : `/api/admin/blogs/${id}`;
    const meth = isNew ? "POST" : "PATCH";
    const res  = await fetch(url,{method:meth,headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),credentials:"include"});
    if (res.ok) { toast.success(isNew?"Post created!":"Post saved!"); if(isNew){const d=await res.json();router.push(`/admin/blogs/${d.id}`);} }
    else toast.error("Save failed.");
    setSaving(false);
  };
  const inp = "w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 transition-all";
  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={()=>router.back()} className="text-slate-500 hover:text-white text-sm transition-colors">← Back</button>
          <h1 className="font-heading font-black text-2xl">{isNew?"New Post":"Edit Post"}</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={()=>set("published",!form.published)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${form.published?"bg-green-400/15 text-green-400":"bg-slate-800 text-slate-400 hover:text-white"}`}>{form.published?"● Published":"○ Draft"}</button>
          <button onClick={save} disabled={saving} className="text-white font-heading font-bold px-6 py-2 rounded-xl hover:opacity-90 disabled:opacity-50 text-sm" style={{background:"linear-gradient(135deg,#14B8A6,#3B82F6)"}}>
            {saving?"Saving…":"Save Post"}
          </button>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div><label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Title *</label><input className={inp} value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Post title..." /></div>
          <div><label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Excerpt</label><textarea className={inp} rows={3} value={form.excerpt} onChange={e=>set("excerpt",e.target.value)} placeholder="Brief summary..." /></div>
          <div><label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Content (HTML)</label><textarea className={`${inp} font-mono text-xs`} rows={18} value={form.content} onChange={e=>set("content",e.target.value)} placeholder="<h2>Heading</h2><p>Your content...</p>" /></div>
        </div>
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div><label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Category</label>
              <select className={inp} value={form.category} onChange={e=>set("category",e.target.value)}>
                {["Technology","Digital Marketing","Web Development","Cloud","Cybersecurity","Business","Design"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Tags (comma separated)</label><input className={inp} value={form.tags} onChange={e=>set("tags",e.target.value)} placeholder="tech, kenya, web" /></div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="feat" checked={form.featured} onChange={e=>set("featured",e.target.checked)} className="accent-teal-400 w-4 h-4" />
              <label htmlFor="feat" className="text-sm text-slate-300 cursor-pointer">Mark as Featured</label>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <label className="text-slate-500 text-xs uppercase tracking-widest block mb-3">Cover Image</label>
            {form.coverImage&&<img src={form.coverImage} alt="Cover" className="w-full h-32 object-cover rounded-xl mb-3"/>}
            <input type="file" accept="image/*" className="hidden" id="cover-upload" onChange={e=>e.target.files?.[0]&&uploadImg(e.target.files[0])} />
            <label htmlFor="cover-upload" className={`w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-slate-700 rounded-xl text-sm text-slate-400 hover:border-teal-400/50 hover:text-teal-400 transition-all cursor-pointer ${uploading?"opacity-50":""}`}>
              {uploading?"Uploading…":"📷 Upload Image"}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
