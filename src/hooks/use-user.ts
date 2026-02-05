"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@/types";

/**
 * Hook para obter e gerenciar o usuário atual no cliente
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const supabase = createClient();

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    setUser(profile as User | null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();

    // Escutar mudanças de autenticação
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUser]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    refresh,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isBarbeiro: user?.role === "barbeiro",
    isCliente: user?.role === "cliente",
  };
}
