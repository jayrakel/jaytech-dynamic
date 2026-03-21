// src/app/api/admin/extract-colors/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { cloudinary } from '@/lib/cloudinary';
import {
  extractCloudinaryPublicId,
  generateLightPalette,
  pickBestColor,
} from '@/lib/colorExtract';
import { updateSettings } from '@/lib/settings';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { logoUrl } = await req.json();
  if (!logoUrl) return NextResponse.json({ error: 'No logo URL provided' }, { status: 400 });

  try {
    let primaryColor = '#14B8A6'; // fallback to brand teal

    // Extract colors via Cloudinary Admin API
    const publicId = extractCloudinaryPublicId(logoUrl);
    if (publicId) {
      const result = await cloudinary.api.resource(publicId, { colors: true });
      const rawColors: [string, number][] = result.colors || [];
      primaryColor = pickBestColor(rawColors);
    } else {
      // Not a Cloudinary URL — try a simple fetch & average
      // We just use the fallback in this case
      console.warn('Could not extract Cloudinary public ID from:', logoUrl);
    }

    // Generate the full palette
    const palette = generateLightPalette(primaryColor);

    // Persist to settings DB so layout.tsx can read them
    await updateSettings({
      ...palette,
      light_extracted_from: logoUrl,
      light_primary_color:  primaryColor,
    });

    return NextResponse.json({
      success: true,
      primaryColor,
      palette,
    });
  } catch (e: any) {
    console.error('Color extraction error:', e);
    return NextResponse.json(
      { error: e?.message || 'Color extraction failed' },
      { status: 500 }
    );
  }
}