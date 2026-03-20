
import Link from "next/link";
export default function Page() {
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-teal-400 transition-colors">Home</Link>
          <span>›</span><span className="text-teal-400">Terms of Use</span>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/5 text-teal-400 text-xs font-heading font-bold tracking-widest uppercase mb-5">Legal</div>
        <h1 className="font-heading font-black text-5xl mb-4"><span className="grad-text">Terms of Use</span></h1>
        <p className="text-slate-400 text-lg mb-10">Rules and conditions governing your use of our website and services.</p>
        <div className="flex gap-4 text-xs text-slate-500 mb-10 p-4 card-dark rounded-xl">
          <span><strong className="text-slate-300">Effective:</strong> 1 January 2025</span>
          <span><strong className="text-slate-300">Updated:</strong> 1 January 2025</span>
          <span><strong className="text-slate-300">Version:</strong> 1.0</span>
        </div>
        <div className="p-5 rounded-xl bg-teal-400/5 border border-teal-400/20 text-sm text-slate-300 leading-relaxed mb-10">
          ℹ️ This page governs your use of the Jay TechWave Solutions website and services. By using our site, you agree to these terms.
        </div>
        <div className="prose prose-invert prose-teal max-w-none prose-headings:font-heading prose-headings:text-white prose-a:text-teal-400 prose-li:text-slate-400 prose-p:text-slate-400">
          <h2>1. Acceptance</h2><p>By using our website or engaging our services, you agree to these Terms of Use in full. If you disagree, please do not use our website or services.</p><h2>2. Our Services</h2><p>Jay TechWave Solutions provides web development, mobile app development, digital marketing, cloud infrastructure, cybersecurity, and IT support services. Specific deliverables are defined in a written Statement of Work (SOW) agreed before work begins.</p><h2>3. Intellectual Property</h2><p>Upon full payment, ownership of custom deliverables transfers to the client. Pre-existing frameworks, libraries, and tools remain our property. We retain the right to display completed work in our portfolio unless agreed otherwise in writing.</p><h2>4. Payments</h2><p>Standard payment is 50% deposit upfront and 50% on delivery. Invoices are due within 14 days. Late payments may incur a 1.5% monthly fee. Deposits are non-refundable once work has commenced.</p><h2>5. Confidentiality</h2><p>Both parties agree to keep shared proprietary information confidential and not disclose it to third parties without prior written consent. This obligation survives termination of the engagement.</p><h2>6. Limitation of Liability</h2><p>To the maximum extent permitted by law, our total liability shall not exceed the fees paid in the three months preceding the claim. We are not liable for indirect, incidental, or consequential damages.</p><h2>7. Governing Law</h2><p>These Terms are governed by the laws of the Republic of Kenya. Disputes are subject to the exclusive jurisdiction of the courts of Nairobi.</p><h2>8. Contact</h2><p>Questions about these Terms? Email <a href="mailto:jaytechwavesolutions@gmail.com">jaytechwavesolutions@gmail.com</a>.</p>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800">
          <Link href="/privacy" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-400 transition-colors border border-slate-800 hover:border-teal-400/30 px-5 py-2.5 rounded-xl">
            Also read our  Privacy Policy  →
          </Link>
        </div>
      </div>
    </div>
  );
}
