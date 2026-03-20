import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") || undefined;
  const posts = await prisma.post.findMany({
    where: { published: true, ...(category ? { category } : {}) },
    orderBy: { publishedAt: "desc" },
    select: { id:true, title:true, slug:true, excerpt:true, coverImage:true, category:true, tags:true, featured:true, publishedAt:true, views:true },
  });
  return NextResponse.json(posts);
}
