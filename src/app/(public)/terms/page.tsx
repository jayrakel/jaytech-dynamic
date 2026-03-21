// src/app/(public)/team/page.tsx
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
export const revalidate = 60;

export default async function TeamPage() {
  const team = await prisma.teamMember.findMany({ where: { active: true }, orderBy: { order: "asc" } });

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/5 text-teal-400 text-xs font-heading font-bold tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-dot"></span>Our Team
          </span>
          <h1 className="font-heading font-black text-5xl mb-4">Meet the <span className="grad-text">People</span></h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">Passionate technologists committed to excellence on every project.</p>
        </ScrollReveal>

        {team.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {team.map((m, i) => (
              <ScrollReveal key={m.id} delay={i % 4 * 80} className="group text-center">
                {/* Circular photo */}
                <div className="relative mx-auto mb-5 w-36 h-36">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-slate-700 group-hover:border-teal-400/60 transition-all duration-300 bg-slate-800">
                    {m.image ? (
                      <Image
                        src={m.image}
                        alt={m.name}
                        width={144}
                        height={144}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-teal-400/0 group-hover:border-teal-400/30 transition-all duration-300 scale-110" />
                </div>

                <div className="font-heading font-bold text-white text-base">{m.name}</div>
                <div className="text-teal-400 text-xs font-bold mt-1 mb-2 uppercase tracking-wider">{m.role}</div>
                {m.bio && (
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 max-w-[220px] mx-auto">{m.bio}</p>
                )}
                {(m.linkedin || m.twitter || m.email) && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noopener"
                        className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900 flex items-center justify-center text-slate-500 hover:border-teal-400/50 hover:text-teal-400 transition-all text-xs">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    )}
                    {m.twitter && (
                      <a href={m.twitter} target="_blank" rel="noopener"
                        className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900 flex items-center justify-center text-slate-500 hover:border-teal-400/50 hover:text-teal-400 transition-all text-xs">
                        <i className="fab fa-x-twitter"></i>
                      </a>
                    )}
                    {m.email && (
                      <a href={`mailto:${m.email}`}
                        className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900 flex items-center justify-center text-slate-500 hover:border-teal-400/50 hover:text-teal-400 transition-all text-xs">
                        <i className="fas fa-envelope"></i>
                      </a>
                    )}
                  </div>
                )}
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            No team members yet.{" "}
            <Link href="/admin/team" className="text-teal-400 hover:underline">Add some in admin →</Link>
          </div>
        )}

        <div className="mt-24 card-dark rounded-3xl p-12 text-center">
          <h2 className="font-heading font-black text-3xl mb-4">We&apos;re <span className="grad-text">Hiring</span></h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">Talented? Passionate about tech? We are always looking for great people to join the team.</p>
          <Link href="/contact" className="grad-bg text-white font-heading font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-all text-sm">
            Get In Touch →
          </Link>
        </div>
      </div>
    </div>
  );
}