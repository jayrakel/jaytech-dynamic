import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNewsletter } from "@/lib/sendgrid";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subject, content } = await req.json();
  const subscribers = await prisma.subscriber.findMany({ where: { status: "ACTIVE" } });

  if (subscribers.length === 0) {
    return NextResponse.json({ error: "No active subscribers" }, { status: 400 });
  }

  await sendNewsletter({ subject, content, subscribers });

  const record = await prisma.newsletter.create({
    data: { subject, content, sentAt: new Date(), sentCount: subscribers.length },
  });

  return NextResponse.json({ success: true, sentCount: subscribers.length, id: record.id });
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const newsletters = await prisma.newsletter.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(newsletters);
}
