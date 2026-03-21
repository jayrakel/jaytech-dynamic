import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { type, title, keywords, excerpt, category } = await req.json();
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
    }

    let prompt = '';

    if (type === 'blog') {
      prompt = `You are a tech content writer for Jay TechWave Solutions, a Nairobi-based IT company.

Write a complete, high-quality blog post for their website.

DETAILS:
- Title: ${title}
- Category: ${category || 'Technology'}
- Keywords: ${keywords || 'technology, Kenya, business'}

REQUIREMENTS:
- Write in HTML format (use h2, h3, p, ul, li, strong tags)
- 600–900 words
- Kenyan/East African business context where relevant
- Professional but conversational tone
- Include practical takeaways
- End with a subtle CTA mentioning Jay TechWave Solutions
- Do NOT include the title as an h1 (it will be added separately)
- Start directly with the first h2 section

Respond with ONLY the HTML content, no markdown, no explanation.`;

    } else if (type === 'seo') {
      prompt = `You are an SEO specialist for Jay TechWave Solutions, a Nairobi IT company.

Generate SEO suggestions for this blog post.

BLOG DETAILS:
- Title: ${title}
- Excerpt: ${excerpt || ''}
- Category: ${category || 'Technology'}
- Keywords: ${keywords || ''}

Respond ONLY with a valid JSON object, no markdown:
{
  "seoTitles": [
    "SEO title option 1 (50–60 chars)",
    "SEO title option 2 (50–60 chars)",
    "SEO title option 3 (50–60 chars)"
  ],
  "metaDescription": "Compelling meta description 150–160 characters",
  "focusKeyword": "main keyword phrase",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "readabilityTips": ["tip 1", "tip 2"]
}`;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await response.json();
    const raw = data.content?.[0]?.text || '';
    if (type === 'seo') {
      const clean = raw.replace(/```json|```/g, '').trim();
      const seo = JSON.parse(clean);
      return NextResponse.json(seo);
    }
    return NextResponse.json({ content: raw });
  } catch (e) {
    console.error('AI generate error:', e);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}