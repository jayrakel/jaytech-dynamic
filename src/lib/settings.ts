// src/lib/settings.ts
import { prisma } from './prisma';

export type Settings = Record<string, string>;

const DEFAULTS: Settings = {
  site_name:           'Jay TechWave Solutions',
  site_tagline:        "Nairobi's Premier IT Company",
  site_description:    "We deliver web development, digital marketing, app development, cloud solutions and cybersecurity services that grow your business.",
  logo_url:            '',
  favicon_url:         '',
  services_pdf_url:    '',
  contact_email:       'jaytechwavesolutions@gmail.com',
  contact_phone_1:     '+254716962489',
  contact_phone_2:     '+254100310330',
  contact_address:     '472-00200 Nairobi, Kenya',
  business_hours:      'Mon–Fri: 8AM–6PM · Sat: 9AM–2PM',
  social_facebook:     'https://web.facebook.com/me/',
  social_instagram:    'https://instagram.com',
  social_linkedin:     'https://linkedin.com',
  social_twitter:      'https://twitter.com',
  social_youtube:      'https://youtube.com',
  theme_mode:          'dark',
  theme_accent_teal:   '#14B8A6',
  theme_accent_blue:   '#3B82F6',
  theme_bg_dark:       '#0D1421',
  theme_bg_light:      '#F8FAFC',
  hero_title:          'We Build Digital Solutions That Drive Real Growth',
  hero_subtitle:       "From web development and mobile apps to cloud infrastructure and digital marketing — Jay TechWave Solutions is the technology partner Kenya's businesses trust.",
  hero_image:          '',
  hero_cta_primary:    'Start Your Project',
  hero_cta_secondary:  'Explore Services',
  stat_projects:       '150+',
  stat_clients:        '80+',
  stat_years:          '5+',
  stat_satisfaction:   '99%',
  notify_new_message:  'true',
  notify_new_subscriber: 'true',
  notify_email:        'jaytechwavesolutions@gmail.com',
};

// Fetch all settings as a key→value map (returns defaults if DB unavailable)
export async function getSettings(): Promise<Settings> {
  try {
    const rows = await prisma.setting.findMany();
    // Merge DB values over defaults
    const fromDb = rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {} as Settings);
    return { ...DEFAULTS, ...fromDb };
  } catch {
    // DB not connected yet — return defaults so site still renders
    return DEFAULTS;
  }
}

// Fetch a single setting by key with a fallback
export async function getSetting(key: string, fallback = ''): Promise<string> {
  try {
    const row = await prisma.setting.findUnique({ where: { key } });
    return row?.value ?? DEFAULTS[key] ?? fallback;
  } catch {
    return DEFAULTS[key] ?? fallback;
  }
}

// Update a single setting
export async function updateSetting(key: string, value: string) {
  return prisma.setting.upsert({
    where:  { key },
    update: { value },
    create: { key, value },
  });
}

// Update multiple settings at once
export async function updateSettings(data: Record<string, string>) {
  const ops = Object.entries(data).map(([key, value]) =>
    prisma.setting.upsert({
      where:  { key },
      update: { value },
      create: { key, value },
    })
  );
  return prisma.$transaction(ops);
}

// Helper: build CSS variables from theme settings
export function buildThemeCss(settings: Settings): string {
  return `
    :root {
      --accent-teal: ${settings.theme_accent_teal || '#14B8A6'};
      --accent-blue: ${settings.theme_accent_blue || '#3B82F6'};
      --bg-dark:     ${settings.theme_bg_dark  || '#0D1421'};
      --bg-light:    ${settings.theme_bg_light || '#F8FAFC'};
    }
  `;
}