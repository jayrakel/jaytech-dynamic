import Link from 'next/link';
export default function LicensePage() {
  const year = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-teal-400 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-teal-400">License</span>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/5 text-teal-400 text-xs font-heading font-bold tracking-widest uppercase mb-5">Legal</div>
        <h1 className="font-heading font-black text-5xl mb-4"><span className="grad-text">License</span></h1>
        <p className="text-slate-400 text-lg mb-10">Ownership, usage rights, and intellectual property notice.</p>
        <div className="p-6 rounded-2xl mb-10 text-center"
          style={{ background: 'linear-gradient(135deg,rgba(20,184,166,.08),rgba(59,130,246,.08))', border: '1px solid rgba(20,184,166,.25)' }}>
          <div className="text-4xl mb-3">©</div>
          <div className="font-heading font-black text-2xl mb-1">Copyright {year}</div>
          <div className="grad-text font-heading font-black text-xl">Jay TechWave Solutions</div>
          <div className="text-slate-400 text-sm mt-2">All Rights Reserved · Nairobi, Kenya</div>
        </div>
        <div className="prose prose-invert prose-teal max-w-none prose-headings:font-heading prose-headings:text-white prose-a:text-teal-400 prose-p:text-slate-400 prose-li:text-slate-400">
          <h2>1. Ownership</h2>
          <p>This website, its design, source code, content, branding, logos, graphics, and all associated materials are the exclusive intellectual property of <strong className="text-white">Jay TechWave Solutions</strong>, a technology company registered and operating in Nairobi, Kenya.</p>
          <h2>2. Proprietary Rights</h2>
          <p>All content on this website — including but not limited to text, images, icons, illustrations, UI components, page layouts, and data — is proprietary and protected under applicable Kenyan and international copyright laws. No content may be reproduced, distributed, modified, publicly displayed, or used to create derivative works without prior written permission.</p>
          <h2>3. Client Work</h2>
          <p>Upon full payment of agreed project fees, Jay TechWave Solutions transfers ownership of custom deliverables to the respective client as defined in the signed Statement of Work. Pre-existing frameworks, libraries, and tools remain subject to their respective licenses. Jay TechWave Solutions retains the right to display completed work in its portfolio unless requested otherwise in writing.</p>
          <h2>4. Third-Party Assets</h2>
          <p>This website uses third-party libraries including Tailwind CSS (MIT), Font Awesome (Font Awesome Free License), and Next.js (MIT). These licenses do not extend to the website's proprietary design and content.</p>
          <h2>5. AI Features</h2>
          <p>AI-powered features are powered by Anthropic's Claude API. AI-generated content is provided for estimation and guidance only and does not constitute a binding quote or professional consultation. Final pricing is subject to formal agreement.</p>
          <h2>6. Permitted Use</h2>
          <p>Visitors may view and interact with this website for legitimate personal or business purposes. You may share links to pages. You may not scrape, clone, or republish this website or its content.</p>
          <h2>7. Trademarks</h2>
          <p>"Jay TechWave Solutions," "JT," and associated logos are trademarks of Jay TechWave Solutions and may not be used without prior written consent.</p>
          <h2>8. Contact</h2>
          <p>For licensing enquiries contact <a href="mailto:jaytechwavesolutions@gmail.com">jaytechwavesolutions@gmail.com</a> or call <a href="tel:+254716962489">+254 716 962 489</a>.</p>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap gap-3">
          <Link href="/privacy" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-400 transition-colors border border-slate-800 hover:border-teal-400/30 px-5 py-2.5 rounded-xl">Privacy Policy →</Link>
          <Link href="/terms" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-400 transition-colors border border-slate-800 hover:border-teal-400/30 px-5 py-2.5 rounded-xl">Terms of Use →</Link>
        </div>
      </div>
    </div>
  );
}