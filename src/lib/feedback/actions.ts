"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ============================================
// BUSCAR AGENDAMENTOS PENDENTES DE FEEDBACK
// ============================================
export async function getAgendamentosPendentesFeedback() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  // Buscar agendamentos concluídos que ainda não têm feedback
  const { data, error } = await supabase
    .from("appointments")
    .select(`
      id,
      data_hora_inicio,
      data_hora_fim,
      profissional_id,
      profissional_nome,
      servico:services(id, nome),
      profissional:professionals(
        id,
        foto_url,
        user:users(nome, avatar_url)
      )
    `)
    .eq("cliente_id", user.id)
    .eq("status", "concluido")
    .order("data_hora_inicio", { ascending: false });

  if (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return [];
  }

  // Buscar feedbacks já enviados pelo cliente
  const { data: feedbacks } = await supabase
    .from("feedbacks")
    .select("agendamento_id")
    .eq("cliente_id", user.id);

  const feedbackAgendamentoIds = new Set(feedbacks?.map(f => f.agendamento_id) || []);

  // Filtrar apenas agendamentos sem feedback
  const pendentes = data?.filter(a => !feedbackAgendamentoIds.has(a.id)) || [];

  return pendentes;
}

// ============================================
// BUSCAR FEEDBACKS DO CLIENTE
// ============================================
export async function getMeusFeedbacks() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("feedbacks")
    .select(`
      id,
      nota,
      comentario,
      profissional_nome,
      created_at,
      agendamento:appointments(
        data_hora_inicio,
        servico:services(nome)
      )
    `)
    .eq("cliente_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar feedbacks:", error);
    return [];
  }

  return data || [];
}

// ============================================
// ENVIAR FEEDBACK
// ============================================
export async function enviarFeedback(
  agendamentoId: string,
  nota: number,
  comentario?: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Você precisa estar logado" };
  }

  // Validar nota
  if (nota < 1 || nota > 5) {
    return { success: false, message: "A nota deve ser entre 1 e 5" };
  }

  // Verificar se o agendamento pertence ao cliente e está concluído
  const { data: agendamento } = await supabase
    .from("appointments")
    .select("id, cliente_id, status")
    .eq("id", agendamentoId)
    .single();

  if (!agendamento) {
    return { success: false, message: "Agendamento não encontrado" };
  }

  if (agendamento.cliente_id !== user.id) {
    return { success: false, message: "Este agendamento não pertence a você" };
  }

  if (agendamento.status !== "concluido") {
    return { success: false, message: "Só é possível avaliar agendamentos concluídos" };
  }

  // Verificar se já existe feedback para este agendamento
  const { data: existingFeedback } = await supabase
    .from("feedbacks")
    .select("id")
    .eq("agendamento_id", agendamentoId)
    .single();

  if (existingFeedback) {
    return { success: false, message: "Você já avaliou este atendimento" };
  }

  // Criar feedback
  const { error } = await supabase
    .from("feedbacks")
    .insert({
      agendamento_id: agendamentoId,
      cliente_id: user.id,
      nota,
      comentario: comentario?.trim() || null,
    });

  if (error) {
    console.error("Erro ao enviar feedback:", error);
    return { success: false, message: "Erro ao enviar avaliação. Tente novamente." };
  }

  revalidatePath("/feedback");
  revalidatePath("/meus-agendamentos");

  return { success: true, message: "Avaliação enviada com sucesso!" };
}

// ============================================
// BUSCAR TODOS OS FEEDBACKS (ADMIN)
// ============================================
export async function getAllFeedbacks(filtros?: {
  profissionalId?: string;
  dataInicio?: string;
  dataFim?: string;
}) {
  const supabase = await createClient();

  // Verificar se é admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userData?.role !== "admin") {
    return [];
  }

  let query = supabase
    .from("feedbacks")
    .select(`
      id,
      nota,
      comentario,
      profissional_id,
      profissional_nome,
      created_at,
      cliente:users!feedbacks_cliente_id_fkey(nome, avatar_url),
      agendamento:appointments(
        data_hora_inicio,
        servico:services(nome)
      )
    `)
    .order("created_at", { ascending: false });

  // Aplicar filtros
  if (filtros?.profissionalId) {
    query = query.eq("profissional_id", filtros.profissionalId);
  }

  if (filtros?.dataInicio) {
    query = query.gte("created_at", filtros.dataInicio);
  }

  if (filtros?.dataFim) {
    query = query.lte("created_at", filtros.dataFim);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao buscar feedbacks:", error);
    return [];
  }

  return data || [];
}

// ============================================
// BUSCAR ESTATÍSTICAS DE FEEDBACKS (ADMIN)
// ============================================
export async function getFeedbackStats() {
  const supabase = await createClient();

  // Verificar se é admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userData?.role !== "admin") {
    return null;
  }

  // Total de feedbacks
  const { count: totalFeedbacks } = await supabase
    .from("feedbacks")
    .select("*", { count: "exact", head: true });

  // Média geral
  const { data: mediaData } = await supabase
    .from("feedbacks")
    .select("nota");

  const mediaGeral = mediaData && mediaData.length > 0
    ? mediaData.reduce((sum, f) => sum + f.nota, 0) / mediaData.length
    : 0;

  // Feedbacks por profissional
  const { data: feedbacksPorProfissional } = await supabase
    .from("feedbacks")
    .select("profissional_id, profissional_nome, nota")
    .not("profissional_id", "is", null);

  // Agrupar por profissional e calcular média
  const profissionaisMap = new Map<string, { nome: string; total: number; soma: number }>();

  feedbacksPorProfissional?.forEach(f => {
    const key = f.profissional_id!;
    const existing = profissionaisMap.get(key);
    if (existing) {
      existing.total += 1;
      existing.soma += f.nota;
    } else {
      profissionaisMap.set(key, {
        nome: f.profissional_nome || "Profissional removido",
        total: 1,
        soma: f.nota,
      });
    }
  });

  const estatisticasPorProfissional = Array.from(profissionaisMap.entries()).map(([id, stats]) => ({
    profissionalId: id,
    profissionalNome: stats.nome,
    totalFeedbacks: stats.total,
    mediaNotas: stats.soma / stats.total,
  }));

  // Distribuição de notas
  const distribuicaoNotas = [1, 2, 3, 4, 5].map(nota => ({
    nota,
    quantidade: mediaData?.filter(f => f.nota === nota).length || 0,
  }));

  return {
    totalFeedbacks: totalFeedbacks || 0,
    mediaGeral: Math.round(mediaGeral * 10) / 10,
    estatisticasPorProfissional: estatisticasPorProfissional.sort((a, b) => b.mediaNotas - a.mediaNotas),
    distribuicaoNotas,
  };
}
