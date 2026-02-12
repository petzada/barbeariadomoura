import { Instagram, Phone } from "lucide-react";
import { getWhatsAppLink } from "@/lib/utils";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511960234545";

export function Footer() {
  return (
    <footer className="border-t border-black bg-[#013648]">
      <div className="container-app py-6 md:py-8">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div className="flex items-center gap-4 md:justify-start justify-center">
            <a
              href="https://instagram.com/barbeariadomoura"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#EAD8AC] transition-opacity hover:opacity-80"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={getWhatsAppLink(WHATSAPP_NUMBER)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#EAD8AC] transition-opacity hover:opacity-80"
              aria-label="WhatsApp"
            >
              <Phone className="h-5 w-5" />
            </a>
          </div>

          <p className="text-sm text-[#EAD8AC] text-center">
            &copy; {new Date().getFullYear()} Barbearia do Moura
          </p>

          <div className="hidden md:block" />
        </div>
      </div>
    </footer>
  );
}

