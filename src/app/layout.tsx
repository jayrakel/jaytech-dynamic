// src/app/layout.tsx
import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import { getSettings } from '@/lib/settings';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const appUrl =
    process.env.NEXTAUTH_URL ||
    process.env.AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    '';
  return {
    metadataBase: new URL(appUrl),
    title: {
      default:  s.site_name || 'Jay TechWave Solutions',
      template: `%s | ${s.site_name || 'Jay TechWave Solutions'}`,
    },
    description: s.site_description || "Nairobi's premier IT company delivering web development, digital marketing, cloud solutions and cybersecurity services.",
    // Favicon is set via <link> tags in RootLayout below —
    // metadataBase would break external Cloudinary URLs
    openGraph: {
      siteName:    s.site_name || 'Jay TechWave Solutions',
      type:        'website',
      locale:      'en_KE',
      description: s.site_description || "Nairobi's premier IT company.",
    },
    twitter: {
      card:        'summary_large_image',
      title:       s.site_name || 'Jay TechWave Solutions',
      description: s.site_description || "Nairobi's premier IT company.",
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const themeMode  = settings.theme_mode || 'dark';
  const faviconUrl = settings.favicon_url || '/favicon.svg';

  // Build dynamic CSS variables — dark theme + extracted light palette
  const cssVars = `
    :root {
      --accent-teal: ${settings.theme_accent_teal || '#14B8A6'};
      --accent-blue: ${settings.theme_accent_blue || '#3B82F6'};
      --bg-dark:     ${settings.theme_bg_dark  || '#0D1421'};
      --bg-light:    ${settings.theme_bg_light || '#F8FAFC'};

      /* Light theme palette — overridden by logo color extraction */
      --light-bg-base:        ${settings.light_bg_base        || '#F8FAFC'};
      --light-bg-secondary:   ${settings.light_bg_secondary   || '#F1F5F9'};
      --light-bg-surface:     ${settings.light_bg_surface     || '#FFFFFF'};
      --light-bg-elevated:    ${settings.light_bg_elevated    || '#F8FAFC'};
      --light-border-subtle:  ${settings.light_border_subtle  || '#E2E8F0'};
      --light-border-default: ${settings.light_border_default || '#CBD5E1'};
      --light-border-strong:  ${settings.light_border_strong  || '#94A3B8'};
      --light-text-primary:   ${settings.light_text_primary   || '#0F172A'};
      --light-text-secondary: ${settings.light_text_secondary || '#475569'};
      --light-text-muted:     ${settings.light_text_muted     || '#64748B'};
      --light-text-faint:     ${settings.light_text_faint     || '#94A3B8'};
      --light-accent:         ${settings.light_accent         || settings.theme_accent_teal || '#14B8A6'};
      --light-accent-hover:   ${settings.light_accent_hover   || '#0D9488'};
      --light-accent-light:   ${settings.light_accent_light   || 'rgba(20,184,166,.08)'};
      --light-accent-medium:  ${settings.light_accent_medium  || 'rgba(20,184,166,.18)'};
      --light-nav-bg:         ${settings.light_nav_bg         || 'rgba(255,255,255,0.95)'};
      --light-overlay:        ${settings.light_overlay        || 'rgba(248,250,252,0.97)'};
    }
  `;

  return (
    <html lang="en" suppressHydrationWarning className={themeMode}>
      <head>
        {/* Font Awesome — required for social icons in footer/nav */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
        />
        {/* Favicon — direct <link> tags bypass metadataBase so Cloudinary URLs work */}
        <link rel="icon" href={faviconUrl} />
        <link rel="shortcut icon" href={faviconUrl} />
        <link rel="apple-touch-icon" href={faviconUrl} />
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      </head>
      <body className={`${syne.variable} ${dmSans.variable} font-body bg-slate-900 dark:bg-[var(--bg-dark)] text-slate-100 transition-colors duration-300`}>
        <ThemeProvider defaultTheme={themeMode as 'dark' | 'light'}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#111B2E',
                color: '#F0F6FF',
                border: '1px solid rgba(20,184,166,.2)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}