'use client';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  logo?: string;
  siteName?: string;
}

export default function ChatWidget({ logo, siteName = 'Jay TechWave Solutions' }: Props) {
  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! 👋 I'm Jay TechWave's AI assistant. I can answer questions about our services, pricing, or help you figure out what you need. How can I help?",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const isLight = mounted && theme !== 'dark';

  // Theme-aware color tokens
  const colors = isLight ? {
    panelBg:      '#FFFFFF',
    panelBorder:  '1px solid #E2E8F0',
    messagesBg:   '#F8FAFC',
    actionsBg:    '#F1F5F9',
    actionsBorder:'1px solid #E2E8F0',
    inputBg:      '#F1F5F9',
    inputBorder:  '1px solid #E2E8F0',
    inputColor:   '#1E293B',
    aiBubbleBg:   '#FFFFFF',
    aiBubbleBorder:'1px solid #E2E8F0',
    aiBubbleText: '#334155',
    quickBtnBg:   'rgba(20,184,166,.08)',
    quickBtnBorder:'1px solid rgba(20,184,166,.3)',
    quickBtnColor:'#0D9488',
  } : {
    panelBg:      '#111B2E',
    panelBorder:  '1px solid rgba(20,184,166,.25)',
    messagesBg:   '#0D1421',
    actionsBg:    '#111B2E',
    actionsBorder:'1px solid rgba(20,184,166,.1)',
    inputBg:      'rgba(255,255,255,0.07)',
    inputBorder:  '1px solid rgba(20,184,166,.25)',
    inputColor:   '#F0F6FF',
    aiBubbleBg:   'rgba(255,255,255,0.07)',
    aiBubbleBorder:'1px solid rgba(20,184,166,.2)',
    aiBubbleText: '#E2E8F0',
    quickBtnBg:   'rgba(20,184,166,.1)',
    quickBtnBorder:'1px solid rgba(20,184,166,.25)',
    quickBtnColor:'#2DD4BF',
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.message || 'Sorry, something went wrong.' }]);
    } catch {
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'Sorry, I am having trouble connecting. Please email us at jaytechwavesolutions@gmail.com',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed bottom-24 right-5 z-[1000] w-[350px] max-w-[calc(100vw-20px)] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: colors.panelBg, border: colors.panelBorder }}
        >
          {/* Header — always gradient */}
          <div
            className="flex items-center justify-between px-4 py-3.5"
            style={{ background: 'linear-gradient(135deg,#14B8A6,#3B82F6)' }}
          >
            <div className="flex items-center gap-3">
              {/* Logo from settings, fallback to JT initials */}
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                {logo ? (
                  <Image src={logo} alt={siteName} width={32} height={32} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-white font-bold text-sm">JT</span>
                )}
              </div>
              <div>
                <div className="text-white font-heading font-bold text-sm">{siteName} AI</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                  <span className="text-white/80 text-[10px]">Online · Replies instantly</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-all text-sm"
            >✕</button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[360px] min-h-[200px]"
            style={{ background: colors.messagesBg }}
          >
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'
                  }`}
                  style={m.role === 'user' ? {
                    background: 'linear-gradient(135deg,#14B8A6,#3B82F6)',
                    color: '#FFFFFF',
                  } : {
                    background: colors.aiBubbleBg,
                    border: colors.aiBubbleBorder,
                    color: colors.aiBubbleText,
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="px-4 py-3 rounded-2xl rounded-tl-sm"
                  style={{ background: colors.aiBubbleBg, border: colors.aiBubbleBorder }}
                >
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick actions */}
          <div
            className="px-3 py-2 flex gap-2 overflow-x-auto"
            style={{ background: colors.actionsBg, borderTop: colors.actionsBorder }}
          >
            {['What are your prices?', 'Build me a website', 'Get a quote'].map(q => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="flex-shrink-0 text-[10px] px-3 py-1.5 rounded-full hover:opacity-80 transition-all whitespace-nowrap font-medium"
                style={{
                  background: colors.quickBtnBg,
                  border: colors.quickBtnBorder,
                  color: colors.quickBtnColor,
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div
            className="flex gap-2 p-3"
            style={{ background: colors.actionsBg, borderTop: colors.actionsBorder }}
          >
            <input
              className="flex-1 px-3 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
              style={{
                background: colors.inputBg,
                border: colors.inputBorder,
                color: colors.inputColor,
              }}
              placeholder="Ask anything…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-40 hover:opacity-90 transition-all flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#14B8A6,#3B82F6)' }}
            >→</button>
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-5 right-5 z-[1000] w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-all"
        style={{
          background: 'linear-gradient(135deg,#14B8A6,#3B82F6)',
          boxShadow: '0 8px 30px rgba(20,184,166,.4)',
        }}
        aria-label="Open AI chat"
      >
        {open ? (
          <span className="text-xl">✕</span>
        ) : logo ? (
          <Image src={logo} alt={siteName} width={28} height={28} className="object-contain rounded" />
        ) : (
          <span className="text-2xl">💬</span>
        )}
        {!open && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"
            style={{ border: `2px solid ${isLight ? '#F8FAFC' : '#0D1421'}` }}
          ></span>
        )}
      </button>
    </>
  );
}