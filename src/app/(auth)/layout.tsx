import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#013648] text-[#EAD8AC]">
      {/* Header simples */}
      <header className="p-4 border-b border-black">
        <div className="container-app">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Barbearia do Moura"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-xl font-bold text-gradient-gold">
              Barbearia do Moura
            </span>
          </Link>
        </div>
      </header>

      {/* Conteúdo centralizado */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer simples */}
      <footer className="p-4 text-center text-sm text-[#EAD8AC] border-t border-black">
        <p>&copy; {new Date().getFullYear()} Barbearia do Moura. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

