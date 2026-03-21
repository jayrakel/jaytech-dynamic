import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const faviconUrl = s.favicon_url || '/favicon.svg';
  return {
    title: {
      default: `Admin — ${s.site_name || 'Jay TechWave Solutions'}`,
      template: `%s | Admin`,
    },
    icons: {
      icon:     faviconUrl,
      apple:    faviconUrl,
      shortcut: faviconUrl,
    },
  };
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    return <>{children}</>;
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { mustChangePassword: true },
  });

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar user={session.user as any} />
      <main className="flex-1 overflow-auto">
        {user?.mustChangePassword && (
          <div className="bg-yellow-400/10 border-b border-yellow-400/30 px-8 py-3 flex items-center gap-3">
            <span className="text-yellow-400 text-lg">⚠️</span>
            <p className="text-yellow-300 text-sm">
              <strong>Security notice:</strong> You are using the default password.
              <a href="/admin/profile" className="underline ml-1 font-bold hover:text-yellow-200">
                Please change it now →
              </a>
            </p>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}