
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
export const revalidate = 60;
export default async function TeamPage() {
  const team = await prisma.teamMember.findMany({ where:{active:true}, orderBy:{order:"asc"} });
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/5 text-teal-400 text-xs font-heading font-bold tracking-widest uppercase mb-5"><span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-dot"></span>Our Team</span>
          <h1 className="font-heading font-black text-5xl mb-4">Meet the <span className="grad-text">People</span></h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">Passionate technologists committed to excellence on every project.</p>
        </ScrollReveal>
        {team.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m, i) => (
              <ScrollReveal key={m.id} delay={i%4*80} className="group card-dark hover:border-teal-400/35 hover:-translate-y-1 transition-all rounded-2xl overflow-hidden">
                <div className="overflow-hidden relative">
                  {m.image ? <Image src={m.image} alt={m.name} width={400} height={300} className="w-full h-56 object-cover object-top group-hover:scale-105 transition-transform duration-500"/> : <div className="w-full h-56 bg-slate-800 flex items-center justify-center text-5xl">👤</div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                    <div className="flex gap-2">
                      {m.linkedin && <a href={m.linkedin} target="_blank" rel="noopener" className="w-8 h-8 bg-slate-900/80 rounded-lg flex items-center justify-center text-teal-400 hover:bg-teal-400 hover:text-white transition-all text-xs">in</a>}
                      {m.twitter && <a href={m.twitter} target="_blank" rel="noopener" className="w-8 h-8 bg-slate-900/80 rounded-lg flex items-center justify-center text-teal-400 hover:bg-teal-400 hover:text-white transition-all text-xs">𝕏</a>}
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="font-heading font-bold">{m.name}</div>
                  <div className="text-teal-400 text-xs font-bold mt-1 mb-2">{m.role}</div>
                  <p className="text-slate-500 text-xs leading-relaxed">{m.bio}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">No team members yet. <Link href="/admin/team" className="text-teal-400">Add some in admin →</Link></div>
        )}
        <div className="mt-20 card-dark rounded-3xl p-12 text-center">
          <h2 className="font-heading font-black text-3xl mb-4">We&apos;re <span className="grad-text">Hiring</span></h2>
          <p className="text-slate-400 mb-8">Talented? Passionate about tech? We are always looking for great people.</p>
          <Link href="/contact" className="grad-bg text-white font-heading font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-all text-sm">Get In Touch →</Link>
        </div>
      </div>
    </div>
  );
}
