
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/admin/login");
  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar user={session.user as any} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
