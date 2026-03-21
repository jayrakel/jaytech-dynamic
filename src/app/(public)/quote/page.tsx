'use client';
import { useState } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

const PROJECT_TYPES = ['Website', 'E-Commerce Store', 'Mobile App', 'Web Application', 'Digital Marketing Campaign', 'Cloud Migration', 'Cybersecurity Audit', 'IT Support Package', 'UI/UX Design', 'Other'];
const INDUSTRIES = ['Retail / E-Commerce', 'Healthcare', 'Education', 'Finance / Banking', 'Hospitality', 'Real Estate', 'NGO / Non-Profit', 'Government', 'Technology', 'Manufacturing', 'Other'];
const BUDGETS = ['Under KES 30,000', 'KES 30,000 – 80,000', 'KES 80,000 – 200,000', 'KES 200,000 – 500,000', 'Over KES 500,000', 'Not sure yet'];
const TIMELINES = ['ASAP (1–2 weeks)', '1 month', '2–3 months', '3–6 months', 'Flexible'];
const FEATURES_LIST = ['User authentication / login', 'Payment integration (M-Pesa / Stripe)', 'Admin dashboard', 'Blog / CMS', 'Mobile responsive', 'SEO optimisation', 'Social media integration', 'Email notifications', 'Multi-language support', 'Analytics & reporting', 'API integration', 'Booking / appointment system'];

interface Estimate {
  estimatedCost: string;
  timeline: string;
  recommendedPackage: string;
  breakdown: { item: string; cost: string; description: string }[];
  approach: string;
  includedFeatures: string[];
  nextSteps: string;
  confidence: string;
  disclaimer: string;
}

