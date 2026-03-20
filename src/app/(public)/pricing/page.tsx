
import { prisma } from "@/lib/prisma";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
export const revalidate = 60;
export default async function PricingPage() {
  const plans = await prisma.pricingPlan.findMany({ where:{active:true}, orderBy:{order:"asc"} });
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/5 text-teal-400 text-xs font-heading font-bold tracking-widest uppercase mb-5"><span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-dot"></span>Pricing</span>
          <h1 className="font-heading font-black text-5xl mb-4">Transparent <span className="grad-text">Pricing Plans</span></h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">No hidden fees. No surprise invoices. Pick a plan or get a custom quote.</p>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-6 items-start mb-16">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.id} delay={i*80} className={`relative p-8 rounded-3xl border transition-all ${plan.highlighted ? "border-teal-500 bg-gradient-to-b from-teal-400/8 to-transparent shadow-2xl shadow-teal-500/15" : "card-dark hover:border-teal-400/30"}`}>
              {plan.highlighted && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-heading font-bold px-5 py-1.5 grad-bg text-white rounded-full whitespace-nowrap">Most Popular</div>}
              <div className="text-xs font-heading font-bold tracking-widest uppercase text-teal-400 mb-3">{plan.name}</div>
              <div className="flex items-start gap-1 mb-3">
                {plan.price !== "Custom" && <span className="text-slate-400 font-heading font-bold text-sm mt-2">{plan.currency}</span>}
                <span className="font-heading font-black text-5xl grad-text">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-slate-500 text-sm self-end mb-2">/{plan.period}</span>}
              </div>
              <p className="text-slate-400 text-sm leading-relaxed border-b border-slate-800 pb-5 mb-5">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f: string) => <li key={f} className="flex items-start gap-3 text-sm text-slate-300"><span className="w-5 h-5 rounded-md bg-teal-400/10 text-teal-400 flex items-center justify-center text-xs mt-0.5 flex-shrink-0">✓</span>{f}</li>)}
              </ul>
              <Link href="/contact" className={`block w-full text-center py-3.5 rounded-xl font-heading font-bold text-sm transition-all ${plan.highlighted ? "grad-bg text-white hover:opacity-90" : "border border-teal-400/30 text-white hover:bg-teal-400/5 hover:border-teal-400/60"}`}>
                {plan.price === "Custom" ? "Contact Us" : "Get Started"}
              </Link>
            </ScrollReveal>
          ))}
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {[{icon:"🛡️",title:"Satisfaction Guaranteed",desc:"We revise until you're happy — no extra charge."},{icon:"📅",title:"On-Time Delivery",desc:"Every project delivered on the agreed date."},{icon:"🎧",title:"Post-Launch Support",desc:"We stay with you even after go-live."},{icon:"🔒",title:"No Hidden Fees",desc:"What you see is exactly what you pay."}].map(g => (
            <div key={g.title} className="p-5 card-dark rounded-2xl text-center">
              <div className="text-2xl mb-3">{g.icon}</div>
              <div className="font-heading font-bold text-sm mb-2">{g.title}</div>
              <div className="text-slate-500 text-xs leading-relaxed">{g.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
