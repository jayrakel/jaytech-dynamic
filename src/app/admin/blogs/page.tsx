
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
export default function BlogsAdmin() {
  const [posts, setPosts] = useState<any[]>([]);
  const load = () => fetch("/api/admin/blogs",{credentials:"include"}).then(r=>r.json()).then(d=>Array.isArray(d)&&setPosts(d));
  useEffect(()=>{ load(); },[]);
  const del = async (id:string) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/admin/blogs/${id}`,{method:"DELETE",credentials:"include"});
    toast.success("Deleted"); load();
  };
  const toggle = async (id:string, published:boolean) => {
    await fetch(`/api/admin/blogs/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({published:!published}),credentials:"include"});
    load();
  };
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-heading font-black text-2xl">Blog Posts</h1><p className="text-slate-500 text-sm">{posts.length} total articles</p></div>
        <Link href="/admin/blogs/new" className="text-white font-heading font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all" style={{background:"linear-gradient(135deg,#14B8A6,#3B82F6)"}}>+ New Post</Link>
      </div>
      <div className="space-y-2">
        {posts.map(p=>(
          <div key={p.id} className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 hover:border-teal-400/25 rounded-2xl transition-all">
            {p.coverImage&&<Image src={p.coverImage} alt={p.title} width={60} height={45} className="w-16 h-12 object-cover rounded-lg flex-shrink-0"/>}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-heading font-bold text-sm truncate">{p.title}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.published?"text-green-400 bg-green-400/10":"text-yellow-400 bg-yellow-400/10"}`}>{p.published?"Published":"Draft"}</span>
                {p.featured&&<span className="text-[10px] text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded-full">Featured</span>}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>{p.category}</span><span>{p.views||0} views</span><span>{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={()=>toggle(p.id,p.published)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${p.published?"bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20":"bg-green-400/10 text-green-400 hover:bg-green-400/20"}`}>{p.published?"Unpublish":"Publish"}</button>
              <Link href={`/admin/blogs/${p.id}`} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 transition-all">Edit</Link>
              <button onClick={()=>del(p.id)} className="px-3 py-1.5 bg-red-400/10 hover:bg-red-400/20 rounded-lg text-xs text-red-400 transition-all">Delete</button>
            </div>
          </div>
        ))}
        {posts.length===0&&<div className="text-center py-16 text-slate-500">No posts yet. <Link href="/admin/blogs/new" className="text-teal-400">Create your first post →</Link></div>}
      </div>
    </div>
  );
}
