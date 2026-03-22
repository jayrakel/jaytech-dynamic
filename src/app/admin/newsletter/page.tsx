// src/app/admin/newsletter/page.tsx
"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function NewsletterAdmin() {
  const [form, setForm]       = useState({ subject: "", content: "" });
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [subCount, setSubCount] = useState(0);

  // AI state
  const [aiTopic,     setAiTopic]     = useState("");
  const [aiTone,      setAiTone]      = useState("professional");
  const [generating,  setGenerating]  = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);

  useEffect(() => {
    fetch("/api/admin/newsletter", { credentials: "include" })
      .then(r => r.json()).then(d => Array.isArray(d) && setHistory(d));
    fetch("/api/admin/subscribers", { credentials: "include" })
      .then(r => r.json()).then(d => Array.isArray(d) && setSubCount(d.filter((s: any) => s.status === "ACTIVE").length));
  }, []);

  // ── AI Generate newsletter ───────────────────────────────
  const generateNewsletter = async () => {
    if (!aiTopic.trim()) return toast.error("Enter a topic first");
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: aiTopic, tone: aiTone }),
        credentials: "include",
      });
      const d = await res.json();
      if (d.subject && d.content) {
        setForm({ subject: d.subject, content: d.content });
        setShowAiPanel(false);
        toast.success("Newsletter generated! Review and edit before sending.");
      } else {
        toast.error(d.error || "Generation failed");
      }
    } catch {
      toast.error("AI unavailable");
    } finally {
      setGenerating(false);
    }
  };

  const send = async () => {
    if (!form.subject.trim() || !form.content.trim()) return toast.error("Subject and content required");
    if (!confirm(`Send to ${subCount} active subscribers?`)) return;
    setSending(true);
    const res = await fetch("/api/admin/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include",
    });
    const d = await res.json();
    if (res.ok) {
      toast.success(`Sent to ${d.sentCount} subscribers!`);
      setForm({ subject: "", content: "" });
      fetch("/api/admin/newsletter", { credentials: "include" })
        .then(r => r.json()).then(d => Array.isArray(d) && setHistory(d));
    } else {
      toast.error(d.error || "Send failed.");
    }
    setSending(false);
  };

  const inp = "w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 transition-all";

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-heading font-black text-2xl mb-1">Newsletter</h1>
      <p className="text-slate-500 text-sm mb-8">{subCount} active subscribers</p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* ── Compose ─────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-lg">Compose Newsletter</h2>
            <button
              onClick={() => setShowAiPanel(p => !p)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${showAiPanel ? "text-white" : "bg-slate-800 text-teal-400 hover:bg-slate-700"}`}
              style={showAiPanel ? { background: "linear-gradient(135deg,#14B8A6,#3B82F6)" } : {}}
            >
              ✨ {showAiPanel ? "Hide AI" : "Write with AI"}
            </button>
          </div>

          {/* AI Panel */}
          {showAiPanel && (
            <div className="bg-slate-900 border border-teal-400/20 rounded-2xl p-5 mb-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-teal-400 text-base">✨</span>
                <span className="font-heading font-bold text-sm text-white">AI Newsletter Generator</span>
              </div>
              <p className="text-slate-500 text-xs">Describe what you want to write about and AI will generate a full newsletter with subject line and HTML content ready to send.</p>

              <div>
                <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Topic / Brief *</label>
                <textarea
                  className={inp}
                  rows={3}
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  placeholder="e.g. Tips for Kenyan SMEs on cybersecurity in 2025, new M-Pesa integrations we offer, why businesses need mobile apps..."
                />
              </div>

              <div>
                <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Tone</label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: "professional", label: "💼 Professional" },
                    { value: "friendly",     label: "😊 Friendly"     },
                    { value: "educational",  label: "📚 Educational"  },
                    { value: "promotional",  label: "🎯 Promotional"  },
                  ].map(t => (
                    <button
                      key={t.value}
                      onClick={() => setAiTone(t.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${aiTone === t.value ? "text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}
                      style={aiTone === t.value ? { background: "linear-gradient(135deg,#14B8A6,#3B82F6)" } : {}}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generateNewsletter}
                disabled={generating || !aiTopic.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-heading font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
                style={{ background: "linear-gradient(135deg,#14B8A6,#3B82F6)" }}
              >
                {generating ? (
                  <><span className="animate-spin inline-block">⏳</span> Generating…</>
                ) : (
                  <>✨ Generate Newsletter</>
                )}
              </button>
            </div>
          )}

          {/* Manual compose */}
          <div className="space-y-4">
            <div>
              <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Subject *</label>
              <input
                className={inp}
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                placeholder="Monthly Tech Digest — March 2025"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-slate-500 text-xs uppercase tracking-widest">Content (HTML or plain text) *</label>
                {form.content && (
                  <button
                    onClick={() => {
                      if (!aiTopic.trim()) {
                        toast.error("Fill in a topic in the AI panel first");
                        setShowAiPanel(true);
                        return;
                      }
                      generateNewsletter();
                    }}
                    disabled={generating}
                    className="text-teal-400 text-xs hover:text-teal-300 font-bold transition-colors disabled:opacity-50"
                  >
                    ✨ Regenerate
                  </button>
                )}
              </div>
              <textarea
                className={inp}
                rows={14}
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="<h2>This month in tech...</h2><p>Your content here...</p>&#10;&#10;Tip: Use {{name}} to personalise — it will be replaced with each subscriber's first name."
              />
              <p className="text-slate-600 text-xs mt-1.5">
                💡 Use <code className="text-teal-400">{"{{name}}"}</code> anywhere to personalise with each subscriber's first name.
              </p>
            </div>

            <button
              onClick={send}
              disabled={sending || subCount === 0}
              className="w-full text-white font-heading font-bold py-3.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
              style={{ background: "linear-gradient(135deg,#14B8A6,#3B82F6)" }}
            >
              {sending ? `Sending to ${subCount}…` : `Send to ${subCount} Subscribers →`}
            </button>
            {subCount === 0 && (
              <p className="text-xs text-yellow-400 text-center">No active subscribers to send to.</p>
            )}
          </div>
        </div>

        {/* ── Sent History ─────────────────────────────────── */}
        <div>
          <h2 className="font-heading font-bold text-lg mb-4">Sent History</h2>
          <div className="space-y-3">
            {history.map(n => (
              <div key={n.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
                <div className="font-medium text-sm mb-1">{n.subject}</div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>📧 {n.sentCount} sent</span>
                  <span>{n.sentAt ? new Date(n.sentAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""}</span>
                </div>
              </div>
            ))}
            {history.length === 0 && (
              <p className="text-slate-600 text-sm">No newsletters sent yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}