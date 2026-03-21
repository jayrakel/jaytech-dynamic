'use client';
// src/components/Nav.tsx
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface NavProps {
  settings: Record<string, string>;
}

export default function Nav({ settings }: NavProps) {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fn = () => setStuck(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Auto-close menu on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  const moreLinks = [
    { href: '/pricing', label: 'Pricing Plans' },
    { href: '/team', label: 'Our Team' },
    { href: '/quote',    label: '✨ AI Quote Estimator' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Use' },
    { href: '/license',  label: 'License' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[110] transition-all duration-300 ${
        stuck
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 py-3'
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8 relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            {settings.logo_url ? (
              <Image src={settings.logo_url} alt={settings.site_name} width={120} height={70} className="h-30 w-auto object-contain" />
            ) : (
              <>
                <div className="w-9 h-9 grad-bg rounded-lg flex items-center justify-center font-heading font-bold text-white text-sm">JT</div>
                <div className="font-heading text-sm font-bold leading-tight">
                  <span className="text-white block">Jay TechWave</span>
                  <span className="grad-text text-xs font-medium tracking-wide">Solutions</span>
                </div>
              </>
            )}
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <li key={l.href}>
                <Link href={l.href} className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive(l.href)
                    ? 'text-white bg-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}>{l.label}</Link>
              </li>
            ))}
            
            <li 
              className="relative" 
              onMouseEnter={() => setDrop(true)} 
              onMouseLeave={() => setDrop(false)}
            >
              <button className="px-3 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all flex items-center gap-1">
                More <span className={`transition-transform duration-200 ${drop ? 'rotate-180' : ''}`}>▾</span>
              </button>
              
              {drop && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 animate-in fade-in zoom-in-95 duration-200">
                  <ul className="min-w-[200px] bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-2xl backdrop-blur-xl">
                    {moreLinks.map(l => (
                      <li key={l.href}>
                        <Link 
                          href={l.href} 
                          onClick={() => setDrop(false)}
                          className="block px-4 py-2.5 text-sm text-slate-400 hover:text-teal-400 hover:bg-teal-400/5 rounded-lg transition-all"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 text-slate-400 hover:text-teal-400 hover:border-teal-400/40 transition-all text-sm"
              aria-label="Toggle theme"
            >
              {mounted ? (theme === 'dark' ? '☀️' : '🌙') : '🌙'}
            </button>

            <Link href="/contact" className="hidden lg:inline-flex grad-bg text-white text-xs font-heading font-bold px-5 py-2.5 rounded-lg hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-teal-500/20">
              Get a Quote
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-800/50 relative z-[130]"
              aria-label="Toggle menu"
            >
              <span className={`w-5 h-0.5 bg-slate-300 rounded-full transition-all duration-300 ${open ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-slate-300 rounded-full transition-all duration-300 ${open ? 'opacity-0' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-slate-300 rounded-full transition-all duration-300 ${open ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
          </div>

          {/* --- MOBILE DROPDOWN BOX --- */}
          {open && (
            <div className="lg:hidden absolute top-full right-0 mt-4 w-[280px] bg-slate-900/98 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[120] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300 origin-top-right">
              <div className="flex flex-col p-3 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 py-2">Navigation</span>
                {links.map(l => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-xl font-heading font-bold text-sm transition-all flex items-center justify-between ${
                      isActive(l.href) ? 'bg-teal-400/10 text-teal-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {l.label}
                    {isActive(l.href) && <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.8)]"></span>}
                  </Link>
                ))}

                <div className="h-px bg-slate-800 my-2 mx-4" />
                
                <div className="grid grid-cols-1 gap-1">
                  {moreLinks.map(l => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>

                <div className="pt-4 pb-2">
                  <Link 
                    href="/contact" 
                    onClick={() => setOpen(false)} 
                    className="flex items-center justify-center w-full grad-bg text-white font-heading font-bold py-3 rounded-xl text-xs shadow-lg shadow-teal-500/20"
                  >
                    Request a Quote
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Backdrop: Lower z-index than Nav but higher than Page Content */}
      {open && (
        <div 
          className="fixed inset-0 z-[105] bg-slate-950/40 backdrop-blur-md lg:hidden transition-all duration-500" 
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}