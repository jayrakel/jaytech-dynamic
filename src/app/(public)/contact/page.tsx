
import { getSettings } from "@/lib/settings";
import ContactForm from "@/components/ContactForm";
import ScrollReveal from "@/components/ScrollReveal";
export const revalidate = 60;
export default async function ContactPage() {
  const s = await getSettings();
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/5 text-teal-400 text-xs font-heading font-bold tracking-widest uppercase mb-5"><span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-dot"></span>Contact Us</span>
          <h1 className="font-heading font-black text-5xl mb-4">Let&apos;s Build Something <span className="grad-text">Great Together</span></h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">Fill in the form and we will get back to you within 2 hours.</p>
        </ScrollReveal>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <ScrollReveal>
            <div className="space-y-4 mb-8">
              {[
                {icon:"✉️",l:"Email",v:s.contact_email,href:`mailto:${s.contact_email}`},
                {icon:"📞",l:"Phone",v:`${s.contact_phone_1||""} ${s.contact_phone_2?("  ·  "+s.contact_phone_2):""}`,href:`tel:${s.contact_phone_1}`},
                {icon:"📍",l:"Address",v:s.contact_address,href:""},
                {icon:"🕐",l:"Hours",v:s.business_hours,href:""},
              ].map(c => c.v && (
                <div key={c.l} className="flex items-center gap-4 p-5 card-dark rounded-2xl hover:border-teal-400/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-teal-400/10 flex items-center justify-center">{c.icon}</div>
                  <div><div className="text-slate-500 text-[10px] uppercase tracking-widest mb-0.5">{c.l}</div>
                    {c.href ? <a href={c.href} className="text-sm font-medium hover:text-teal-400 transition-colors">{c.v}</a> : <span className="text-sm font-medium">{c.v}</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 card-dark rounded-2xl">
              <h3 className="font-heading font-bold mb-4 text-sm uppercase tracking-widest text-slate-400">Frequently Asked</h3>
              <div className="space-y-4">
                {[["How long does a website take?","2–4 weeks for standard sites, 6–12 weeks for complex apps."],["Do you offer payment plans?","Yes — 50% upfront, 50% on delivery. Custom schedules available."],["Do you work outside Nairobi?","Yes! We work remotely across Kenya, East Africa, and internationally."]].map(([q,a]) => (
                  <div key={q} className="border-b border-slate-800 pb-4 last:border-0 last:pb-0">
                    <div className="font-heading font-bold text-sm mb-1">{q}</div>
                    <div className="text-slate-500 text-sm">{a}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120}><ContactForm /></ScrollReveal>
        </div>
      </div>
    </div>
  );
}
