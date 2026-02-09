import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfessionalNav } from "@/components/layout/professional-nav";
import { Footer } from "@/components/layout/footer";

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
    <div className="min-h-screen flex flex-col">
      <ProfessionalNav />
      <main className="flex-1 p-4 sm:p-6">{children}</main>
      <Footer />
    </div>
  );
}
