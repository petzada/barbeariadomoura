"use client";

import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminDashboardHeader() {
  const { user, loading } = useUser();

  // Saudação baseada no horário
  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Bom dia";
    if (hora < 18) return "Boa tarde";
    return "Boa noite";
  };

  if (loading) {
    return (
      <div>
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

  return (
    <div>
      <p className="text-[#EAD8AC]">{getSaudacao()},</p>
      <h1 className="text-2xl font-bold">{user?.nome?.split(" ")[0]}</h1>
    </div>
  );
}

