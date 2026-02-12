import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getWhatsAppLink } from "@/lib/utils";
import { Container } from "./primitives";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511960234545";

const MAPS_LINK = "https://maps.app.goo.gl/c8QLxPKBgaAbkACV6";
const MAPS_EMBED_SRC =
  "https://www.google.com/maps?q=Barbearia+do+Moura,+Av.+Queiroz+Pedroso,+433,+Maua,+SP&output=embed";

export function MapSection() {
  return (
    <section id="contato" className="relative section-landing bg-[#012A3A]">
      <div className="relative h-[420px] md:h-[540px] w-full overflow-hidden">
        <iframe
          title="Mapa da Barbearia do Moura"
          src={MAPS_EMBED_SRC}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full border-0"
        />
        <div className="absolute inset-0 bg-[#011E2D]/35" />

        <Container className="absolute inset-0 flex items-end pb-6 sm:pb-8 pointer-events-none">
          <Card
            variant="highlighted"
            className="pointer-events-auto max-w-sm w-full"
          >
            <CardContent className="p-5 space-y-4">
              <h3 className="font-bold text-lg text-[#EAD8AC]">
                Barbearia do Moura
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2 text-[#EAD8AC]/80">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#EAD8AC]" />
                  <span>
                    Av. Queiroz Pedroso, 433
                    <br />
                    Jardim Pedroso, Maua-SP
                  </span>
                </li>
                <li className="flex items-center gap-2 text-[#EAD8AC]/80">
                  <Phone className="h-4 w-4 flex-shrink-0 text-[#EAD8AC]" />
                  <a
                    href={getWhatsAppLink(WHATSAPP_NUMBER)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#EAD8AC] transition-colors"
                  >
                    (11) 96023-4545
                  </a>
                </li>
                <li className="flex items-center gap-2 text-[#EAD8AC]/80">
                  <Mail className="h-4 w-4 flex-shrink-0 text-[#EAD8AC]" />
                  <span>contato@barbeariadomoura.com.br</span>
                </li>
                <li className="flex items-start gap-2 text-[#EAD8AC]/80">
                  <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#EAD8AC]" />
                  <span>
                    Ter a Sex: 09h - 19h
                    <br />
                    Sab: 09h - 18h
                  </span>
                </li>
              </ul>

              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[#EAD8AC] hover:opacity-90"
              >
                Abrir no Google Maps
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </CardContent>
          </Card>
        </Container>
      </div>
    </section>
  );
}
