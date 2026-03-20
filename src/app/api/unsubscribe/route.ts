import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token) {
    await prisma.subscriber.updateMany({
      where: { token },
      data:  { status: "UNSUBSCRIBED" },
    });
  }
  return NextResponse.redirect(new URL("/?unsubscribed=1", req.url));
}
