// src/app/api/admin/services/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import slugify from 'slugify';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const slug = slugify(body.title, { lower: true, strict: true });
  // Avoid slug collision
  const existing = await prisma.service.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;
  const service = await prisma.service.create({
    data: { ...body, slug: finalSlug, features: body.features || [], active: body.active ?? true },
  });
  return NextResponse.json(service, { status: 201 });
}