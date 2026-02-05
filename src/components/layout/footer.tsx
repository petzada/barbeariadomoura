import Link from "next/link";
import { getWhatsAppLink } from "@/lib/utils";
import { Instagram, Phone, MapPin, Clock } from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511960234545";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-bold text-gradient-gold">
              Barbearia do Moura
            </Link>
            <p className="mt-4 text-muted-foreground max-w-md">
              Sua barbearia de confiança em Mauá-SP. Oferecemos cortes modernos,
              barba tradicional e tratamentos capilares com profissionais
              experientes.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com/barbeariadomoura"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={getWhatsAppLink(WHATSAPP_NUMBER)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links rápidos */}
          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/agendar"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Agendar Horário
                </Link>
              </li>
              <li>
                <Link
                  href="/clube"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clube do Moura
                </Link>
              </li>
              <li>
                <Link
                  href="/#servicos"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Nossos Serviços
                </Link>
              </li>
              <li>
                <Link
                  href="/#profissionais"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Profissionais
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>
                  Rua Exemplo, 123
                  <br />
                  Centro, Mauá-SP
                </span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a
                  href={getWhatsAppLink(WHATSAPP_NUMBER)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  (11) 96023-4545
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <Clock className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>
                  Ter a Sex: 09h - 20h
                  <br />
                  Sáb: 09h - 18h
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Barbearia do Moura. Todos os
            direitos reservados.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/termos" className="hover:text-foreground transition-colors">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="hover:text-foreground transition-colors">
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
