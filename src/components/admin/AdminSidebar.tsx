"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  { href:"/admin",             icon:"📊", label:"Dashboard"  },
  { href:"/admin/messages",    icon:"💬", label:"Messages"   },
  { href:"/admin/blogs",       icon:"📝", label:"Blog Posts" },
  { href:"/admin/portfolio",   icon:"🖼️", label:"Portfolio"  },
  { href:"/admin/services",    icon:"⚡", label:"Services"   },
  { href:"/admin/team",        icon:"👥", label:"Team"       },
  { href:"/admin/subscribers", icon:"📧", label:"Subscribers"},
  { href:"/admin/newsletter",  icon:"📨", label:"Newsletter" },
  { href:"/admin/media",       icon:"🗂️", label:"Media"      },
  { href:"/admin/payments",    icon:"💳", label:"Payments"   },
  { href:"/admin/settings",    icon:"⚙️", label:"Settings"   },
  { href:"/admin/profile",     icon:"👤", label:"My Profile" },
];

interface Props {
  user: { name?: string; email?: string };
  logo?: string;
  siteName?: string;
}

function LogoBadge({ logo, siteName }: { logo?: string; siteName?: string }) {
  if (logo) {
    return (
      <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-slate-800 flex-shrink-0">
        <Image src={logo} alt={siteName || 'Logo'} width={32} height={32} className="w-full h-full object-contain" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-heading font-bold text-white text-xs flex-shrink-0" style={{background:"linear-gradient(135deg,#14B8A6,#3B82F6)"}}>
      {siteName ? siteName.slice(0,2).toUpperCase() : 'JT'}
    </div>
  );
}

export default function AdminSidebar({ user, logo, siteName }: Props) {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => { setIsOpen(false); }, [path]);

  const isActive = (href: string) => href === "/admin" ? path === href : path.startsWith(href);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    window.location.href = window.location.origin + '/admin/login';
  };

  return (
    <>
      {/* --- MOBILE TOP BAR --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2.5">
          <LogoBadge logo={logo} siteName={siteName} />
          <div className="font-heading font-bold text-sm text-white leading-tight">Admin Panel</div>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg bg-slate-800 text-slate-300">
          <span className={`w-5 h-0.5 bg-current rounded-full transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-5 h-0.5 bg-current rounded-full transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-5 h-0.5 bg-current rounded-full transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* --- MOBILE BACKDROP --- */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out
        md:relative md:w-56 md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

        {/* Desktop Branding */}
        <div className="p-5 border-b border-slate-800 hidden md:block">
          <div className="flex items-center gap-2.5">
            <LogoBadge logo={logo} siteName={siteName} />
            <div>
              <div className="font-heading font-bold text-xs leading-tight text-white">
                {siteName || 'Jay TechWave'}
              </div>
              <div className="text-teal-400 text-[10px]">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Header */}
        <div className="p-4 border-b border-slate-800 md:hidden flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Menu</span>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1">✕</button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(n => (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive(n.href)
                  ? "bg-teal-400/12 text-teal-400 border-l-2 border-teal-400 pl-2.5"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span className="text-base w-5 text-center">{n.icon}</span>{n.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <div className="px-3 py-2 mb-1">
            <div className="text-xs font-medium text-white truncate">{user?.name}</div>
            <div className="text-[10px] text-slate-500 truncate">{user?.email}</div>
          </div>
          <Link href="/" target="_blank" className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-teal-400 rounded-lg hover:bg-slate-800 transition-all">
            🌐 View Site
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-all text-left"
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}