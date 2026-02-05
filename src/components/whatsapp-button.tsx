"use client";

import { Button } from "@/components/ui/button";
import { getWhatsAppLink } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  message?: string;
  phone?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

/**
 * Botão de WhatsApp que abre uma conversa com a mensagem pré-definida
 */
export function WhatsAppButton({
  message = "Olá! Gostaria de mais informações sobre a Barbearia do Moura.",
  phone,
  variant = "default",
  size = "default",
  className,
  children,
  showIcon = true,
}: WhatsAppButtonProps) {
  const whatsappNumber = phone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  const handleClick = () => {
    const link = getWhatsAppLink(whatsappNumber, message);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
    >
      {showIcon && <MessageCircle className="h-4 w-4 mr-2" />}
      {children || "Falar no WhatsApp"}
    </Button>
  );
}

/**
 * Botão flutuante de WhatsApp para exibir no canto da tela
 */
export function WhatsAppFloatingButton({
  message = "Olá! Gostaria de mais informações sobre a Barbearia do Moura.",
  phone,
}: {
  message?: string;
  phone?: string;
}) {
  const whatsappNumber = phone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  const handleClick = () => {
    const link = getWhatsAppLink(whatsappNumber, message);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </button>
  );
}

/**
 * Gera mensagem de confirmação de agendamento para WhatsApp
 */
export function getAppointmentWhatsAppMessage(appointment: {
  clienteName: string;
  serviceName: string;
  professionalName: string;
  date: string;
  time: string;
  value: number;
}): string {
  return `🎉 *Agendamento Confirmado!*

Olá ${appointment.clienteName}!

Seu agendamento na *Barbearia do Moura* foi confirmado:

📋 *Serviço:* ${appointment.serviceName}
✂️ *Profissional:* ${appointment.professionalName}
📅 *Data:* ${appointment.date}
🕐 *Horário:* ${appointment.time}
💰 *Valor:* R$ ${appointment.value.toFixed(2).replace(".", ",")}

⚠️ *Importante:* Cancelamentos devem ser feitos com no mínimo 4 horas de antecedência.

Aguardamos você! 💈`;
}

/**
 * Gera mensagem de lembrete de agendamento para WhatsApp
 */
export function getReminderWhatsAppMessage(appointment: {
  clienteName: string;
  serviceName: string;
  date: string;
  time: string;
}): string {
  return `⏰ *Lembrete de Agendamento*

Olá ${appointment.clienteName}!

Lembramos que você tem um agendamento na *Barbearia do Moura*:

📋 *Serviço:* ${appointment.serviceName}
📅 *Data:* ${appointment.date}
🕐 *Horário:* ${appointment.time}

Precisando reagendar? Entre em contato conosco!

Até logo! 💈`;
}
