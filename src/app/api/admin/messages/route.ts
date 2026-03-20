import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    const status = req.nextUrl.searchParams.get("status") || undefined;
    const messages = await prisma.message.findMany({
      where: status ? { status: status as any } : {},
      include: { repliedBy: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
}
