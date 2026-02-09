import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProfessionalNav } from "@/components/layout/professional-nav";
import { ProfessionalSidebar } from "@/components/layout/professional-sidebar";

export default async function ProfissionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/profissional/dashboard");
  }

  // Verificar se é barbeiro
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "barbeiro" && profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex overflow-x-hidden">
      {/* Sidebar */}
      <ProfessionalSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 sm:px-6">
          <div className="lg:hidden">
            <Link href="/profissional/dashboard" className="text-lg font-bold text-gradient-gold">
              Profissional
            </Link>
          </div>
          <div className="hidden lg:block" />
          <ProfessionalNav />
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
