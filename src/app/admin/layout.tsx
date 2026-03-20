import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // No session = render children as-is (login page)
  // Middleware already blocks access to all other /admin/* routes
  if (!session) {
    return <>{children}</>;
  }

  return (
    // ✅ FIX: Added flex-col for mobile, md:flex-row for desktop
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950">
      <AdminSidebar user={session.user as any} />
      
      {/* ✅ FIX: Added pt-16 for mobile to account for the new top bar */}
      <main className="flex-1 overflow-x-hidden pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}