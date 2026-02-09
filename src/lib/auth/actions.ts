"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

// ============================================
// SCHEMAS DE VALIDAÇÃO
// ============================================

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const registerSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .optional()
    .or(z.literal("")),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

// ============================================
// TIPOS
// ============================================

export type AuthState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  redirectTo?: string;
};

// ============================================
// ACTIONS
// ============================================

/**
 * Login com email e senha
 */
export async function loginAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Validar dados
  const validatedFields = loginSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Dados inválidos",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      message: error.message === "Invalid login credentials"
        ? "Email ou senha incorretos"
        : error.message,
    };
  }

  // Determinar URL de redirecionamento baseado no role do usuário
  const { data: user } = await supabase
    .from("users")
    .select("role")
    .eq("email", email)
    .single();

  // Sempre redireciona para a home inicial do perfil após login.
  // Requisito: ignorar redirect dinâmico e manter fluxo fixo por role.
  let targetUrl = "/dashboard";
  if (user?.role === "admin") {
    targetUrl = "/admin/dashboard";
  } else if (user?.role === "barbeiro") {
    targetUrl = "/profissional/dashboard";
  }

  return {
    success: true,
    message: "Login realizado com sucesso! Redirecionando...",
    redirectTo: targetUrl,
  };
}

/**
 * Cadastro de novo usuário
 */
export async function registerAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const rawData = {
    nome: formData.get("nome") as string,
    email: formData.get("email") as string,
    telefone: formData.get("telefone") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  // Validar dados
  const validatedFields = registerSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Dados inválidos",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { nome, email, telefone, password } = validatedFields.data;

  const supabase = await createClient();

  // Criar usuário no Supabase Auth
  const { error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nome,
        telefone: telefone || null,
      },
    },
  });

  if (authError) {
    if (authError.message.includes("already registered")) {
      return {
        success: false,
        message: "Este email já está cadastrado",
      };
    }
    return {
      success: false,
      message: authError.message,
    };
  }

  // Atualizar telefone no perfil (o trigger já criou o user)
  if (telefone) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("users")
        .update({ telefone })
        .eq("id", user.id);
    }
  }

  return {
    success: true,
    message: "Conta criada com sucesso! Redirecionando...",
  };
}

/**
 * Logout
 */
export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

/**
 * Solicitar reset de senha
 */
export async function forgotPasswordAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const rawData = {
    email: formData.get("email") as string,
  };

  // Validar dados
  const validatedFields = forgotPasswordSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Email inválido",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validatedFields.data;

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/resetar-senha`,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Se o email existir, você receberá instruções para redefinir sua senha",
  };
}

/**
 * Resetar senha (após clicar no link do email)
 */
export async function resetPasswordAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const rawData = {
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  // Validar dados
  const validatedFields = resetPasswordSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Dados inválidos",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { password } = validatedFields.data;

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Senha alterada com sucesso! Redirecionando...",
    redirectTo: "/login?message=Senha alterada com sucesso",
  };
}

/**
 * Obter usuário atual
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

/**
 * Atualizar perfil do usuário
 */
export async function updateProfileAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return {
      success: false,
      message: "Não autenticado",
    };
  }

  const nome = formData.get("nome") as string;
  const telefone = formData.get("telefone") as string;

  if (!nome || nome.length < 2) {
    return {
      success: false,
      message: "Nome deve ter pelo menos 2 caracteres",
    };
  }

  const { error } = await supabase
    .from("users")
    .update({
      nome,
      telefone: telefone || null,
    })
    .eq("id", user.id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Perfil atualizado com sucesso",
  };
}
