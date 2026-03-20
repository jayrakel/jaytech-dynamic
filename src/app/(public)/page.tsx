// src/app/(public)/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { getSettings } from '@/lib/settings';
import { prisma } from '@/lib/prisma';
import ContactForm from '@/components/ContactForm';
import ScrollReveal from '@/components/ScrollReveal';

export const revalidate = 60;

export default async function HomePage() {
  const [settings, services, projects, posts] = await Promise.all([
    getSettings(),
    prisma.service.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
    prisma.project.findMany({ where: { featured: true }, orderBy: { order: 'asc' }, take: 6 }),
    prisma.post.findMany({ where: { published: true }, orderBy: { publishedAt: 'desc' }, take: 3 }),
  ]);

  const iconMap: Record<string, string> = {
    'code-slash': '💻', 'phone': '📱', 'megaphone': '📣',
    'cloud-arrow-up': '☁️', 'shield-lock': '🔒', 'tools': '🔧',
  };
  const iconColors = ['teal', 'blue', 'green', 'orange', 'pink', 'purple'];

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="min-h-screen flex items-center relative overflow-hidden bg-[var(--bg-dark)] pt-20">
        {/* Grid bg */}
        <div className="absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(rgba(20,184,166,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(20,184,166,.04) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl animate-float [animation-delay:-4s] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center py-16">
            {/* Text */}
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/5 text-teal-400 text-xs font-heading font-bold tracking-widest uppercase mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_#14B8A6] animate-pulse-dot"></span>
                🇰🇪 &nbsp;Nairobi&apos;s Premier IT Partner
              </div>
              <h1 className="font-heading font-black text-5xl lg:text-6xl leading-[1.07] mb-6">
                {settings.hero_title
                  ? settings.hero_title.split(' ').map((word, i) =>
                      ['Digital', 'Solutions', 'Growth'].includes(word)
                        ? <span key={i} className="grad-text">{word} </span>
                        : word + ' '
                    )
                  : <>We Build <span className="grad-text">Digital Solutions</span> That Drive Real Growth</>
                }
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
                {settings.hero_subtitle || "From web development and mobile apps to cloud infrastructure and digital marketing — Jay TechWave Solutions is the technology partner Kenya's businesses trust."}
              </p>
              <div className="flex flex-wrap gap-4 mb-14">
                <Link href="/contact" className="grad-bg text-white font-heading font-bold px-7 py-3.5 rounded-xl hover:opacity-90 hover:-translate-y-1 transition-all shadow-lg shadow-teal-500/25 text-sm">
                  {settings.hero_cta_primary || 'Start Your Project'} →
                </Link>
                <Link href="/services" className="border border-teal-400/30 text-white font-heading font-bold px-7 py-3.5 rounded-xl hover:bg-teal-400/5 hover:border-teal-400/60 hover:-translate-y-1 transition-all text-sm">
                  {settings.hero_cta_secondary || 'Explore Services'}
                </Link>
              </div>
              {/* Stats */}
              <div className="flex gap-10 pt-8 border-t border-slate-800">
                {[
                  { val: settings.stat_projects || '150+', lbl: 'Projects Done' },
                  { val: settings.stat_clients  || '80+',  lbl: 'Happy Clients' },
                  { val: settings.stat_years    || '5+',   lbl: 'Years Active' },
                  { val: '24/7', lbl: 'Support' },
                ].map(s => (
                  <div key={s.lbl}>
                    <div className="font-heading font-black text-3xl grad-text leading-none">{s.val}</div>
                    <div className="text-slate-500 text-xs uppercase tracking-wider mt-1.5">{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="relative hidden lg:block">
              <div className="rounded-3xl overflow-hidden border border-slate-700/50">
                {settings.hero_image ? (
                  <Image src={settings.hero_image} alt="Hero" width={600} height={480} className="w-full h-[480px] object-cover" />
                ) : (
                  <div className="w-full h-[480px] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🚀</div>
                      <p className="text-slate-500 font-heading font-bold">Upload hero image<br/>in Admin → Settings</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Floating badges */}
              {[
                { pos: 'top-6 -left-8',  bg: 'bg-teal-400/10',  icon: '🛡️', lbl: 'Security',    val: 'Enterprise Grade', delay: '' },
                { pos: 'bottom-20 -right-7', bg: 'bg-blue-400/10', icon: '📈', lbl: 'Client ROI',  val: '+300%',            delay: '[animation-delay:-3s]' },
                { pos: 'top-1/2 -left-10 -translate-y-1/2', bg: 'bg-green-400/10', icon: '⚡', lbl: 'Delivery', val: 'On Time Always', delay: '[animation-delay:-1.5s]' },
              ].map(b => (
                <div key={b.lbl} className={`absolute ${b.pos} flex items-center gap-3 px-4 py-3 bg-slate-900/85 border border-slate-700 rounded-2xl backdrop-blur-xl shadow-2xl animate-float ${b.delay}`}>
                  <div className={`w-9 h-9 rounded-xl ${b.bg} flex items-center justify-center text-base`}>{b.icon}</div>
                  <div><div className="text-slate-500 text-[10px] uppercase tracking-widest">{b.lbl}</div><div className="font-heading font-bold text-sm text-white">{b.val}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ───────────────────────────────────────── */}
      <div className="border-y border-slate-800 bg-slate-900 py-5 overflow-hidden">
        <div className="flex gap-14 animate-marquee w-max">
          {['Web Development','Mobile Apps','Digital Marketing','Cloud Solutions','Cybersecurity','UI/UX Design','IT Consulting','SEO & Growth',
            'Web Development','Mobile Apps','Digital Marketing','Cloud Solutions','Cybersecurity','UI/UX Design','IT Consulting','SEO & Growth'].map((t, i) => (
            <span key={i} className="flex items-center gap-3 whitespace-nowrap font-heading text-xs font-bold tracking-widest uppercase text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shadow-[0_0_6px_#14B8A6]"></span>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── SERVICES ──────────────────────────────────────── */}
      <section className="py-28 bg-[var(--bg-dark)]">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/5 text-teal-400 text-xs font-heading font-bold tracking-widest uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-dot"></span>What We Do
            </span>
            <h2 className="font-heading font-black text-4xl lg:text-5xl mb-4">
              Services Built for <span className="grad-text">Modern Business</span>
            </h2>
            <p className="text-slate-400 max-w-xl text-lg leading-relaxed">End-to-end technology solutions to launch, grow, and secure your business in the digital age.</p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((svc, i) => (
              <ScrollReveal key={svc.id} delay={i % 3 * 80} className="group p-8 card-dark hover:border-teal-400/35 hover:-translate-y-1 transition-all duration-300 cursor-default relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-xs font-heading font-bold tracking-widest text-slate-600 uppercase mb-4">0{i + 1}</div>
                <div className="text-3xl mb-5">{iconMap[svc.icon] || '⚙️'}</div>
                <h3 className="font-heading font-bold text-lg mb-3">{svc.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">{svc.description}</p>
                <Link href="/services" className="text-teal-400 text-sm font-bold font-heading flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn more <span>→</span>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services" className="border border-teal-400/30 text-white font-heading font-bold px-8 py-3.5 rounded-xl hover:bg-teal-400/5 hover:border-teal-400/60 transition-all text-sm inline-flex items-center gap-2">
              View All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <div className="border-y border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-800">
            {[
              { val: settings.stat_projects || '150+', lbl: 'Projects Completed' },
              { val: settings.stat_clients  || '80+',  lbl: 'Happy Clients' },
              { val: settings.stat_years    || '5+',   lbl: 'Years Experience' },
              { val: settings.stat_satisfaction || '99%', lbl: 'Client Satisfaction' },
            ].map(s => (
              <div key={s.lbl} className="py-10 px-8 text-center hover:bg-slate-800/50 transition-colors">
                <div className="font-heading font-black text-4xl grad-text mb-2">{s.val}</div>
                <div className="text-slate-500 text-xs uppercase tracking-wider">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PORTFOLIO PREVIEW ─────────────────────────────── */}
      {projects.length > 0 && (
        <section className="py-28 bg-slate-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end gap-6 mb-16 flex-wrap">
              <ScrollReveal>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/5 text-teal-400 text-xs font-heading font-bold tracking-widest uppercase mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-dot"></span>Our Work
                </span>
                <h2 className="font-heading font-black text-4xl">Recent <span className="grad-text">Projects</span></h2>
              </ScrollReveal>
              <Link href="/portfolio" className="border border-slate-700 text-slate-400 font-heading font-bold px-6 py-2.5 rounded-xl hover:border-teal-400/40 hover:text-teal-400 transition-all text-sm">
                View All Work →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.slice(0, 6).map((p, i) => (
                <ScrollReveal key={p.id} delay={i % 3 * 80} className={`group relative rounded-2xl overflow-hidden border border-slate-800 hover:border-teal-400/35 transition-all cursor-pointer ${i === 0 ? 'md:col-span-2' : ''}`}>
                  {p.image ? (
                    <Image src={p.image} alt={p.title} width={800} height={400} className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${i === 0 ? 'h-80' : 'h-56'}`} />
                  ) : (
                    <div className={`w-full bg-slate-800 flex items-center justify-center ${i === 0 ? 'h-80' : 'h-56'}`}>
                      <span className="text-4xl">📁</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <span className="text-[10px] font-heading font-bold tracking-widest uppercase text-teal-400 bg-teal-400/15 px-3 py-1 rounded-full w-fit mb-2">{p.category}</span>
                    <h3 className="font-heading font-bold text-lg">{p.title}</h3>
                    <p className="text-slate-400 text-sm mt-1">{p.tags?.join(' · ')}</p>
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 grad-bg rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">↗</div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BLOG PREVIEW ──────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="py-28 bg-[var(--bg-dark)]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end gap-6 mb-16 flex-wrap">
              <ScrollReveal>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/5 text-teal-400 text-xs font-heading font-bold tracking-widest uppercase mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-dot"></span>Latest Insights
                </span>
                <h2 className="font-heading font-black text-4xl">From Our <span className="grad-text">Blog</span></h2>
              </ScrollReveal>
              <Link href="/blog" className="border border-slate-700 text-slate-400 font-heading font-bold px-6 py-2.5 rounded-xl hover:border-teal-400/40 hover:text-teal-400 transition-all text-sm">
                All Articles →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <ScrollReveal key={post.id} delay={i * 80}>
                  <Link href={`/blog/${post.slug}`} className="group block card-dark hover:border-teal-400/35 hover:-translate-y-1 transition-all overflow-hidden rounded-2xl">
                    {post.coverImage && (
                      <div className="overflow-hidden">
                        <Image src={post.coverImage} alt={post.title} width={600} height={300} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-heading font-bold tracking-widest uppercase text-teal-400 bg-teal-400/10 px-3 py-1 rounded-full">{post.category}</span>
                        <span className="text-slate-600 text-xs">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) : ''}</span>
                      </div>
                      <h3 className="font-heading font-bold text-base leading-snug mb-2 group-hover:text-teal-400 transition-colors">{post.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-24 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(20,184,166,.08),transparent_55%),radial-gradient(ellipse_at_70%_50%,rgba(59,130,246,.06),transparent_55%)]" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/5 text-teal-400 text-xs font-heading font-bold tracking-widest uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-dot"></span>Let&apos;s Build Together
            </span>
            <h2 className="font-heading font-black text-4xl lg:text-5xl mb-5">
              Ready to Transform <span className="grad-text">Your Business?</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">Tell us about your project and we&apos;ll get back to you within 2 hours with a free consultation.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="grad-bg text-white font-heading font-bold px-8 py-4 rounded-xl hover:opacity-90 hover:-translate-y-1 transition-all text-sm shadow-lg shadow-teal-500/25">
                Get a Free Quote →
              </Link>
              {settings.contact_phone_1 && (
                <a href={`tel:${settings.contact_phone_1}`} className="border border-teal-400/30 text-white font-heading font-bold px-8 py-4 rounded-xl hover:bg-teal-400/5 hover:border-teal-400/60 hover:-translate-y-1 transition-all text-sm">
                  📞 {settings.contact_phone_1}
                </a>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CONTACT FORM ──────────────────────────────────── */}
      <section className="py-28 bg-[var(--bg-dark)]" id="contact">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/5 text-teal-400 text-xs font-heading font-bold tracking-widest uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-dot"></span>Get In Touch
              </span>
              <h2 className="font-heading font-black text-4xl mb-5">
                Send Us a <span className="grad-text">Message</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">Have a project in mind? Fill in the form and we&apos;ll get back to you within 2 hours.</p>
              <div className="space-y-4">
                {[
                  { icon: '✉️', lbl: 'Email', val: settings.contact_email, href: `mailto:${settings.contact_email}` },
                  { icon: '📞', lbl: 'Phone', val: `${settings.contact_phone_1 || ''}  ${settings.contact_phone_2 ? '· ' + settings.contact_phone_2 : ''}`, href: `tel:${settings.contact_phone_1}` },
                  { icon: '📍', lbl: 'Location', val: settings.contact_address, href: '' },
                  { icon: '🕐', lbl: 'Hours', val: settings.business_hours, href: '' },
                ].map(c => c.val && (
                  <div key={c.lbl} className="flex items-center gap-4 p-4 card-dark hover:border-teal-400/30 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-teal-400/10 flex items-center justify-center text-base flex-shrink-0">{c.icon}</div>
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase tracking-widest mb-0.5">{c.lbl}</div>
                      {c.href ? <a href={c.href} className="text-sm font-medium text-white hover:text-teal-400 transition-colors">{c.val}</a> : <span className="text-sm font-medium">{c.val}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <ContactForm />
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
