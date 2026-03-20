import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    return <>{children}</>;
  }

  // ✅ FIX 1: Find user by email, not ID, to prevent NextAuth crashes
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    select: { mustChangePassword: true },
  });

  return (
    // ✅ FIX 2: Added back `flex-col md:flex-row` so mobile stacks correctly
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950">
      <AdminSidebar user={session.user as any} />
      
      {/* ✅ FIX 3: Added `pt-16 md:pt-0` so the top menu doesn't cover your content */}
      <main className="flex-1 overflow-x-hidden pt-16 md:pt-0">
        
        {user?.mustChangePassword && (
          <div className="bg-yellow-400/10 border-b border-yellow-400/30 px-4 py-3 flex md:px-8 items-center gap-3">
            <span className="text-yellow-400 text-lg">⚠️</span>
            <p className="text-yellow-300 text-sm">
              <strong>Security notice:</strong> You are using the default password. 
              <Link href="/admin/profile" className="underline ml-1 font-bold hover:text-yellow-200">
                Please change it now →
              </Link>
            </p>
          </div>
        )}
        
        {children}
      </main>
    </div>
  );
}