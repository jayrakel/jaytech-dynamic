
import { prisma } from "@/lib/prisma";
import Link from "next/link";
export default async function AdminDashboard() {
  const [msgTotal, posts, projects, subs, unread, recentMsgs] = await Promise.all([
    prisma.message.count(),
    prisma.post.count(),
    prisma.project.count(),
    prisma.subscriber.count({where:{status:"ACTIVE"}}),
    prisma.message.count({where:{status:"UNREAD"}}),
    prisma.message.findMany({orderBy:{createdAt:"desc"},take:5}),
  ]);
  const stats = [
    {icon:"💬",label:"Total Messages",val:msgTotal,sub:`${unread} unread`,href:"/admin/messages"},
    {icon:"📝",label:"Blog Posts",val:posts,sub:"total articles",href:"/admin/blogs"},
    {icon:"🖼️",label:"Projects",val:projects,sub:"portfolio items",href:"/admin/portfolio"},
    {icon:"📧",label:"Subscribers",val:subs,sub:"active emails",href:"/admin/subscribers"},
  ];
  return (
    <div className="p-8">
      <div className="mb-8"><h1 className="font-heading font-black text-3xl mb-1">Dashboard</h1><p className="text-slate-500 text-sm">Welcome back! Here is what is happening.</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s=>(
          <Link key={s.label} href={s.href} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl hover:border-teal-400/30 transition-all group">
            <div className="flex items-center justify-between mb-4"><span className="text-2xl">{s.icon}</span>{s.label==="Total Messages"&&unread>0&&<span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full" style={{background:"linear-gradient(135deg,#14B8A6,#3B82F6)"}}>{unread} new</span>}</div>
            <div className="font-heading font-black text-3xl mb-1" style={{background:"linear-gradient(135deg,#14B8A6,#3B82F6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{s.val}</div>
            <div className="text-slate-500 text-xs">{s.sub}</div>
          </Link>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5"><h2 className="font-heading font-bold">Recent Messages</h2><Link href="/admin/messages" className="text-teal-400 text-xs hover:text-teal-300">View all →</Link></div>
          <div className="space-y-2">
            {recentMsgs.map(m=>(
              <Link key={m.id} href={`/admin/messages/${m.id}`} className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{background:"linear-gradient(135deg,#14B8A6,#3B82F6)"}}>{m.firstName[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><span className="font-medium text-sm">{m.firstName} {m.lastName}</span>{m.status==="UNREAD"&&<span className="w-1.5 h-1.5 bg-teal-400 rounded-full"></span>}</div>
                  <p className="text-slate-500 text-xs truncate">{m.message}</p>
                </div>
                <span className="text-slate-600 text-[10px]">{new Date(m.createdAt).toLocaleDateString()}</span>
              </Link>
            ))}
            {recentMsgs.length===0&&<p className="text-slate-600 text-sm text-center py-6">No messages yet.</p>}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="font-heading font-bold mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {[{href:"/admin/blogs/new",icon:"✏️",label:"New Blog Post"},{href:"/admin/portfolio/new",icon:"➕",label:"Add Project"},{href:"/admin/team/new",icon:"👤",label:"Add Team Member"},{href:"/admin/newsletter",icon:"📨",label:"Send Newsletter"},{href:"/admin/settings",icon:"⚙️",label:"Site Settings"},{href:"/admin/media",icon:"🗂️",label:"Media Library"}].map(a=>(
              <Link key={a.href} href={a.href} className="flex items-center gap-2.5 p-3.5 bg-slate-800 rounded-xl hover:bg-slate-700 hover:border hover:border-teal-400/20 transition-all">
                <span>{a.icon}</span><span className="text-sm font-medium">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
