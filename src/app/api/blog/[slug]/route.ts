import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug, published: true } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // increment views
  await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } });
  return NextResponse.json(post);
}
