// src/app/api/ai/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM = `You are an AI assistant for Jay TechWave Solutions, a premier IT company based in Nairobi, Kenya.

ABOUT US:
- We deliver web development, mobile apps, digital marketing, cloud solutions, cybersecurity, and IT consulting
- Founded 2019, 12+ engineers, 150+ projects across East Africa
- We work with businesses of all sizes across Kenya and internationally

SERVICES & PRICING:
- Web Development: Starter KES 35,000 | Business KES 75,000 | Enterprise custom
- App Development: Cross-platform (Flutter/React Native), iOS & Android
- Digital Marketing: SEO, Google Ads, social media, email marketing
- Cloud Solutions: AWS, Azure, GCP migrations and managed services
- Cybersecurity: Pen testing, 24/7 monitoring, compliance
- IT Support & Consulting: Outsourced IT, helpdesk, network setup

CONTACT:
- Email: jaytechwavesolutions@gmail.com
- Phone: +254716962489 / +254100310330
- Address: 472-00200 Nairobi, Kenya
- Hours: Mon–Fri 8AM–6PM
- Response time: within 2 hours

INSTRUCTIONS:
- Be helpful, professional, and warm
- Keep responses concise — 2–3 short paragraphs max
- Always guide visitors toward getting a quote at /quote or contacting us
- If asked about pricing, give the ranges above and suggest a free consultation
- Do not make up services or prices not listed above
- Respond in the same language the visitor uses`;

// Shared Groq fetch helper
async function groq(messages: object[], maxTokens = 600) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: maxTokens,
      messages,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Groq API error');
  return data.choices?.[0]?.message?.content || '';
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
    }

    // Prepend system message then append the conversation
    const groqMessages = [
      { role: 'system', content: SYSTEM },
      ...messages,
    ];

    const text = await groq(groqMessages, 600);
    return NextResponse.json({ message: text || 'Sorry, I could not process that. Please contact us directly.' });
  } catch (e) {
    console.error('AI chat error:', e);
    return NextResponse.json({ error: 'AI unavailable' }, { status: 500 });
  }
}