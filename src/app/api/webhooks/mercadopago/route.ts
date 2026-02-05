import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getPayment, getSubscriptionInfo, verifyWebhookSignature } from "@/lib/mercadopago/client";

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

    console.log("Webhook Mercado Pago recebido:", {
      type: body.type,
      action: body.action,
      data: body.data,
    });

    // Verificar assinatura (em produção)
    if (!verifyWebhookSignature(xSignature, xRequestId, body.data?.id)) {
      console.error("Assinatura de webhook inválida");
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
      
      console.log("Detalhes do pagamento:", {
        id: payment.id,
        status: payment.status,
        external_reference: payment.external_reference,
        transaction_amount: payment.transaction_amount,
      });

      // external_reference deve ser o ID do agendamento ou assinatura
      const externalRef = payment.external_reference;
      
      if (externalRef?.startsWith("appointment_")) {
        // Pagamento de agendamento individual
        const appointmentId = externalRef.replace("appointment_", "");
        
        const paymentStatus =
          payment.status === "approved"
            ? "pago"
            : payment.status === "pending"
            ? "pendente"
            : "cancelado";

        // Atualizar status do agendamento
        await supabase
          .from("appointments")
          .update({
            payment_status: paymentStatus,
            payment_method: "mercado_pago",
          })
          .eq("id", appointmentId);

        // Registrar pagamento
        await supabase.from("payments").insert({
          appointment_id: appointmentId,
          valor: payment.transaction_amount,
          metodo: "mercado_pago",
          status: paymentStatus,
          mercadopago_payment_id: payment.id.toString(),
        });

        console.log(`Agendamento ${appointmentId} atualizado: ${paymentStatus}`);
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

      console.log("Detalhes da assinatura:", {
        id: subscription.id,
        status: subscription.status,
        external_reference: subscription.external_reference,
      });

      const externalRef = subscription.external_reference;

      // external_reference deve ser subscription_{user_id}_{plan_id}
      if (externalRef?.startsWith("subscription_")) {
        const parts = externalRef.replace("subscription_", "").split("_");
        const userId = parts[0];
        const planId = parts[1];

        // Mapear status do Mercado Pago para nosso sistema
        let subscriptionStatus: "ativa" | "pausada" | "cancelada" | "pendente";
        switch (subscription.status) {
          case "authorized":
          case "active":
            subscriptionStatus = "ativa";
            break;
          case "paused":
            subscriptionStatus = "pausada";
            break;
          case "cancelled":
          case "canceled":
            subscriptionStatus = "cancelada";
            break;
          default:
            subscriptionStatus = "pendente";
        }

        // Buscar assinatura existente
        const { data: existingSubscription } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("cliente_id", userId)
          .eq("plano_id", planId)
          .single();

        if (existingSubscription) {
          // Atualizar assinatura existente
          await supabase
            .from("subscriptions")
            .update({
              status: subscriptionStatus,
              mercadopago_subscription_id: subscription.id,
            })
            .eq("id", existingSubscription.id);

          console.log(`Assinatura ${existingSubscription.id} atualizada: ${subscriptionStatus}`);
        } else if (subscriptionStatus === "ativa") {
          // Criar nova assinatura
          const { data: plan } = await supabase
            .from("subscription_plans")
            .select("duracao_dias")
            .eq("id", planId)
            .single();

          const dataInicio = new Date();
          const dataFim = new Date();
          dataFim.setDate(dataFim.getDate() + (plan?.duracao_dias || 30));

          await supabase.from("subscriptions").insert({
            cliente_id: userId,
            plano_id: planId,
            status: "ativa",
            data_inicio: dataInicio.toISOString(),
            data_fim: dataFim.toISOString(),
            mercadopago_subscription_id: subscription.id,
          });

          console.log(`Nova assinatura criada para usuário ${userId}`);
        }
      }

      return NextResponse.json({ success: true });
    }

    // Tipo de notificação não reconhecido
    console.log("Tipo de notificação não processado:", body.type);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro no webhook Mercado Pago:", error);
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
