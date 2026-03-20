import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSettings, updateSettings } from "@/lib/settings";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  await updateSettings(body);
  return NextResponse.json({ success: true });
}
