'use client';
// src/components/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface FooterProps {
  settings: Record<string, string>;
}

export default function Footer({ settings }: FooterProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const subscribe = async () => {
    if (!email || !email.includes('@')) return toast.error('Enter a valid email');
    setLoading(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) { toast.success(data.message || 'Check your email!'); setEmail(''); }
      else toast.error(data.error || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const social = [
    { key: 'social_facebook',  icon: 'fab fa-facebook-f',  label: 'Facebook' },
    { key: 'social_instagram', icon: 'fab fa-instagram',   label: 'Instagram' },
    { key: 'social_linkedin',  icon: 'fab fa-linkedin-in', label: 'LinkedIn' },
    { key: 'social_twitter',   icon: 'fab fa-x-twitter',   label: 'X' },
    { key: 'social_youtube',   icon: 'fab fa-youtube',     label: 'YouTube' },
  ].filter(s => settings[s.key]);

  const companyLinks = [
    { href: '/about',     label: 'About Us' },
    { href: '/team',      label: 'Our Team' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/pricing',   label: 'Pricing' },
    { href: '/blog',      label: 'Blog' },
    { href: '/contact',   label: 'Contact' },
  ];

  const serviceLinks = [
    'Web Development', 'App Development', 'Digital Marketing',
    'Cloud Solutions', 'Cybersecurity', 'IT Consulting',
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-20 pb-0">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-5">
              {settings.logo_url ? (
                <Image src={settings.logo_url} alt={settings.site_name} width={120} height={40} className="h-9 w-auto" />
              ) : (
                <>
                  <div className="w-9 h-9 grad-bg rounded-lg flex items-center justify-center font-heading font-bold text-white text-sm">JT</div>
                  <div className="font-heading text-sm font-bold leading-tight">
                    <span className="text-white block">Jay TechWave</span>
                    <span className="grad-text text-xs font-medium">Solutions</span>
                  </div>
                </>
              )}
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              {settings.site_tagline || "Nairobi's trusted technology partner delivering web, mobile, marketing, cloud and security solutions."}
            </p>
            {social.length > 0 && (
              <div className="flex gap-2">
                {social.map(s => (
                  <a key={s.key} href={settings[s.key]} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg border border-slate-800 bg-slate-900 flex items-center justify-center text-slate-500 hover:border-teal-400/40 hover:text-teal-400 hover:bg-teal-400/5 transition-all text-xs"
                    aria-label={s.label}
                  >
                    <i className={s.icon}></i>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading text-xs font-bold tracking-widest text-white uppercase mb-5">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-slate-500 text-sm hover:text-teal-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-teal-400 transition-colors flex-shrink-0"></span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-xs font-bold tracking-widest text-white uppercase mb-5">Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map(l => (
                <li key={l}>
                  <Link href="/services" className="text-slate-500 text-sm hover:text-teal-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-teal-400 transition-colors flex-shrink-0"></span>
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="font-heading text-xs font-bold tracking-widest text-white uppercase mb-5">Contact</h4>
            <div className="space-y-3 mb-7">
              {settings.contact_email && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-teal-400">✉</span>
                  <a href={`mailto:${settings.contact_email}`} className="text-slate-400 hover:text-teal-400 transition-colors break-all">{settings.contact_email}</a>
                </div>
              )}
              {settings.contact_phone_1 && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-teal-400">☎</span>
                  <a href={`tel:${settings.contact_phone_1}`} className="text-slate-400 hover:text-teal-400 transition-colors">{settings.contact_phone_1}</a>
                </div>
              )}
              {settings.contact_phone_2 && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-teal-400">☎</span>
                  <a href={`tel:${settings.contact_phone_2}`} className="text-slate-400 hover:text-teal-400 transition-colors">{settings.contact_phone_2}</a>
                </div>
              )}
              {settings.contact_address && (
                <div className="flex items-start gap-3 text-sm">
                  <span className="text-teal-400 mt-0.5">📍</span>
                  <span className="text-slate-400">{settings.contact_address}</span>
                </div>
              )}
            </div>

            <h4 className="font-heading text-xs font-bold tracking-widest text-white uppercase mb-3">Newsletter</h4>
            <p className="text-slate-500 text-xs mb-3">Monthly tech tips & updates.</p>
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && subscribe()}
                placeholder="your@email.com"
                className="flex-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-l-lg text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 min-w-0"
              />
              <button
                onClick={subscribe}
                disabled={loading}
                className="px-4 grad-bg text-white font-heading text-xs font-bold rounded-r-lg hover:opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? '…' : '→'}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} <Link href="/" className="text-teal-400">{settings.site_name || 'Jay TechWave Solutions'}</Link>. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="text-slate-600 text-xs hover:text-teal-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="text-slate-600 text-xs hover:text-teal-400 transition-colors">Terms of Use</Link>
            <Link href="/contact" className="text-slate-600 text-xs hover:text-teal-400 transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
