// src/app/(public)/about/page.tsx
import { getSettings } from '@/lib/settings';
import { prisma } from '@/lib/prisma';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';
import Image from 'next/image';
export const revalidate = 60;

export default async function AboutPage() {
  const [s, teamMembers] = await Promise.all([
    getSettings(),
    prisma.teamMember.findMany({ where: { active: true }, orderBy: { order: 'asc' }, take: 4 }),
  ]);

  const highlights = [
    s.about_highlight_1, s.about_highlight_2,
    s.about_highlight_3, s.about_highlight_4,
  ].filter(Boolean);

  const values = [
    { icon: s.about_value_1_icon, title: s.about_value_1_title, desc: s.about_value_1_desc },
    { icon: s.about_value_2_icon, title: s.about_value_2_title, desc: s.about_value_2_desc },
    { icon: s.about_value_3_icon, title: s.about_value_3_title, desc: s.about_value_3_desc },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* HERO */}
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-24">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/5 text-teal-400 text-xs font-heading font-bold tracking-widest uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-dot"></span>About Us
            </span>
            <h1 className="font-heading font-black text-5xl mb-6">
              We Turn Tech Into <span className="grad-text">Business Results</span>
            </h1>
            <p className="text-slate-400 leading-relaxed text-lg mb-5">{s.about_story}</p>
            <p className="text-slate-500 leading-relaxed mb-8">{s.about_story2}</p>
            {highlights.length > 0 && (
              <ul className="space-y-3 mb-8">
                {highlights.map(v => (
                  <li key={v} className="flex items-center gap-3 text-slate-300 text-sm">
                    <span className="w-5 h-5 rounded-md bg-teal-400/10 text-teal-400 flex items-center justify-center text-xs flex-shrink-0">✓</span>
                    {v}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-3 flex-wrap">
              <Link href="/contact" className="grad-bg text-white font-heading font-bold px-7 py-3.5 rounded-xl hover:opacity-90 transition-all text-sm">Work With Us →</Link>
              <Link href="/team" className="border border-teal-400/30 text-white font-heading font-bold px-7 py-3.5 rounded-xl hover:bg-teal-400/5 transition-all text-sm">Meet the Team</Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100} className="relative hidden lg:block">
            <div className="rounded-3xl overflow-hidden border border-slate-700">
              {s.hero_image ? (
                <Image src={s.hero_image} alt="About" width={600} height={460} className="w-full h-[460px] object-cover" />
              ) : (
                <div className="w-full h-[460px] bg-gradient-to-br from-teal-400/10 to-blue-400/10 flex items-center justify-center text-8xl">🏢</div>
              )}
            </div>
            <div className="absolute -bottom-6 -right-6 p-5 card-dark rounded-2xl text-center">
              <div className="font-heading font-black text-3xl grad-text">{s.stat_years || '5+'}</div>
              <div className="text-slate-500 text-xs mt-1 uppercase tracking-wider">Years in Business</div>
            </div>
          </ScrollReveal>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 border border-slate-800 rounded-2xl overflow-hidden mb-24">
          {[
            { v: s.stat_projects || '150+',     l: 'Projects'    },
            { v: s.stat_clients  || '80+',      l: 'Clients'     },
            { v: s.stat_years    || '5+',       l: 'Years'       },
            { v: s.stat_satisfaction || '99%',  l: 'Satisfaction'},
          ].map(st => (
            <div key={st.l} className="bg-slate-900 hover:bg-slate-800 transition-colors py-10 text-center">
              <div className="font-heading font-black text-4xl grad-text mb-2">{st.v}</div>
              <div className="text-slate-500 text-xs uppercase tracking-wider">{st.l}</div>
            </div>
          ))}
        </div>

        {/* VALUES */}
        <ScrollReveal className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/5 text-teal-400 text-xs font-heading font-bold tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-dot"></span>Our Values
          </span>
          <h2 className="font-heading font-black text-4xl">What <span className="grad-text">Drives Us</span></h2>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {values.map((v, i) => v.title && (
            <ScrollReveal key={i} delay={i * 80} className="card-dark p-7 rounded-2xl hover:border-teal-400/30 transition-all">
              <div className="text-3xl mb-4">{v.icon || '⭐'}</div>
              <h3 className="font-heading font-bold text-lg mb-2">{v.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
            </ScrollReveal>
          ))}
        </div>

        {/* TEAM PREVIEW */}
        {teamMembers.length > 0 && (
          <>
            <ScrollReveal className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/5 text-teal-400 text-xs font-heading font-bold tracking-widest uppercase mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-dot"></span>The Team
              </span>
              <h2 className="font-heading font-black text-4xl">The <span className="grad-text">People</span> Behind It All</h2>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {teamMembers.map((m, i) => (
                <ScrollReveal key={m.id} delay={i * 80} className="group card-dark rounded-2xl overflow-hidden hover:border-teal-400/30 transition-all">
                  {m.image ? (
                    <Image src={m.image} alt={m.name} width={300} height={300} className="w-full h-52 object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-52 bg-slate-800 flex items-center justify-center text-5xl">👤</div>
                  )}
                  <div className="p-5">
                    <div className="font-heading font-bold">{m.name}</div>
                    <div className="text-teal-400 text-sm mt-0.5">{m.role}</div>
                    {m.bio && <p className="text-slate-500 text-xs mt-2 leading-relaxed line-clamp-2">{m.bio}</p>}
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <div className="text-center mb-24">
              <Link href="/team" className="border border-teal-400/30 text-white font-heading font-bold px-8 py-3.5 rounded-xl hover:bg-teal-400/5 transition-all text-sm">View Full Team →</Link>
            </div>
          </>
        )}

        {/* CTA */}
        <ScrollReveal className="p-12 card-dark rounded-3xl text-center">
          <h2 className="font-heading font-black text-3xl mb-4">Ready to Work With <span className="grad-text">Us?</span></h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">Free 30-minute consultation. We will map out exactly how to grow your business with technology.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="grad-bg text-white font-heading font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-all text-sm">Start a Conversation →</Link>
            <Link href="/services" className="border border-teal-400/30 text-white font-heading font-bold px-8 py-3.5 rounded-xl hover:bg-teal-400/5 transition-all text-sm">Explore Services</Link>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}