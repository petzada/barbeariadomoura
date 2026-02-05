import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header simples */}
      <header className="p-4 border-b border-border">
        <div className="container-app">
          <Link href="/" className="text-xl font-bold text-gradient-gold">
            Barbearia do Moura
          </Link>
        </div>
      </header>

      {/* Conteúdo centralizado */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer simples */}
      <footer className="p-4 text-center text-sm text-muted-foreground border-t border-border">
        <p>&copy; {new Date().getFullYear()} Barbearia do Moura. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
