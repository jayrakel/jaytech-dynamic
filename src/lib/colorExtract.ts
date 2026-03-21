// src/lib/colorExtract.ts

/** Convert hex to [h, s, l] — h: 0-360, s: 0-100, l: 0-100 */
export function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/** Convert [h, s, l] back to hex */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/** Determine if a color is readable on white */
export function isReadableOnWhite(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // WCAG relative luminance
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum < 180; // dark enough to read on white
}

/**
 * Generate a full light-theme palette from one dominant color.
 * Produces tinted backgrounds, readable text, and accent colors.
 */
export function generateLightPalette(primaryHex: string): Record<string, string> {
  const hex = /^#[0-9A-Fa-f]{6}$/.test(primaryHex) ? primaryHex : '#14B8A6';
  const [h, s] = hexToHsl(hex);

  // Cap saturation so backgrounds don't look garish
  const bgS     = Math.min(s, 20);
  const borderS = Math.min(s, 30);
  const textS   = Math.min(s, 50);
  const accentS = Math.min(Math.max(s, 40), 80); // keep accent vivid

  return {
    // ── Backgrounds ───────────────────────────────────
    light_bg_base:      hslToHex(h, bgS, 98),   // Page background (near white, color-tinted)
    light_bg_secondary: hslToHex(h, bgS, 95),   // Sections, alternating rows
    light_bg_surface:   '#FFFFFF',               // Cards, modals — pure white
    light_bg_elevated:  hslToHex(h, bgS, 97),   // Slightly elevated surface

    // ── Borders ───────────────────────────────────────
    light_border_subtle: hslToHex(h, borderS, 90), // Very subtle dividers
    light_border_default:hslToHex(h, borderS, 84), // Default borders
    light_border_strong: hslToHex(h, borderS, 74), // Stronger borders

    // ── Text ──────────────────────────────────────────
    light_text_primary:  hslToHex(h, textS, 8),    // Near-black headings
    light_text_secondary:hslToHex(h, textS, 28),   // Body text
    light_text_muted:    hslToHex(h, textS, 50),   // Captions, placeholders
    light_text_faint:    hslToHex(h, textS, 68),   // Very muted

    // ── Accent (for buttons, links, highlights) ───────
    light_accent:        hslToHex(h, accentS, 42), // Primary accent
    light_accent_hover:  hslToHex(h, accentS, 35), // Hover state
    light_accent_light:  hslToHex(h, accentS, 92), // Light accent bg
    light_accent_medium: hslToHex(h, accentS, 80), // Medium accent bg

    // ── Nav & overlays ────────────────────────────────
    light_nav_bg:        `rgba(255,255,255,0.95)`,
    light_overlay:       `rgba(${parseInt(hslToHex(h,bgS,98).slice(1,3),16)},${parseInt(hslToHex(h,bgS,98).slice(3,5),16)},${parseInt(hslToHex(h,bgS,98).slice(5,7),16)},0.97)`,
  };
}

/** Extract Cloudinary public ID from a full URL */
export function extractCloudinaryPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return match ? match[1] : null;
}

/** Pick the best accent color from Cloudinary's color array */
export function pickBestColor(colors: [string, number][]): string {
  if (!colors?.length) return '#14B8A6';

  // Score each color: prefer vivid, mid-brightness colors
  const scored = colors.map(([hex, pct]) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    const [, s, l] = hexToHsl(hex);

    // Penalise near-black, near-white, and near-grey
    const brightnessScore = brightness > 30 && brightness < 200 ? 1 : 0;
    const saturationScore = s > 20 ? s / 100 : 0;
    const score = brightnessScore * saturationScore * pct;

    return { hex, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.hex || '#14B8A6';
}