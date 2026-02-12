import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getWhatsAppLink } from "@/lib/utils";
import { Container } from "./primitives";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511960234545";

export function MapSection() {
  return (
    <section id="contato" className="relative section-landing bg-[#012A3A]">
      {/* Map placeholder */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#013648] via-[#012A3A] to-[#011E2D]" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(234,216,172,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(234,216,172,0.06)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <MapPin className="h-10 w-10 text-[#EAD8AC]/40 mx-auto" />
            <p className="text-sm text-[#EAD8AC]/40">
              Mapa interativo (Google Maps)
            </p>
          </div>
        </div>

        {/* Info card overlay */}
        <Container className="absolute inset-0 flex items-end pb-8 pointer-events-none">
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
                    Av. Queiróz Pedroso, 433
                    <br />
                    Jardim Pedroso, Mauá-SP
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
            </CardContent>
          </Card>
        </Container>
      </div>
    </section>
  );
}
