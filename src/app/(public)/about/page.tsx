
import { getSettings } from "@/lib/settings";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
import Image from "next/image";
export const revalidate = 60;
export default async function AboutPage() {
  const s = await getSettings();
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-24">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/5 text-teal-400 text-xs font-heading font-bold tracking-widest uppercase mb-6"><span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-dot"></span>About Us</span>
            <h1 className="font-heading font-black text-5xl mb-6">We Turn Tech Into <span className="grad-text">Business Results</span></h1>
            <p className="text-slate-400 leading-relaxed text-lg mb-5">Jay TechWave Solutions was founded in Nairobi with one goal: make world-class technology accessible to every Kenyan business — not just the corporations.</p>
            <p className="text-slate-500 leading-relaxed mb-8">Today, we are a team of 12+ engineers, designers, and digital strategists who have delivered 150+ projects across Kenya and East Africa. Our clients range from Nairobi startups to established enterprises.</p>
            <ul className="space-y-3 mb-8">
              {["Founded 2019 in Nairobi, Kenya","12+ certified engineers and specialists","150+ projects across East Africa","Agile, transparent, and client-first approach"].map(v => (
                <li key={v} className="flex items-center gap-3 text-slate-300 text-sm"><span className="w-5 h-5 rounded-md bg-teal-400/10 text-teal-400 flex items-center justify-center text-xs">✓</span>{v}</li>
              ))}
            </ul>
            <div className="flex gap-3 flex-wrap">
              <Link href="/contact" className="grad-bg text-white font-heading font-bold px-7 py-3.5 rounded-xl hover:opacity-90 transition-all text-sm">Work With Us →</Link>
              <Link href="/team" className="border border-teal-400/30 text-white font-heading font-bold px-7 py-3.5 rounded-xl hover:bg-teal-400/5 transition-all text-sm">Meet the Team</Link>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100} className="relative hidden lg:block">
            <div className="rounded-3xl overflow-hidden border border-slate-700">
              <div className="w-full h-[460px] bg-gradient-to-br from-teal-400/10 to-blue-400/10 flex items-center justify-center text-8xl">🏢</div>
            </div>
            <div className="absolute -bottom-6 -right-6 p-5 card-dark rounded-2xl text-center">
              <div className="font-heading font-black text-3xl grad-text">5+</div>
              <div className="text-slate-500 text-xs mt-1 uppercase tracking-wider">Years in Business</div>
            </div>
          </ScrollReveal>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[{icon:"🤝",t:"Client First",d:"Every decision filtered through one question: is this the best outcome for our client?"},{icon:"👁️",t:"Radical Transparency",d:"No hidden fees, vague timelines, or technical jargon. Clear communication at every step."},{icon:"🏆",t:"Quality Over Speed",d:"We deliver on time — but never cut corners to do it. Every product is built to last."}].map(v => (
            <ScrollReveal key={v.t} className="card-dark p-7 rounded-2xl hover:border-teal-400/30 transition-all">
              <div className="text-3xl mb-4">{v.icon}</div>
              <h3 className="font-heading font-bold text-lg mb-2">{v.t}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{v.d}</p>
            </ScrollReveal>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 border border-slate-800 rounded-2xl overflow-hidden">
          {[{v:"150+",l:"Projects"},{v:"80+",l:"Clients"},{v:"12+",l:"Team"},{v:"5+",l:"Years"}].map(s => (
            <div key={s.l} className="bg-slate-900 hover:bg-slate-800 transition-colors py-10 text-center">
              <div className="font-heading font-black text-4xl grad-text mb-2">{s.v}</div>
              <div className="text-slate-500 text-xs uppercase tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
