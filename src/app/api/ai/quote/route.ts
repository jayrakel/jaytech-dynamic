// src/app/api/ai/quote/route.ts
import { NextRequest, NextResponse } from 'next/server';

async function groq(messages: object[], maxTokens = 1000) {
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
    const { projectType, budget, description, features, timeline, industry } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
    }

    const prompt = `You are a project estimator for Jay TechWave Solutions, a Nairobi-based IT company.

A potential client has submitted a project inquiry. Based on their requirements, provide a detailed estimate.

CLIENT REQUIREMENTS:
- Project Type: ${projectType}
- Industry: ${industry}
- Budget Range: ${budget}
- Timeline: ${timeline}
- Description: ${description}
- Required Features: ${features?.join(', ') || 'Not specified'}

Our standard pricing:
- Starter website: KES 35,000 | Business website: KES 75,000 | Enterprise: custom
- Mobile apps: from KES 80,000 | E-commerce: from KES 65,000
- Digital marketing: from KES 15,000/month | SEO: from KES 20,000/month
- Cloud setup: from KES 40,000 | Security audit: from KES 50,000

Respond ONLY with a valid JSON object. No markdown, no code fences, no explanation before or after:
{
  "estimatedCost": "KES X,XXX - KES X,XXX",
  "timeline": "X-X weeks",
  "recommendedPackage": "package name",
  "breakdown": [
    { "item": "item name", "cost": "KES X,XXX", "description": "brief description" }
  ],
  "approach": "2-3 sentences on the recommended technical approach",
  "includedFeatures": ["feature 1", "feature 2", "feature 3"],
  "nextSteps": "What the client should do next",
  "confidence": "high|medium|low",
  "disclaimer": "This is an estimate. Final pricing depends on detailed requirements."
}`;

    const raw      = await groq([{ role: 'user', content: prompt }], 1200);
    const clean    = raw.replace(/```json|```/g, '').trim();
    const estimate = JSON.parse(clean);
    return NextResponse.json(estimate);

  } catch (e) {
    console.error('AI quote error:', e);
    return NextResponse.json({ error: 'Could not generate estimate' }, { status: 500 });
  }
}