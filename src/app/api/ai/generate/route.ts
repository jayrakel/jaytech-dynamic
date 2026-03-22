// src/app/api/ai/generate/route.ts
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
    const { type, title, keywords, excerpt, category } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
    }

    // ── Blog post generation ─────────────────────────────────
    if (type === 'blog') {
      const prompt = `You are a tech content writer for Jay TechWave Solutions, a Nairobi-based IT company.

Write a complete, high-quality blog post for their website.

DETAILS:
- Title: ${title}
- Category: ${category || 'Technology'}
- Keywords: ${keywords || 'technology, Kenya, business'}

REQUIREMENTS:
- Write in HTML format (use h2, h3, p, ul, li, strong tags only)
- 600–900 words
- Kenyan/East African business context where relevant
- Professional but conversational tone
- Include practical takeaways
- End with a subtle CTA mentioning Jay TechWave Solutions
- Do NOT include the title as an h1 (it will be added separately)
- Start directly with the first h2 section

Respond with ONLY the HTML content. No markdown, no code fences, no explanation.`;

      const content = await groq([{ role: 'user', content: prompt }], 1800);
      return NextResponse.json({ content });
    }

    // ── SEO suggestions ──────────────────────────────────────
    if (type === 'seo') {
      const prompt = `You are an SEO specialist for Jay TechWave Solutions, a Nairobi IT company.

Generate SEO suggestions for this blog post.

BLOG DETAILS:
- Title: ${title}
- Excerpt: ${excerpt || ''}
- Category: ${category || 'Technology'}
- Keywords: ${keywords || ''}

Respond ONLY with a valid JSON object. No markdown, no code fences, no explanation before or after:
{
  "seoTitles": [
    "SEO title option 1 (50-60 chars)",
    "SEO title option 2 (50-60 chars)",
    "SEO title option 3 (50-60 chars)"
  ],
  "metaDescription": "Compelling meta description 150-160 characters",
  "focusKeyword": "main keyword phrase",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "readabilityTips": ["tip 1", "tip 2"]
}`;

      const raw   = await groq([{ role: 'user', content: prompt }], 800);
      const clean = raw.replace(/```json|```/g, '').trim();
      const seo   = JSON.parse(clean);
      return NextResponse.json(seo);
    }

    return NextResponse.json({ error: 'Unknown type' }, { status: 400 });

  } catch (e) {
    console.error('AI generate error:', e);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}