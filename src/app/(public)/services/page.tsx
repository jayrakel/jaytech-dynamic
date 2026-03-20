
import { prisma } from "@/lib/prisma";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
export const revalidate = 60;
export default async function ServicesPage() {
  const services = await prisma.service.findMany({ where:{active:true}, orderBy:{order:"asc"} });
  const iconMap: Record<string,string> = { "code-slash":"💻","phone":"📱","megaphone":"📣","cloud-arrow-up":"☁️","shield-lock":"🔒","tools":"🔧" };
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/5 text-teal-400 text-xs font-heading font-bold tracking-widest uppercase mb-6"><span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-dot"></span>Services</span>
          <h1 className="font-heading font-black text-5xl mb-4">Complete IT Services for <span className="grad-text">Every Business</span></h1>
          <p className="text-slate-400 text-lg leading-relaxed">From strategy to execution — we cover every tech need your business has.</p>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <ScrollReveal key={svc.id} delay={i % 3 * 80} className="group card-dark hover:border-teal-400/35 hover:-translate-y-1 transition-all duration-300 p-8 rounded-2xl relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-xs font-heading font-bold tracking-widest text-slate-600 uppercase mb-4">0{i+1}</div>
              <div className="text-4xl mb-5">{iconMap[svc.icon]||"⚙️"}</div>
              <h3 className="font-heading font-bold text-xl mb-3">{svc.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{svc.description}</p>
              {svc.features.length > 0 && (
                <ul className="space-y-2 mb-7">
                  {svc.features.map((f: string) => <li key={f} className="flex items-center gap-3 text-sm text-slate-400"><span className="w-5 h-5 rounded-md bg-teal-400/10 text-teal-400 flex items-center justify-center text-xs flex-shrink-0">✓</span>{f}</li>)}
                </ul>
              )}
              <Link href="/contact" className="grad-bg text-white font-heading font-bold text-xs px-5 py-2.5 rounded-lg hover:opacity-90 transition-all inline-flex items-center gap-2">Get a Quote →</Link>
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-20 p-10 card-dark rounded-3xl text-center">
          <h2 className="font-heading font-black text-3xl mb-4">Not Sure What You Need?</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">Let us have a free 30-minute consultation and we will recommend the right solution for your business.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="grad-bg text-white font-heading font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-all text-sm">Book Free Consultation →</Link>
            <Link href="/pricing" className="border border-teal-400/30 text-white font-heading font-bold px-8 py-3.5 rounded-xl hover:bg-teal-400/5 transition-all text-sm">View Pricing</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
