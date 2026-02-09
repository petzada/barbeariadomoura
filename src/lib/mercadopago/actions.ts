"use server";

import { createClient } from "@/lib/supabase/server";
import {
  createSubscription,
  createPaymentPreference,
  cancelSubscription,
} from "./client";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Cria uma assinatura no Mercado Pago e retorna o link de pagamento
 */
export async function createSubscriptionAction(planId: string) {
  const supabase = await createClient();

  // Verificar autenticação
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Você precisa estar logado para assinar um plano" };
  }

  // Buscar dados do usuário
  const { data: profile } = await supabase
    .from("users")
    .select("nome, email")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return { error: "Perfil não encontrado" };
  }

  // Buscar dados do plano
  const { data: plan } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("id", planId)
    .single();

  if (!plan) {
    return { error: "Plano não encontrado" };
  }

  // Verificar se já possui assinatura ativa
  const { data: existingSubscription } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("cliente_id", user.id)
    .eq("status", "ativa")
    .single();

  if (existingSubscription) {
    return { error: "Você já possui uma assinatura ativa" };
  }

  try {
    // Criar assinatura no Mercado Pago
    const subscription = await createSubscription({
      reason: `Barbearia do Moura - ${plan.nome}`,
      external_reference: `subscription_${user.id}_${planId}`,
      payer_email: profile.email || user.email!,
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: plan.preco_mensal,
        currency_id: "BRL",
      },
      back_url: `${APP_URL}/clube?subscription=pending`,
    });

    // Criar registro de assinatura pendente no banco
    await supabase.from("subscriptions").insert({
      cliente_id: user.id,
      plano_id: planId,
      status: "suspensa",
      data_inicio: new Date().toISOString().split("T")[0],
      proxima_cobranca: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      mp_subscription_id: subscription.id,
    });

    return {
      success: true,
      checkoutUrl: subscription.init_point,
    };
  } catch (error) {
    console.error("Erro ao criar assinatura:", error);
    return { error: "Erro ao processar assinatura. Tente novamente." };
  }
}

/**
 * Cancela a assinatura ativa do usuário
 */
export async function cancelSubscriptionAction() {
  const supabase = await createClient();

  // Verificar autenticação
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Você precisa estar logado" };
  }

  // Buscar assinatura ativa
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("cliente_id", user.id)
    .eq("status", "ativa")
    .single();

  if (!subscription) {
    return { error: "Nenhuma assinatura ativa encontrada" };
  }

  try {
    // Cancelar no Mercado Pago se tiver ID
    if (subscription.mp_subscription_id) {
      await cancelSubscription(subscription.mp_subscription_id);
    }

    // Atualizar status no banco
    await supabase
      .from("subscriptions")
      .update({
        status: "cancelada",
        data_cancelamento: new Date().toISOString(),
      })
      .eq("id", subscription.id);

    return { success: true };
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error);
    return { error: "Erro ao cancelar assinatura. Tente novamente." };
  }
}

/**
 * Cria um link de pagamento para um agendamento
 */
export async function createAppointmentPaymentAction(
  appointmentId: string,
  amount: number,
  serviceName: string
) {
  const supabase = await createClient();

  // Verificar autenticação
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Você precisa estar logado" };
  }

  // Buscar dados do usuário
  const { data: profile } = await supabase
    .from("users")
    .select("nome, email")
    .eq("id", user.id)
    .single();

  try {
    const preference = await createPaymentPreference({
      items: [
        {
          title: `Barbearia do Moura - ${serviceName}`,
          quantity: 1,
          unit_price: amount,
        },
      ],
      payer: {
        email: profile?.email || user.email,
        name: profile?.nome,
      },
      external_reference: `appointment_${appointmentId}`,
      back_urls: {
        success: `${APP_URL}/meus-agendamentos?payment=success`,
        failure: `${APP_URL}/meus-agendamentos?payment=failure`,
        pending: `${APP_URL}/meus-agendamentos?payment=pending`,
      },
    });

    return {
      success: true,
      checkoutUrl: preference.init_point,
    };
  } catch (error) {
    console.error("Erro ao criar preferência de pagamento:", error);
    return { error: "Erro ao processar pagamento. Tente novamente." };
  }
}
