"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function MediaAdmin() {
  const [media, setMedia] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const load = () => fetch("/api/admin/media",{credentials:"include"}).then(r=>r.json()).then(d=>Array.isArray(d)&&setMedia(d));
  
  // ✅ THE FIX: Wrap load() in an anonymous function so it doesn't return a Promise
  useEffect(() => {
    load();
  }, []);

  const upload = async (file:File) => {
    setUploading(true);
    const fd = new FormData(); fd.append("file",file); fd.append("folder","jaytech/library");
    const res = await fetch("/api/admin/upload",{method:"POST",body:fd,credentials:"include"});
    const d = await res.json();
    if(d.id){toast.success("Uploaded!"); load();}
    else toast.error("Upload failed.");
    setUploading(false);
  };

  const del = async (id:string, publicId:string) => {
    await fetch("/api/admin/upload",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,publicId}),credentials:"include"});
    toast.success("Deleted"); load();
  };

  const copy = (url:string) => { navigator.clipboard.writeText(url); toast.success("URL copied!"); };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-heading font-black text-2xl">Media Library</h1><p className="text-slate-500 text-sm">{media.length} files</p></div>
        <div>
          <input type="file" accept="image/*,application/pdf" multiple className="hidden" id="media-up" onChange={e=>{Array.from(e.target.files||[]).forEach(f=>upload(f));}}/>
          <label htmlFor="media-up" className={`cursor-pointer text-white font-heading font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all ${uploading?"opacity-50":""}`} style={{background:"linear-gradient(135deg,#14B8A6,#3B82F6)"}}>
            {uploading?"Uploading…":"📤 Upload Files"}
          </label>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {media.map(m=>(
          <div key={m.id} className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-teal-400/30 transition-all">
            {m.type==="image"?<Image src={m.url} alt={m.name} width={200} height={150} className="w-full h-24 object-cover"/>:<div className="w-full h-24 bg-slate-800 flex items-center justify-center text-3xl">📄</div>}
            <div className="p-2">
              <p className="text-xs text-slate-400 truncate mb-2">{m.name}</p>
              <div className="flex gap-1">
                <button onClick={()=>copy(m.url)} className="flex-1 py-1 bg-teal-400/10 hover:bg-teal-400/20 rounded text-[10px] text-teal-400 transition-all">Copy URL</button>
                <button onClick={()=>del(m.id,m.publicId)} className="flex-1 py-1 bg-red-400/10 hover:bg-red-400/20 rounded text-[10px] text-red-400 transition-all">Del</button>
              </div>
            </div>
          </div>
        ))}
        {media.length===0&&<div className="col-span-6 text-center py-16 text-slate-500">No media uploaded yet. Upload files to build your media library.</div>}
      </div>
    </div>
  );
}