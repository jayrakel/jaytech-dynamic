// src/app/api/subscribe/confirm/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    // Use req.url as base — preserves the actual domain at runtime (never localhost)
    return NextResponse.redirect(new URL("/", req.url));
  }

  await prisma.subscriber.updateMany({
    where: { token },
    data: { status: "ACTIVE", confirmedAt: new Date() },
  });

  // Same pattern as middleware.ts and unsubscribe/route.ts —
  // req.url is always the real deployed URL, never localhost or undefined
  return NextResponse.redirect(new URL("/?subscribed=true", req.url));
}