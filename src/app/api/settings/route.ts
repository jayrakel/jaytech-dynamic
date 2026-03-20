import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";

export async function GET() {
  const settings = await getSettings();
  // Only expose public-safe settings
  const pub: Record<string, string> = {};
  const allowed = ["site_name","site_tagline","logo_url","theme_mode",
    "theme_accent_teal","theme_accent_blue","theme_bg_dark","theme_bg_light",
    "social_facebook","social_instagram","social_linkedin","social_twitter","social_youtube",
    "contact_email","contact_phone_1","contact_phone_2","contact_address","business_hours",
    "hero_title","hero_subtitle","hero_image","hero_cta_primary","hero_cta_secondary",
    "stat_projects","stat_clients","stat_years","stat_satisfaction","services_pdf_url"];
  for (const k of allowed) pub[k] = settings[k] || "";
  return NextResponse.json(pub);
}
