import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import { getSettings } from '@/lib/settings';
import './globals.css';
import GlobalLoader from "@/components/GlobalLoader";
import { Suspense } from "react";

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
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return {
    metadataBase: new URL(appUrl),
    title: {
      default:  s.site_name || 'Jay TechWave Solutions',
      template: `%s | ${s.site_name || 'Jay TechWave Solutions'}`,
    },
    description: s.site_description || "Nairobi's premier IT company delivering web development, digital marketing, cloud solutions and cybersecurity services.",
    icons: { icon: s.favicon_url || '/favicon.ico' },
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
  const themeMode = settings.theme_mode || 'dark';

  // Build dynamic CSS variables from settings database
  const cssVars = `
    :root {
      --accent-teal: ${settings.theme_accent_teal || '#14B8A6'};
      --accent-blue: ${settings.theme_accent_blue || '#3B82F6'};
      --bg-dark:     ${settings.theme_bg_dark  || '#0D1421'};
      --bg-light:    ${settings.theme_bg_light || '#F8FAFC'};
    }
  `;

  return (
    <html lang="en" suppressHydrationWarning className={themeMode}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className={`${syne.variable} ${dmSans.variable} font-body bg-slate-900 dark:bg-[var(--bg-dark)] text-slate-100 transition-colors duration-300`}>
        <ThemeProvider defaultTheme={themeMode as 'dark' | 'light'}>
          
          {/* ✅ Global Loader placed at the top of the body for z-index priority */}
          <Suspense fallback={null}>
            <GlobalLoader logo={settings.favicon_url || '/favicon.ico'} />
          </Suspense>

          {/* Main Page Content */}
          {children}

          {/* Notifications */}
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