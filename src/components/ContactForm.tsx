'use client';
// src/components/ContactForm.tsx
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactForm() {
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', service:'', budget:'', message:'' });
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) {
        toast.success('Message sent! We\'ll reply within 2 hours.');
        setForm({ firstName:'', lastName:'', email:'', phone:'', service:'', budget:'', message:'' });
      } else {
        toast.error(data.error || 'Something went wrong. Please try again.');
      }
    } catch { toast.error('Network error. Please email us directly.'); }
    finally   { setLoading(false); }
  };

  const inputCls = 'w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all';

  return (
    <div className="card-dark p-8 rounded-2xl">
      <h3 className="font-heading font-bold text-xl mb-6">Start Your Project</h3>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-500 text-[10px] uppercase tracking-widest mb-2">First Name *</label>
            <input required className={inputCls} placeholder="John" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
          </div>
          <div>
            <label className="block text-slate-500 text-[10px] uppercase tracking-widest mb-2">Last Name *</label>
            <input required className={inputCls} placeholder="Doe" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-slate-500 text-[10px] uppercase tracking-widest mb-2">Email *</label>
          <input required type="email" className={inputCls} placeholder="john@company.com" value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
        <div>
          <label className="block text-slate-500 text-[10px] uppercase tracking-widest mb-2">Phone</label>
          <input className={inputCls} placeholder="+254 700 000 000" value={form.phone} onChange={e => set('phone', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-500 text-[10px] uppercase tracking-widest mb-2">Service</label>
            <select className={inputCls} value={form.service} onChange={e => set('service', e.target.value)}>
              <option value="">Select...</option>
              {['Web Development','App Development','Digital Marketing','Cloud Solutions','Cybersecurity','IT Support & Consulting','Other'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-slate-500 text-[10px] uppercase tracking-widest mb-2">Budget</label>
            <select className={inputCls} value={form.budget} onChange={e => set('budget', e.target.value)}>
              <option value="">Select...</option>
              {['Under KES 30,000','KES 30,000–80,000','KES 80,000–200,000','KES 200,000–500,000','Over KES 500,000'].map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-slate-500 text-[10px] uppercase tracking-widest mb-2">Message *</label>
          <textarea required rows={5} className={inputCls} placeholder="Tell us about your project, timeline, and any specific requirements..." value={form.message} onChange={e => set('message', e.target.value)} />
        </div>
        <button type="submit" disabled={loading} className="w-full grad-bg text-white font-heading font-bold py-4 rounded-xl hover:opacity-90 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Sending…' : 'Send Message →'}
        </button>
      </form>
    </div>
  );
}
