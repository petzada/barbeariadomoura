# routes.md

| Route | File |
|---|---|


## Middleware

```ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Aplica middleware em todas as rotas exceto:
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico (favicon)
     * - Arquivos públicos com extensão (svg, png, jpg, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

```

## Supabase Route Guard

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

interface CookieToSet {
  name: string;
  value: string;
  options?: Record<string, unknown>;
}

/**
 * Atualiza sessão do Supabase no middleware
 * Deve ser chamado no middleware.ts principal
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANTE: Não execute código entre createServerClient e supabase.auth.getUser()
  // Um simples erro pode fazer com que usuários sejam deslogados aleatoriamente.

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Se falhar ao obter usuário, continua como não autenticado
    return supabaseResponse;
  }

  // Rotas públicas que não requerem autenticação
  const publicPaths = ["/", "/cadastro", "/esqueci-senha", "/resetar-senha"];
  const publicPrefixes = ["/api/webhooks", "/pagamento", "/sobre"];
  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path
  ) || publicPrefixes.some(
    (prefix) => request.nextUrl.pathname.startsWith(prefix)
  );

  // Se não está autenticado e tenta acessar rota protegida
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Se está autenticado e tenta acessar login/cadastro, redireciona para dashboard do role
  if (user && ["/", "/cadastro"].includes(request.nextUrl.pathname)) {
    // Buscar role do usuário para redirecionar para o dashboard correto
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const url = request.nextUrl.clone();

    // Redirecionar baseado no role
    if (profile?.role === "admin") {
      url.pathname = "/admin/dashboard";
    } else if (profile?.role === "barbeiro") {
      url.pathname = "/profissional/dashboard";
    } else {
      url.pathname = "/dashboard";
    }

    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

```
