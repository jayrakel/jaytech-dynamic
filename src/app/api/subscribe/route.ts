import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSubscriptionConfirm } from "@/lib/sendgrid";

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      if (existing.status === "ACTIVE") {
        return NextResponse.json({ message: "Already subscribed!" });
      }
      // Re-subscribe
      await prisma.subscriber.update({
        where: { email },
        data: { status: "PENDING" },
      });
    } else {
      await prisma.subscriber.create({ data: { email, name, status: "PENDING" } });
    }

    const sub = await prisma.subscriber.findUnique({ where: { email } });
    await sendSubscriptionConfirm({ email, name, token: sub!.token });

    return NextResponse.json({ success: true, message: "Check your email to confirm!" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Unsubscribe via link
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL("/", req.url));

  await prisma.subscriber.updateMany({
    where: { token },
    data:  { status: "UNSUBSCRIBED" },
  });
  return NextResponse.redirect(new URL("/?unsubscribed=1", req.url));
}