export default function QuotePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ projectType: '', industry: '', budget: '', timeline: '', description: '', features: [] as string[] });
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [error, setError] = useState('');

  const toggle = (f: string) => setForm(p => ({ ...p, features: p.features.includes(f) ? p.features.filter(x => x !== f) : [...p.features, f] }));
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const getEstimate = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/ai/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); } else { setEstimate(data); setStep(4); }
    } catch { setError('Could not generate estimate. Please try again.'); }
    finally { setLoading(false); }
  };

  const inp = 'w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 transition-all';
  const confidenceColor = { high: 'text-green-400', medium: 'text-yellow-400', low: 'text-orange-400' }[estimate?.confidence || 'medium'];

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">

        {/* Header */}
        <ScrollReveal className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/5 text-teal-400 text-xs font-heading font-bold tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>AI-Powered
          </span>
          <h1 className="font-heading font-black text-4xl lg:text-5xl mb-4">
            Get an Instant <span className="grad-text">Quote Estimate</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Describe your project and our AI will give you an instant cost and timeline estimate — no waiting, no obligations.
          </p>
        </ScrollReveal>

        {/* Progress */}
        {step < 4 && (
          <div className="flex items-center gap-2 mb-10">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${step >= s ? 'text-white' : 'text-slate-500 bg-slate-800'}`}
                  style={step >= s ? { background: 'linear-gradient(135deg,#14B8A6,#3B82F6)' } : {}}>
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && <div className={`h-px flex-1 transition-all ${step > s ? 'bg-teal-400' : 'bg-slate-700'}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Step 1 - Project basics */}
        {step === 1 && (
          <div className="card-dark p-8 rounded-2xl space-y-6">
            <h2 className="font-heading font-bold text-xl">What are you building?</h2>
            <div>
              <label className="text-slate-500 text-xs uppercase tracking-widest block mb-3">Project Type *</label>
              <div className="grid grid-cols-2 gap-2">
                {PROJECT_TYPES.map(t => (
                  <button key={t} onClick={() => set('projectType', t)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${form.projectType === t ? 'text-white' : 'text-slate-400 bg-slate-900 hover:text-teal-400 hover:border-teal-400/40 border border-slate-700'}`}
                    style={form.projectType === t ? { background: 'linear-gradient(135deg,#14B8A6,#3B82F6)' } : {}}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-slate-500 text-xs uppercase tracking-widest block mb-3">Your Industry *</label>
              <div className="grid grid-cols-2 gap-2">
                {INDUSTRIES.map(i => (
                  <button key={i} onClick={() => set('industry', i)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${form.industry === i ? 'text-white' : 'text-slate-400 bg-slate-900 hover:text-teal-400 border border-slate-700'}`}
                    style={form.industry === i ? { background: 'linear-gradient(135deg,#14B8A6,#3B82F6)' } : {}}>
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setStep(2)} disabled={!form.projectType || !form.industry}
              className="w-full py-3.5 rounded-xl text-white font-heading font-bold disabled:opacity-40 hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg,#14B8A6,#3B82F6)' }}>
              Next: Budget & Timeline →
            </button>
          </div>
        )}

        {/* Step 2 - Budget & Timeline */}
        {step === 2 && (
          <div className="card-dark p-8 rounded-2xl space-y-6">
            <h2 className="font-heading font-bold text-xl">Budget & Timeline</h2>
            <div>
              <label className="text-slate-500 text-xs uppercase tracking-widest block mb-3">Budget Range *</label>
              <div className="space-y-2">
                {BUDGETS.map(b => (
                  <button key={b} onClick={() => set('budget', b)}
                    className={`w-full px-4 py-3 rounded-xl text-sm font-medium text-left transition-all flex items-center justify-between ${form.budget === b ? 'text-white' : 'text-slate-400 bg-slate-900 hover:text-teal-400 border border-slate-700'}`}
                    style={form.budget === b ? { background: 'linear-gradient(135deg,#14B8A6,#3B82F6)' } : {}}>
                    {b}
                    {form.budget === b && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-slate-500 text-xs uppercase tracking-widest block mb-3">Desired Timeline *</label>
              <div className="grid grid-cols-2 gap-2">
                {TIMELINES.map(t => (
                  <button key={t} onClick={() => set('timeline', t)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${form.timeline === t ? 'text-white' : 'text-slate-400 bg-slate-900 hover:text-teal-400 border border-slate-700'}`}
                    style={form.timeline === t ? { background: 'linear-gradient(135deg,#14B8A6,#3B82F6)' } : {}}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl text-slate-400 border border-slate-700 hover:border-teal-400/40 transition-all text-sm font-bold">← Back</button>
              <button onClick={() => setStep(3)} disabled={!form.budget || !form.timeline}
                className="flex-[2] py-3 rounded-xl text-white font-heading font-bold disabled:opacity-40 hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg,#14B8A6,#3B82F6)' }}>
                Next: Project Details →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 - Details & Features */}
        {step === 3 && (
          <div className="card-dark p-8 rounded-2xl space-y-6">
            <h2 className="font-heading font-bold text-xl">Project Details</h2>
            <div>
              <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Describe your project *</label>
              <textarea className={inp} rows={4} value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Tell us what you want to build, who your target users are, and any specific requirements..." />
            </div>
            <div>
              <label className="text-slate-500 text-xs uppercase tracking-widest block mb-3">Required Features (select all that apply)</label>
              <div className="grid grid-cols-2 gap-2">
                {FEATURES_LIST.map(f => (
                  <button key={f} onClick={() => toggle(f)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-all flex items-center gap-2 ${form.features.includes(f) ? 'text-white' : 'text-slate-400 bg-slate-900 hover:text-teal-400 border border-slate-700'}`}
                    style={form.features.includes(f) ? { background: 'linear-gradient(135deg,rgba(20,184,166,.3),rgba(59,130,246,.3))', border: '1px solid rgba(20,184,166,.5)' } : {}}>
                    <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] flex-shrink-0 ${form.features.includes(f) ? 'bg-teal-400 text-white' : 'border border-slate-600'}`}>
                      {form.features.includes(f) ? '✓' : ''}
                    </span>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            {error && <div className="p-3 bg-red-400/10 border border-red-400/30 rounded-xl text-red-400 text-sm">{error}</div>}
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl text-slate-400 border border-slate-700 hover:border-teal-400/40 transition-all text-sm font-bold">← Back</button>
              <button onClick={getEstimate} disabled={!form.description.trim() || loading}
                className="flex-[2] py-3 rounded-xl text-white font-heading font-bold disabled:opacity-40 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg,#14B8A6,#3B82F6)' }}>
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Analysing…</>
                ) : '✨ Get AI Estimate →'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4 - Results */}
        {step === 4 && estimate && (
          <div className="space-y-5">
            {/* Hero result */}
            <div className="p-8 rounded-2xl text-center text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#14B8A6,#3B82F6)' }}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 0%, transparent 60%)' }} />
              <div className="relative">
                <div className="text-sm font-heading font-bold uppercase tracking-widest opacity-80 mb-2">Estimated Cost</div>
                <div className="font-heading font-black text-4xl lg:text-5xl mb-2">{estimate.estimatedCost}</div>
                <div className="text-white/80 mb-4">Timeline: <strong>{estimate.timeline}</strong></div>
                <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full text-sm">
                  <span className={`w-2 h-2 rounded-full ${estimate.confidence === 'high' ? 'bg-green-400' : estimate.confidence === 'medium' ? 'bg-yellow-400' : 'bg-orange-400'}`}></span>
                  <span className="capitalize">{estimate.confidence} confidence estimate</span>
                </div>
              </div>
            </div>

            {/* Recommended package */}
            <div className="card-dark p-6 rounded-2xl">
              <div className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-2">Recommended Package</div>
              <div className="font-heading font-bold text-xl mb-3">{estimate.recommendedPackage}</div>
              <p className="text-slate-400 text-sm leading-relaxed">{estimate.approach}</p>
            </div>

            {/* Cost breakdown */}
            {estimate.breakdown?.length > 0 && (
              <div className="card-dark p-6 rounded-2xl">
                <h3 className="font-heading font-bold mb-4">Cost Breakdown</h3>
                <div className="space-y-3">
                  {estimate.breakdown.map((b, i) => (
                    <div key={i} className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium text-sm">{b.item}</div>
                        <div className="text-slate-500 text-xs mt-0.5">{b.description}</div>
                      </div>
                      <div className="font-heading font-bold text-sm text-teal-400 flex-shrink-0">{b.cost}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Included features */}
            {estimate.includedFeatures?.length > 0 && (
              <div className="card-dark p-6 rounded-2xl">
                <h3 className="font-heading font-bold mb-4">What's Included</h3>
                <ul className="grid grid-cols-1 gap-2">
                  {estimate.includedFeatures.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                      <span className="w-5 h-5 rounded-md bg-teal-400/10 text-teal-400 flex items-center justify-center text-xs flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next steps */}
            <div className="card-dark p-6 rounded-2xl border-teal-400/20">
              <h3 className="font-heading font-bold mb-2">Next Steps</h3>
              <p className="text-slate-400 text-sm mb-5">{estimate.nextSteps}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/contact" className="flex-1 py-3.5 rounded-xl text-white font-heading font-bold text-center hover:opacity-90 transition-all"
                  style={{ background: 'linear-gradient(135deg,#14B8A6,#3B82F6)' }}>
                  Book Free Consultation →
                </Link>
                <button onClick={() => { setStep(1); setEstimate(null); setForm({ projectType: '', industry: '', budget: '', timeline: '', description: '', features: [] }); }}
                  className="flex-1 py-3.5 rounded-xl text-slate-400 border border-slate-700 hover:border-teal-400/40 hover:text-teal-400 transition-all font-bold text-sm">
                  Start Over
                </button>
              </div>
            </div>

            <p className="text-slate-600 text-xs text-center">{estimate.disclaimer}</p>
          </div>
        )}
      </div>
    </div>
  );
}