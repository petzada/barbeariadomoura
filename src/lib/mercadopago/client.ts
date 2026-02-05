/**
 * Cliente Mercado Pago
 * Configuração e utilitários para integração com a API do Mercado Pago
 */

const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN!;
const MERCADO_PAGO_PUBLIC_KEY = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export interface PreferenceItem {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
}

export interface CreatePreferenceData {
  items: PreferenceItem[];
  payer?: {
    email?: string;
    name?: string;
  };
  external_reference?: string;
  notification_url?: string;
  back_urls?: {
    success?: string;
    failure?: string;
    pending?: string;
  };
  auto_return?: "approved" | "all";
}

export interface PreferenceResponse {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

export interface SubscriptionPreapprovalData {
  reason: string;
  external_reference: string;
  payer_email: string;
  auto_recurring: {
    frequency: number;
    frequency_type: "months" | "days";
    transaction_amount: number;
    currency_id: string;
  };
  back_url: string;
  status?: "pending" | "authorized";
}

export interface SubscriptionResponse {
  id: string;
  init_point: string;
  status: string;
}

/**
 * Cria uma preferência de pagamento único no Mercado Pago
 */
export async function createPaymentPreference(
  data: CreatePreferenceData
): Promise<PreferenceResponse> {
  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      ...data,
      items: data.items.map((item) => ({
        ...item,
        currency_id: item.currency_id || "BRL",
      })),
      notification_url: data.notification_url || `${APP_URL}/api/webhooks/mercadopago`,
      back_urls: data.back_urls || {
        success: `${APP_URL}/pagamento/sucesso`,
        failure: `${APP_URL}/pagamento/erro`,
        pending: `${APP_URL}/pagamento/pendente`,
      },
      auto_return: data.auto_return || "approved",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Erro ao criar preferência:", error);
    throw new Error("Falha ao criar preferência de pagamento");
  }

  return response.json();
}

/**
 * Cria uma assinatura recorrente no Mercado Pago
 */
export async function createSubscription(
  data: SubscriptionPreapprovalData
): Promise<SubscriptionResponse> {
  const response = await fetch("https://api.mercadopago.com/preapproval", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      ...data,
      back_url: data.back_url || `${APP_URL}/clube`,
      status: data.status || "pending",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Erro ao criar assinatura:", error);
    throw new Error("Falha ao criar assinatura");
  }

  return response.json();
}

/**
 * Cancela uma assinatura no Mercado Pago
 */
export async function cancelSubscription(subscriptionId: string): Promise<void> {
  const response = await fetch(
    `https://api.mercadopago.com/preapproval/${subscriptionId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        status: "cancelled",
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("Erro ao cancelar assinatura:", error);
    throw new Error("Falha ao cancelar assinatura");
  }
}

/**
 * Busca informações de um pagamento
 */
export async function getPayment(paymentId: string) {
  const response = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("Erro ao buscar pagamento:", error);
    throw new Error("Falha ao buscar pagamento");
  }

  return response.json();
}

/**
 * Busca informações de uma assinatura
 */
export async function getSubscriptionInfo(subscriptionId: string) {
  const response = await fetch(
    `https://api.mercadopago.com/preapproval/${subscriptionId}`,
    {
      headers: {
        Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("Erro ao buscar assinatura:", error);
    throw new Error("Falha ao buscar assinatura");
  }

  return response.json();
}

/**
 * Verifica assinatura de webhook
 */
export function verifyWebhookSignature(
  xSignature: string,
  xRequestId: string,
  dataId: string
): boolean {
  // Em produção, você deve implementar a verificação HMAC
  // usando o segredo do webhook configurado no Mercado Pago
  // Documentação: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
  
  // Por enquanto, retornamos true para ambiente de desenvolvimento
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  
  // TODO: Implementar verificação HMAC em produção
  return true;
}

export { MERCADO_PAGO_PUBLIC_KEY };
