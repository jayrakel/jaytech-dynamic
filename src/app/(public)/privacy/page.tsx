
import Link from "next/link";
export default function Page() {
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-teal-400 transition-colors">Home</Link>
          <span>›</span><span className="text-teal-400">Privacy Policy</span>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/5 text-teal-400 text-xs font-heading font-bold tracking-widest uppercase mb-5">Legal</div>
        <h1 className="font-heading font-black text-5xl mb-4"><span className="grad-text">Privacy Policy</span></h1>
        <p className="text-slate-400 text-lg mb-10">How we collect, use, and protect your personal information.</p>
        <div className="flex gap-4 text-xs text-slate-500 mb-10 p-4 card-dark rounded-xl">
          <span><strong className="text-slate-300">Effective:</strong> 1 January 2025</span>
          <span><strong className="text-slate-300">Updated:</strong> 1 January 2025</span>
          <span><strong className="text-slate-300">Version:</strong> 1.0</span>
        </div>
        <div className="p-5 rounded-xl bg-teal-400/5 border border-teal-400/20 text-sm text-slate-300 leading-relaxed mb-10">
          ℹ️ This page governs your use of the Jay TechWave Solutions website and services. By using our site, you agree to these terms.
        </div>
        <div className="prose prose-invert prose-teal max-w-none prose-headings:font-heading prose-headings:text-white prose-a:text-teal-400 prose-li:text-slate-400 prose-p:text-slate-400">
          <h2>1. Who We Are</h2><p>Jay TechWave Solutions is a technology company based in Nairobi, Kenya, delivering IT services including web development, mobile app development, digital marketing, cloud solutions, cybersecurity, and IT consulting.</p><p><strong>Email:</strong> <a href="mailto:jaytechwavesolutions@gmail.com">jaytechwavesolutions@gmail.com</a><br/><strong>Phone:</strong> +254 716 962 489<br/><strong>Address:</strong> 472-00200, Nairobi, Kenya</p><h2>2. Information We Collect</h2><p>We collect personal information you provide directly — name, email, phone, company, and project details — as well as technical data collected automatically through cookies and analytics tools.</p><h2>3. How We Use Your Information</h2><p>We use your data to respond to enquiries, deliver services, send you relevant updates (with consent), improve our website, and comply with legal obligations. We never sell your personal data.</p><h2>4. Data Security</h2><p>We implement HTTPS encryption, access controls, and regular security reviews to protect your data. In the event of a breach affecting your rights, we will notify you promptly.</p><h2>5. Cookies</h2><p>We use essential cookies and analytics cookies (Google Analytics). You may opt out of analytics tracking at tools.google.com/dlpage/gaoptout.</p><h2>6. Your Rights</h2><p>You have the right to access, correct, delete, or port your personal data. Contact us at jaytechwavesolutions@gmail.com to exercise these rights. We respond within 30 days.</p><h2>7. Governing Law</h2><p>These terms are governed by the laws of the Republic of Kenya. Disputes are subject to the jurisdiction of the courts of Nairobi.</p><h2>8. Contact</h2><p>Questions? Email <a href="mailto:jaytechwavesolutions@gmail.com">jaytechwavesolutions@gmail.com</a> or call +254 716 962 489.</p>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800">
          <Link href="/terms" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-400 transition-colors border border-slate-800 hover:border-teal-400/30 px-5 py-2.5 rounded-xl">
            Also read our  Terms of Use  →
          </Link>
        </div>
      </div>
    </div>
  );
}
