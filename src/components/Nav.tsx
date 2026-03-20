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
  const [stuck, setStuck]   = useState(false);
const [open,  setOpen]    = useState(false);
const [drop,  setDrop]    = useState(false);
const [mounted, setMounted] = useState(false);
const { theme, setTheme } = useTheme();
const pathname            = usePathname();

useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fn = () => setStuck(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  const links = [
    { href: '/',          label: 'Home' },
    { href: '/about',     label: 'About' },
    { href: '/services',  label: 'Services' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/blog',      label: 'Blog' },
    { href: '/contact',   label: 'Contact' },
  ];

  const moreLinks = [
    { href: '/pricing',  label: 'Pricing Plans' },
    { href: '/team',     label: 'Our Team' },
    { href: '/privacy',  label: 'Privacy Policy' },
    { href: '/terms',    label: 'Terms of Use' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        stuck
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 py-3'
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            {settings.logo_url ? (
              <Image src={settings.logo_url} alt={settings.site_name} width={120} height={40} className="h-9 w-auto object-contain" />
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
                    ? 'text-white bg-white/8'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}>{l.label}</Link>
              </li>
            ))}
            <li className="relative" onMouseLeave={() => setDrop(false)}>
              <button
                onMouseEnter={() => setDrop(true)}
                className="px-3 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all flex items-center gap-1"
              >
                More <span className="text-xs">▾</span>
              </button>
              {drop && (
                <ul className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[180px] bg-slate-800 border border-slate-700 rounded-xl p-2 shadow-2xl">
                  {moreLinks.map(l => (
                    <li key={l.href}>
                      <Link href={l.href} className="block px-3 py-2.5 text-sm text-slate-300 hover:text-teal-400 hover:bg-teal-400/5 rounded-lg transition-all">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
  className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-teal-400 hover:border-teal-400/40 transition-all text-sm"
  aria-label="Toggle theme"
  suppressHydrationWarning
>
  {mounted ? (theme === 'dark' ? '☀️' : '🌙') : '🌙'}
</button>

            {/* CTA */}
            <Link href="/contact" className="hidden lg:inline-flex grad-bg text-white text-xs font-heading font-bold px-5 py-2.5 rounded-lg hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-teal-500/20">
              Get a Quote
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800"
              aria-label="Open menu"
            >
              <span className="w-5 h-0.5 bg-slate-300 rounded-full"></span>
              <span className="w-5 h-0.5 bg-slate-300 rounded-full"></span>
              <span className="w-3.5 h-0.5 bg-slate-300 rounded-full"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-[999] bg-slate-950/97 flex flex-col items-center justify-center gap-7">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-5 right-6 w-10 h-10 flex items-center justify-center border border-slate-700 rounded-lg text-slate-400 hover:text-white"
          >
            ✕
          </button>
          {[...links, ...moreLinks].map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`font-heading text-2xl font-bold transition-all ${
                isActive(l.href) ? 'grad-text' : 'text-slate-400 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)} className="grad-bg text-white font-heading font-bold px-8 py-3 rounded-xl text-sm mt-2">
            Get a Quote
          </Link>
        </div>
      )}
    </>
  );
}
