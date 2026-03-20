import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file   = formData.get("file") as File;
  const folder = (formData.get("folder") as string) || "jaytech";

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes  = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const isPdf = file.type === "application/pdf";

  const result = await uploadToCloudinary(buffer, {
    folder,
    resourceType: isPdf ? "raw" : "image",
  });

  // Save to media library
  const media = await prisma.media.create({
    data: {
      name:     file.name,
      url:      result.url,
      publicId: result.publicId,
      type:     isPdf ? "pdf" : "image",
      size:     result.size,
      width:    result.width,
      height:   result.height,
      folder,
    },
  });

  return NextResponse.json(media);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { publicId, id } = await req.json();
  await deleteFromCloudinary(publicId);
  if (id) await prisma.media.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
