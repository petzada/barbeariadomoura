"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/use-user";
import { getInitials } from "@/lib/utils";
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
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-14 w-14">
        <AvatarImage src={user?.avatar_url || undefined} alt={user?.nome || ""} />
        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
          {getInitials(user?.nome || "")}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-muted-foreground">{getSaudacao()},</p>
        <h1 className="text-2xl sm:text-3xl font-bold">
          {user?.nome?.split(" ")[0]}
        </h1>
      </div>
    </div>
  );
}
