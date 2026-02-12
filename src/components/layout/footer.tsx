import Link from "next/link";
import { getWhatsAppLink } from "@/lib/utils";
import { Clock, Instagram, MapPin, Phone } from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511960234545";

export function Footer() {
  return (
    <footer className="border-t border-black bg-[#013648]">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-bold text-gradient-gold">
              Barbearia do Moura
            </Link>
            <p className="mt-4 text-[#EAD8AC] max-w-md">
              Sua barbearia de confianca em Maua-SP com cortes modernos, barba tradicional e atendimento consistente.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com/barbeariadomoura"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#EAD8AC] hover:text-[#EAD8AC] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={getWhatsAppLink(WHATSAPP_NUMBER)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#EAD8AC] hover:text-[#EAD8AC] transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Links rapidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cadastro" className="text-[#EAD8AC] hover:text-[#EAD8AC] transition-colors">
                  Criar conta para agendar
                </Link>
              </li>
              <li>
                <Link href="/sobre/clube" className="text-[#EAD8AC] hover:text-[#EAD8AC] transition-colors">
                  Clube do Moura
                </Link>
              </li>
              <li>
                <Link href="/sobre/servicos" className="text-[#EAD8AC] hover:text-[#EAD8AC] transition-colors">
                  Nossos servicos
                </Link>
              </li>
              <li>
                <Link href="/sobre/profissionais" className="text-[#EAD8AC] hover:text-[#EAD8AC] transition-colors">
                  Profissionais
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-[#EAD8AC]">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>
                  Rua Exemplo, 123
                  <br />
                  Centro, Maua-SP
                </span>
              </li>
              <li className="flex items-center gap-2 text-[#EAD8AC]">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a
                  href={getWhatsAppLink(WHATSAPP_NUMBER)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#EAD8AC] transition-colors"
                >
                  (11) 96023-4545
                </a>
              </li>
              <li className="flex items-start gap-2 text-[#EAD8AC]">
                <Clock className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>
                  Ter a Sex: 09h - 20h
                  <br />
                  Sab: 09h - 18h
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-black flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#EAD8AC]">
            &copy; {new Date().getFullYear()} Barbearia do Moura. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-sm text-[#EAD8AC]">
            <Link href="/termos" className="hover:text-[#EAD8AC] transition-colors">
              Termos de uso
            </Link>
            <Link href="/privacidade" className="hover:text-[#EAD8AC] transition-colors">
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
