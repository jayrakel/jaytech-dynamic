// src/app/api/ai/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server';

async function groq(messages: object[], maxTokens = 1500) {
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
    const { topic, tone = 'professional' } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
    }

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const toneGuide: Record<string, string> = {
      professional: 'formal, authoritative, business-focused',
      friendly:     'warm, conversational, approachable — like writing to a friend',
      educational:  'informative, clear, structured with tips and insights',
      promotional:  'compelling, action-oriented, highlights benefits and urgency',
    };

    const prompt = `You are an email marketing specialist for Jay TechWave Solutions, a premier IT company based in Nairobi, Kenya.

Write a complete newsletter email based on this brief:
TOPIC: ${topic}
TONE: ${toneGuide[tone] || toneGuide.professional}

ABOUT THE COMPANY:
- Services: web development, mobile apps, digital marketing, cloud solutions, cybersecurity, IT consulting
- Based in Nairobi, serving Kenya and East Africa
- Contact: jaytechwavesolutions@gmail.com | +254716962489

REQUIREMENTS:
- Write the subject line and full email body
- Email body in clean HTML (use h2, h3, p, ul, li, strong, a tags)
- 250-400 words — newsletters should be concise and scannable
- Include a clear call-to-action button or link at the end
- Use {{name}} placeholder where a personal greeting makes sense
- Kenyan/East African business context where relevant
- Do NOT include DOCTYPE, html, head, or body tags — just the inner content

Respond ONLY with a valid JSON object. No markdown, no code fences:
{
  "subject": "The email subject line (compelling, under 60 chars)",
  "content": "The full HTML email body content"
}`;

    const raw   = await groq([{ role: 'user', content: prompt }], 1800);
    const clean = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    if (!result.subject || !result.content) {
      throw new Error('Invalid AI response structure');
    }

    return NextResponse.json(result);

  } catch (e) {
    console.error('AI newsletter error:', e);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}