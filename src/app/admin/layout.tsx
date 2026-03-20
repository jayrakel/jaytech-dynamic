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
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar user={session.user as any} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}