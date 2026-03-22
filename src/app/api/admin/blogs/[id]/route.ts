// src/app/api/admin/blogs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendBlogNotification } from "@/lib/sendgrid";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  return NextResponse.json(post);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Fetch current state BEFORE updating so we can detect publish transition
  const existing = await prisma.post.findUnique({ where: { id: params.id } });

  // Set publishedAt timestamp when publishing for the first time
  if (body.published && !existing?.published) {
    body.publishedAt = new Date();
  }

  const post = await prisma.post.update({ where: { id: params.id }, data: body });

  // Send notification ONLY when transitioning draft → published for the first time
  // (not on every save, not on re-saves of already published posts)
  const justPublished = body.published && !existing?.published;
  if (justPublished) {
    const subscribers = await prisma.subscriber.findMany({ where: { status: "ACTIVE" } });
    if (subscribers.length > 0) {
      try {
        await sendBlogNotification({
          postTitle:   post.title,
          postSlug:    post.slug,
          postExcerpt: post.excerpt,
          subscribers,
        });
      } catch (e) {
        console.error("Blog notification failed:", e);
      }
    }
  }

  return NextResponse.json(post);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.post.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}