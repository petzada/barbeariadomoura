import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getPayment, getSubscriptionInfo, verifyWebhookSignature } from "@/lib/mercadopago/client";

const mapPaymentStatus = (status: string) => {
  if (status === "approved") return "pago";
  if (status === "pending" || status === "in_process") return "pendente";
  return "cancelado";
};

const mapPaymentMethod = (methodId?: string) => {
  if (methodId === "pix") return "pix";
  if (methodId === "debit_card") return "cartao_debito";
  if (methodId === "credit_card") return "cartao_credito";
  return "dinheiro";
};

/**
 * Webhook do Mercado Pago
 * Recebe notificações de pagamentos e assinaturas
 *
 * Tipos de notificação:
 * - payment: Atualização de status de pagamento
 * - preapproval: Atualização de assinatura recorrente
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const xSignature = request.headers.get("x-signature") || "";
    const xRequestId = request.headers.get("x-request-id") || "";

    // Verificar assinatura (em produção)
    if (!verifyWebhookSignature(xSignature, xRequestId, body.data?.id)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Processar notificação de pagamento
    if (body.type === "payment") {
      const paymentId = body.data?.id;

      if (!paymentId) {
        return NextResponse.json({ error: "Payment ID missing" }, { status: 400 });
      }

      // Buscar detalhes do pagamento
      const payment = await getPayment(paymentId);

      // external_reference deve ser o ID do agendamento ou assinatura
      const externalRef = payment.external_reference;

      if (externalRef?.startsWith("appointment_")) {
        // Pagamento de agendamento individual
        const appointmentId = externalRef.replace("appointment_", "");
        if (!appointmentId) {
          return NextResponse.json({ error: "Invalid appointment reference" }, { status: 400 });
        }

        const paymentStatus = mapPaymentStatus(payment.status);
        const paymentMethod = mapPaymentMethod(payment.payment_method_id);

        // Atualizar status do agendamento
        await supabase
          .from("appointments")
          .update({
            payment_status: paymentStatus,
            payment_method: paymentMethod,
          })
          .eq("id", appointmentId);

        // Registrar pagamento
        await supabase.from("payments").insert({
          agendamento_id: appointmentId,
          valor: payment.transaction_amount,
          metodo: paymentMethod,
          status: paymentStatus,
          mp_payment_id: String(payment.id ?? ""),
        });
      }

      if (externalRef?.startsWith("subscription_")) {
        const parts = externalRef.split("_");
        if (parts.length < 3) {
          return NextResponse.json({ error: "Invalid subscription reference" }, { status: 400 });
        }

        const paymentStatus = mapPaymentStatus(payment.status);
        const userId = parts[1];
        const planId = parts[2];

        if (!userId || !planId) {
          return NextResponse.json({ error: "Invalid subscription reference" }, { status: 400 });
        }

        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("cliente_id", userId)
          .eq("plano_id", planId)
          .neq("status", "cancelada")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (subscription?.id) {
          const { data: existingPayment } = await supabase
            .from("payments")
            .select("id")
            .eq("mp_payment_id", String(payment.id ?? ""))
            .maybeSingle();

          const paymentPayload = {
            assinatura_id: subscription.id,
            valor: payment.transaction_amount,
            metodo: "assinatura" as const,
            status: paymentStatus,
            mp_payment_id: String(payment.id ?? ""),
          };

          if (existingPayment?.id) {
            await supabase.from("payments").update(paymentPayload).eq("id", existingPayment.id);
          } else {
            await supabase.from("payments").insert(paymentPayload);
          }
        }
      }

      return NextResponse.json({ success: true });
    }

    // Processar notificação de assinatura (preapproval)
    if (body.type === "preapproval" || body.type === "subscription_preapproval") {
      const preapprovalId = body.data?.id;

      if (!preapprovalId) {
        return NextResponse.json({ error: "Preapproval ID missing" }, { status: 400 });
      }

      // Buscar detalhes da assinatura
      const subscription = await getSubscriptionInfo(preapprovalId);

      const externalRef = subscription.external_reference;

      // external_reference deve ser subscription_{user_id}_{plan_id}
      if (externalRef?.startsWith("subscription_")) {
        const parts = externalRef.replace("subscription_", "").split("_");
        const userId = parts[0];
        const planId = parts[1];

        if (!userId || !planId) {
          return NextResponse.json({ error: "Invalid subscription reference" }, { status: 400 });
        }

        // Mapear status do Mercado Pago para nosso sistema
        let subscriptionStatus: "ativa" | "cancelada" | "suspensa" | "expirada";
        switch (subscription.status) {
          case "authorized":
          case "active":
            subscriptionStatus = "ativa";
            break;
          case "paused":
            subscriptionStatus = "suspensa";
            break;
          case "cancelled":
          case "canceled":
            subscriptionStatus = "cancelada";
            break;
          default:
            subscriptionStatus = "suspensa";
        }

        // Buscar assinatura existente
        const { data: existingSubscription } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("cliente_id", userId)
          .eq("plano_id", planId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (existingSubscription) {
          // Atualizar assinatura existente
          await supabase
            .from("subscriptions")
            .update({
              status: subscriptionStatus,
              mp_subscription_id: subscription.id,
              data_cancelamento:
                subscriptionStatus === "cancelada" ? new Date().toISOString() : null,
            })
            .eq("id", existingSubscription.id);
        } else if (subscriptionStatus === "ativa") {
          // Criar nova assinatura
          const dataInicio = new Date();
          const proximaCobranca = new Date();
          proximaCobranca.setDate(proximaCobranca.getDate() + 30);

          await supabase.from("subscriptions").insert({
            cliente_id: userId,
            plano_id: planId,
            status: "ativa",
            data_inicio: dataInicio.toISOString().split("T")[0],
            proxima_cobranca: proximaCobranca.toISOString().split("T")[0],
            mp_subscription_id: subscription.id,
          });
        }
      }

      return NextResponse.json({ success: true });
    }

    // Tipo de notificação não reconhecido
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET para verificação de URL pelo Mercado Pago
export async function GET() {
  return NextResponse.json({ status: "Webhook ativo" });
}
