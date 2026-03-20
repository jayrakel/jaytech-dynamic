
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  { href:"/admin",             icon:"📊", label:"Dashboard"  },
  { href:"/admin/messages",    icon:"💬", label:"Messages"   },
  { href:"/admin/blogs",       icon:"📝", label:"Blog Posts" },
  { href:"/admin/portfolio",   icon:"🖼️", label:"Portfolio"  },
  { href:"/admin/team",        icon:"👥", label:"Team"       },
  { href:"/admin/subscribers", icon:"📧", label:"Subscribers"},
  { href:"/admin/newsletter",  icon:"📨", label:"Newsletter" },
  { href:"/admin/media",       icon:"🗂️", label:"Media"      },
  { href:"/admin/payments",    icon:"💳", label:"Payments"   },
  { href:"/admin/settings",    icon:"⚙️", label:"Settings"   },
];

export default function AdminSidebar({ user }: { user: { name?: string; email?: string } }) {
  const path = usePathname();
  const isActive = (href: string) => href === "/admin" ? path === href : path.startsWith(href);
  return (
    <aside className="w-56 min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-heading font-bold text-white text-xs" style={{background:"linear-gradient(135deg,#14B8A6,#3B82F6)"}}>JT</div>
          <div><div className="font-heading font-bold text-xs leading-tight">Jay TechWave</div><div className="text-teal-400 text-[10px]">Admin Panel</div></div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(n => (
          <Link key={n.href} href={n.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(n.href) ? "bg-teal-400/12 text-teal-400 border-l-2 border-teal-400 pl-2.5" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}>
            <span className="text-base w-5 text-center">{n.icon}</span>{n.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-800">
        <div className="px-3 py-2 mb-1">
          <div className="text-xs font-medium text-white truncate">{user?.name}</div>
          <div className="text-[10px] text-slate-500 truncate">{user?.email}</div>
        </div>
        <Link href="/" target="_blank" className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-teal-400 rounded-lg hover:bg-slate-800 transition-all">🌐 View Site</Link>
        <button onClick={()=>signOut({callbackUrl:"/admin/login"})} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-all text-left">🚪 Sign Out</button>
      </div>
    </aside>
  );
}
