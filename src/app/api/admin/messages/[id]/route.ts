import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendReply } from "@/lib/sendgrid";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const msg = await prisma.message.findUnique({ where: { id: params.id } });
  if (!msg) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (msg.status === "UNREAD") await prisma.message.update({ where: { id: params.id }, data: { status: "READ" } });
  return NextResponse.json(msg);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  if (body.reply) {
    const msg = await prisma.message.findUnique({ where: { id: params.id } });
    if (!msg) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await sendReply({
      to:              msg.email,
      clientName:      `${msg.firstName} ${msg.lastName}`,
      replyText:       body.reply,
      originalMessage: msg.message,
    });

    const updated = await prisma.message.update({
      where: { id: params.id },
      data: {
        reply:       body.reply,
        repliedAt:   new Date(),
        status:      "REPLIED",
        repliedById: (session.user as any).id,
      },
    });
    return NextResponse.json(updated);
  }

  const updated = await prisma.message.update({
    where: { id: params.id },
    data:  body,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.message.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
