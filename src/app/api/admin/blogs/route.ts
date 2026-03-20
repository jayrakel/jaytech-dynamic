import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendBlogNotification } from "@/lib/sendgrid";
import slugify from "slugify";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const slug = slugify(body.title, { lower: true, strict: true });

  const post = await prisma.post.create({
    data: {
      ...body,
      slug,
      publishedAt: body.published ? new Date() : null,
    },
  });

  // Notify subscribers if publishing
  if (body.published) {
    const subscribers = await prisma.subscriber.findMany({ where: { status: "ACTIVE" } });
    if (subscribers.length > 0) {
      try {
        await sendBlogNotification({
          postTitle:   post.title,
          postSlug:    post.slug,
          postExcerpt: post.excerpt,
          subscribers,
        });
      } catch (e) { console.error("Newsletter send failed:", e); }
    }
  }

  return NextResponse.json(post, { status: 201 });
}
