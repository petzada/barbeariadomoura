"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { CalculoAgendamento, CancelamentoValidation } from "@/types";
import { addMinutes, format, parseISO, isBefore, subHours } from "date-fns";
import { toZonedTime, fromZonedTime, formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";

// Timezone do Brasil (GMT-3)
const TIMEZONE = "America/Sao_Paulo";

// ============================================
// BUSCAR SERVIÇOS ATIVOS
// ============================================
export async function getActiveServices() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("ativo", true)
    .order("nome");

  if (error) throw error;
  return data;
}

// ============================================
// BUSCAR PROFISSIONAIS ATIVOS
// ============================================
export async function getActiveProfessionals() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("professionals")
    .select(`
      *,
      user:users(nome, avatar_url)
    `)
    .eq("ativo", true);

  if (error) throw error;
  return data;
}

// ============================================
// BUSCAR ASSINATURA ATIVA DO CLIENTE
// ============================================
export async function getActiveSubscription(clienteId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select(`
      *,
      plano:subscription_plans(*)
    `)
    .eq("cliente_id", clienteId)
    .eq("status", "ativa")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

// ============================================
// CALCULAR VALOR DO AGENDAMENTO (REGRA CRÍTICA)
// ============================================
export async function calcularValorAgendamento(
  clienteId: string,
  servicoId: string,
  dataHora: string
): Promise<CalculoAgendamento> {
  const supabase = await createClient();

  // 1. Buscar serviço
  const { data: servico, error: servicoError } = await supabase
    .from("services")
    .select("*")
    .eq("id", servicoId)
    .single();

  if (servicoError || !servico) {
    throw new Error("Serviço não encontrado");
  }

  // 2. Buscar assinatura ativa do cliente
  const assinatura = await getActiveSubscription(clienteId);

  // 3. Se não tem assinatura, cobra valor cheio
  if (!assinatura) {
    return {
      valorServico: servico.preco,
      valorCobrado: servico.preco,
      cobertoAssinatura: false,
      assinaturaId: null,
      avisoPlanoLimitado: null,
    };
  }

  // 4. Verificar se serviço está incluso no plano
  const plano = assinatura.plano;
  if (!plano) {
    return {
      valorServico: servico.preco,
      valorCobrado: servico.preco,
      cobertoAssinatura: false,
      assinaturaId: assinatura.id,
      avisoPlanoLimitado: null,
    };
  }
  const servicoIncluso = plano.servicos_inclusos?.includes(servicoId) ?? false;

  if (!servicoIncluso) {
    return {
      valorServico: servico.preco,
      valorCobrado: servico.preco,
      cobertoAssinatura: false,
      assinaturaId: assinatura.id,
      avisoPlanoLimitado: null,
    };
  }

  // 5. Verificar restrição de dia
  const dataAgendamento = parseISO(dataHora);
  const diaSemana = dataAgendamento.getDay(); // 0=Dom, 1=Seg, ..., 6=Sab

  if (plano.dias_permitidos !== null) {
    const diaPermitido = plano.dias_permitidos.includes(diaSemana);

    if (!diaPermitido) {
      // Mapear dias para português
      const diasNomes: Record<number, string> = {
        0: "domingo",
        1: "segunda",
        2: "terça",
        3: "quarta",
        4: "quinta",
        5: "sexta",
        6: "sábado",
      };
      const diasPermitidosNomes = plano.dias_permitidos
        .map((d: number) => diasNomes[d])
        .join(", ");

      return {
        valorServico: servico.preco,
        valorCobrado: servico.preco,
        cobertoAssinatura: false,
        assinaturaId: assinatura.id,
        avisoPlanoLimitado: `Seu plano "${plano.nome}" permite agendamentos apenas às ${diasPermitidosNomes}. Nesta data, será cobrado o valor normal.`,
      };
    }
  }

  // 6. Serviço coberto pelo plano
  return {
    valorServico: servico.preco,
    valorCobrado: 0,
    cobertoAssinatura: true,
    assinaturaId: assinatura.id,
    avisoPlanoLimitado: null,
  };
}

// ============================================
// BUSCAR HORÁRIOS DISPONÍVEIS
// ============================================
export async function buscarHorariosDisponiveis(
  profissionalId: string,
  data: string, // YYYY-MM-DD
  duracaoMinutos: number
): Promise<string[]> {
  const supabase = await createClient();

  // Parse da data
  const dataObj = parseISO(data);
  const diaSemana = dataObj.getDay();

  // Buscar horário de funcionamento da barbearia
  const { data: businessHour } = await supabase
    .from("business_hours")
    .select("*")
    .eq("dia_semana", diaSemana)
    .eq("ativo", true)
    .maybeSingle();

  if (!businessHour) {
    return []; // Barbearia fechada neste dia
  }

  // Buscar horário do profissional
  const { data: profHour } = await supabase
    .from("professional_hours")
    .select("*")
    .eq("profissional_id", profissionalId)
    .eq("dia_semana", diaSemana)
    .eq("ativo", true)
    .maybeSingle();

  // Usar horário do profissional ou da barbearia
  const abertura = profHour?.abertura || businessHour.abertura;
  const fechamento = profHour?.fechamento || businessHour.fechamento;

  // Buscar agendamentos existentes do profissional neste dia
  const dataInicio = `${data}T00:00:00`;
  const dataFim = `${data}T23:59:59`;

  const { data: agendamentos } = await supabase
    .from("appointments")
    .select("data_hora_inicio, data_hora_fim")
    .eq("profissional_id", profissionalId)
    .gte("data_hora_inicio", dataInicio)
    .lte("data_hora_inicio", dataFim)
    .not("status", "in", '("cancelado","nao_compareceu")');

  // Buscar bloqueios
  const { data: bloqueios } = await supabase
    .from("blocked_slots")
    .select("data_inicio, data_fim")
    .or(`profissional_id.eq.${profissionalId},profissional_id.is.null`)
    .gte("data_fim", dataInicio)
    .lte("data_inicio", dataFim);

  // Gerar todos os slots de 30 em 30 minutos
  const slots: string[] = [];
  const [aberturaHora, aberturaMin] = abertura.split(":").map(Number);
  const [fechamentoHora, fechamentoMin] = fechamento.split(":").map(Number);

  // Criar datas no timezone do Brasil
  // Usando fromZonedTime para converter horário local do Brasil para UTC
  const aberturaDate = fromZonedTime(
    new Date(`${data}T${String(aberturaHora).padStart(2, '0')}:${String(aberturaMin).padStart(2, '0')}:00`),
    TIMEZONE
  );

  const fechamentoDate = fromZonedTime(
    new Date(`${data}T${String(fechamentoHora).padStart(2, '0')}:${String(fechamentoMin).padStart(2, '0')}:00`),
    TIMEZONE
  );

  // Tempo mínimo de antecedência (1 hora) - considerando timezone Brasil
  const agoraUTC = new Date();
  const agoraBrasil = toZonedTime(agoraUTC, TIMEZONE);
  const minimoAntecedencia = addMinutes(agoraUTC, 60);

  let currentSlot = new Date(aberturaDate);

  while (currentSlot < fechamentoDate) {
    const slotFim = addMinutes(currentSlot, duracaoMinutos);

    // Verificar se o slot termina antes do fechamento
    if (slotFim > fechamentoDate) {
      break;
    }

    // Verificar se é no futuro (com 1h de antecedência mínima)
    if (currentSlot > minimoAntecedencia) {
      // Verificar conflito com agendamentos existentes
      const temConflito = agendamentos?.some((ag) => {
        const agInicio = new Date(ag.data_hora_inicio);
        const agFim = new Date(ag.data_hora_fim);
        return (
          (currentSlot >= agInicio && currentSlot < agFim) ||
          (slotFim > agInicio && slotFim <= agFim) ||
          (currentSlot <= agInicio && slotFim >= agFim)
        );
      });

      // Verificar conflito com bloqueios
      const temBloqueio = bloqueios?.some((bl) => {
        const blInicio = new Date(bl.data_inicio);
        const blFim = new Date(bl.data_fim);
        return (
          (currentSlot >= blInicio && currentSlot < blFim) ||
          (slotFim > blInicio && slotFim <= blFim) ||
          (currentSlot <= blInicio && slotFim >= blFim)
        );
      });

      if (!temConflito && !temBloqueio) {
        // Formatar no timezone do Brasil
        slots.push(formatInTimeZone(currentSlot, TIMEZONE, "HH:mm"));
      }
    }

    // Avançar 30 minutos
    currentSlot = addMinutes(currentSlot, 30);
  }

  return slots;
}

// ============================================
// CRIAR AGENDAMENTO
// ============================================
export async function criarAgendamento(formData: {
  servicoId: string;
  profissionalId: string;
  data: string;
  horario: string;
}): Promise<{ success: boolean; message: string; agendamentoId?: string }> {
  const supabase = await createClient();

  // Verificar autenticação
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Você precisa estar logado para agendar" };
  }

  const { servicoId, profissionalId, data, horario } = formData;

  try {
    // Buscar duração do serviço
    const { data: servico } = await supabase
      .from("services")
      .select("duracao_minutos, preco")
      .eq("id", servicoId)
      .maybeSingle();

    if (!servico) {
      return { success: false, message: "Serviço não encontrado" };
    }

    // Montar data/hora com timezone do Brasil (GMT-3)
    // Converte o horário local do Brasil para UTC para salvar no banco
    const inicioLocal = fromZonedTime(
      new Date(`${data}T${horario}:00`),
      TIMEZONE
    );
    const fimLocal = addMinutes(inicioLocal, servico.duracao_minutos);

    const dataHoraInicio = inicioLocal.toISOString();
    const dataHoraFim = fimLocal.toISOString();

    // Verificar se horário ainda está disponível
    const horariosDisponiveis = await buscarHorariosDisponiveis(
      profissionalId,
      data,
      servico.duracao_minutos
    );

    if (!horariosDisponiveis.includes(horario)) {
      return {
        success: false,
        message: "Este horário não está mais disponível. Por favor, selecione outro.",
      };
    }

    // Calcular valor
    const calculo = await calcularValorAgendamento(user.id, servicoId, dataHoraInicio);

    // Criar agendamento
    const { data: agendamento, error } = await supabase
      .from("appointments")
      .insert({
        cliente_id: user.id,
        profissional_id: profissionalId,
        servico_id: servicoId,
        data_hora_inicio: dataHoraInicio,
        data_hora_fim: dataHoraFim,
        valor_servico: calculo.valorServico,
        valor_cobrado: calculo.valorCobrado,
        coberto_assinatura: calculo.cobertoAssinatura,
        assinatura_id: calculo.assinaturaId,
        status: "agendado",
        payment_status: calculo.valorCobrado === 0 ? "pago" : "pendente",
        payment_method: calculo.cobertoAssinatura ? "assinatura" : null,
      })
      .select()
      .single();

    if (error) {
      return { success: false, message: "Erro ao criar agendamento. Tente novamente." };
    }

    revalidatePath("/meus-agendamentos");
    revalidatePath("/admin/agenda");

    return {
      success: true,
      message: "Agendamento realizado com sucesso!",
      agendamentoId: agendamento.id,
    };
  } catch {
    return { success: false, message: "Erro ao criar agendamento. Tente novamente." };
  }
}

