import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { projectType, budget, description, features, timeline, industry } = await req.json();
    if (!process.env.ANTHROPIC_API_KEY) {
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

Respond ONLY with a valid JSON object, no markdown, no explanation outside the JSON:
{
  "estimatedCost": "KES X,XXX – KES X,XXX",
  "timeline": "X–X weeks",
  "recommendedPackage": "package name",
  "breakdown": [
    { "item": "item name", "cost": "KES X,XXX", "description": "brief description" }
  ],
  "approach": "2–3 sentences on the recommended technical approach",
  "includedFeatures": ["feature 1", "feature 2", "feature 3"],
  "nextSteps": "What the client should do next",
  "confidence": "high|medium|low",
  "disclaimer": "This is an estimate. Final pricing depends on detailed requirements."
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await response.json();
    const raw = data.content?.[0]?.text || '{}';
    const clean = raw.replace(/```json|```/g, '').trim();
    const estimate = JSON.parse(clean);
    return NextResponse.json(estimate);
  } catch (e) {
    console.error('AI quote error:', e);
    return NextResponse.json({ error: 'Could not generate estimate' }, { status: 500 });
  }
}