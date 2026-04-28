import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";

export async function POST(req: NextRequest) {
  // Authenticate with a secret key
  const manusApiKey = req.headers.get("x-manus-api-key");
  if (manusApiKey !== process.env.MANUS_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Validate required fields
    if (!body.title || !body.content || !body.excerpt || !body.category) {
      return NextResponse.json({ error: "Missing required fields (title, content, excerpt, category)" }, { status: 400 });
    }

    const slug = slugify(body.title, { lower: true, strict: true });

    // Use upsert to update if the slug already exists, or create if it doesn't
    const post = await prisma.post.upsert({
      where: { slug: slug },
      update: {
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        category: body.category,
        tags: body.tags || [],
        published: body.published !== undefined ? body.published : true,
        featured: body.featured || false,
        coverImage: body.coverImage || null,
        // Only update publishedAt if it's being published now and wasn't before
        ...(body.published ? { publishedAt: new Date() } : {}),
      },
      create: {
        title: body.title,
        slug: slug,
        excerpt: body.excerpt,
        content: body.content,
        category: body.category,
        tags: body.tags || [],
        published: body.published !== undefined ? body.published : true,
        featured: body.featured || false,
        coverImage: body.coverImage || null,
        publishedAt: body.published ? new Date() : null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error("Manus post API error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
