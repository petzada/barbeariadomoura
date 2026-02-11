import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#013648] text-[#EAD8AC]">
      <header className="p-4 border-b border-black">
        <div className="container-app flex justify-center">
          <Link href="/" className="group flex items-center justify-center">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full border-2 border-black group-hover:border-[#EAD8AC] transition-colors">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Barbearia do Moura"
                className="h-full w-full object-cover"
              />
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="p-4 text-center text-sm text-[#EAD8AC] border-t border-black">
        <p>&copy; {new Date().getFullYear()} Barbearia do Moura. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
