import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClientNav } from "@/components/layout/client-nav";

export default async function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/?redirect=/dashboard");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/");
  }

  if (profile.role === "admin") {
    redirect("/admin/dashboard");
  }

  if (profile.role === "barbeiro") {
    redirect("/profissional/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#013648] text-[#EAD8AC]">
      <ClientNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