// ============================================
// VALIDAR CANCELAMENTO
// ============================================
export async function validarCancelamento(dataHoraInicio: string): Promise<CancelamentoValidation> {
  // Usar timezone do Brasil para validação
  const agoraUTC = new Date();
  const inicioAgendamento = parseISO(dataHoraInicio);
  const horasAteAgendamento =
    (inicioAgendamento.getTime() - agoraUTC.getTime()) / (1000 * 60 * 60);

  if (horasAteAgendamento < 4) {
    return {
      pode: false,
      motivo:
        "Cancelamento permitido até 4 horas antes do horário agendado. Entre em contato via WhatsApp para assistência.",
    };
  }

  return { pode: true };
}

// ============================================
// CANCELAR AGENDAMENTO
// ============================================
export async function cancelarAgendamento(
  agendamentoId: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  // Verificar autenticação
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Você precisa estar logado" };
  }

  // Buscar agendamento
  const { data: agendamento } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", agendamentoId)
    .eq("cliente_id", user.id)
    .single();

  if (!agendamento) {
    return { success: false, message: "Agendamento não encontrado" };
  }

  if (agendamento.status !== "agendado") {
    return { success: false, message: "Este agendamento não pode ser cancelado" };
  }

  // Validar regra de 4 horas
  const validacao = await validarCancelamento(agendamento.data_hora_inicio);
  if (!validacao.pode) {
    return { success: false, message: validacao.motivo! };
  }

  // Cancelar
  const { error } = await supabase
    .from("appointments")
    .update({ status: "cancelado" })
    .eq("id", agendamentoId);

  if (error) {
    return { success: false, message: "Erro ao cancelar agendamento" };
  }

  revalidatePath("/meus-agendamentos");
  revalidatePath("/admin/agenda");

  return { success: true, message: "Agendamento cancelado com sucesso" };
}

// ============================================
// BUSCAR AGENDAMENTOS DO CLIENTE
// ============================================
export async function getClienteAgendamentos() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("appointments")
    .select(`
      *,
      servico:services(*),
      profissional:professionals(
        *,
        user:users(nome, avatar_url)
      )
    `)
    .eq("cliente_id", user.id)
    .order("data_hora_inicio", { ascending: false });

  if (error) throw error;
  return data;
}
