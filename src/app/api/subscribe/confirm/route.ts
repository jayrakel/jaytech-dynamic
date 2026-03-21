import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  
  // Hardcode the fallback to your live domain
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';

  if (!token) {
    return NextResponse.redirect(`${baseUrl}/`);
  }

  try {
    // 1. Update the subscriber in the database
    await prisma.subscriber.updateMany({
      where: { token },
      data:  { status: "ACTIVE", confirmedAt: new Date() },
    });

    // 2. Safely redirect them back to the homepage with a success message
    return NextResponse.redirect(`${baseUrl}/?subscribed=1`);
    
  } catch (error) {
    console.error("Confirmation error:", error);
    // Even if it fails, send them back to the homepage so they aren't stuck on a blank screen
    return NextResponse.redirect(`${baseUrl}/`);
  }
}