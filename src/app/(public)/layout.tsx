// src/app/(public)/layout.tsx
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { getSettings } from '@/lib/settings';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <Nav settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
      <ChatWidget
        logo={settings.logo_url || settings.favicon_url || undefined}
        siteName={settings.site_name || 'Jay TechWave Solutions'}
      />
    </>
  );
}