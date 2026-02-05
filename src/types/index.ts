/**
 * Tipos TypeScript para a aplicação Barbearia do Moura
 */

// ============================================
// ENUMS
// ============================================

export type UserRole = "cliente" | "barbeiro" | "admin";

export type AppointmentStatus =
  | "agendado"
  | "em_andamento"
  | "concluido"
  | "cancelado"
  | "nao_compareceu";

export type PaymentStatus = "pendente" | "pago" | "reembolsado" | "cancelado";

export type PaymentMethod =
  | "pix"
  | "cartao_credito"
  | "cartao_debito"
  | "dinheiro"
  | "assinatura";

export type SubscriptionStatus = "ativa" | "cancelada" | "suspensa" | "expirada";

// ============================================
// ENTIDADES DO BANCO
// ============================================

export interface User {
  id: string;
  email: string;
  role: UserRole;
  nome: string;
  telefone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Professional {
  id: string;
  user_id: string;
  bio: string | null;
  foto_url: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  // Relações
  user?: User;
}

export interface Service {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  duracao_minutos: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  servicos_ids: string[];
  ativo: boolean;
  created_at: string;
  updated_at: string;
  // Relações
  servicos?: Service[];
}

export interface SubscriptionPlan {
  id: string;
  nome: string;
  descricao: string | null;
  preco_mensal: number;
  servicos_inclusos: string[];
  dias_permitidos: number[] | null; // null = todos os dias, [1,2,3] = seg, ter, qua
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  cliente_id: string;
  plano_id: string;
  status: SubscriptionStatus;
  mp_subscription_id: string | null;
  data_inicio: string;
  proxima_cobranca: string | null;
  data_cancelamento: string | null;
  created_at: string;
  updated_at: string;
  // Relações
  cliente?: User;
  plano?: SubscriptionPlan;
}

export interface Appointment {
  id: string;
  cliente_id: string;
  profissional_id: string;
  servico_id: string;
  data_hora_inicio: string;
  data_hora_fim: string;
  status: AppointmentStatus;
  valor_servico: number;
  valor_cobrado: number;
  coberto_assinatura: boolean;
  assinatura_id: string | null;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
  // Relações
  cliente?: User;
  profissional?: Professional;
  servico?: Service;
}

export interface Payment {
  id: string;
  agendamento_id: string | null;
  assinatura_id: string | null;
  valor: number;
  metodo: PaymentMethod;
  status: PaymentStatus;
  mp_payment_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Commission {
  id: string;
  profissional_id: string;
  agendamento_id: string;
  valor_servico: number;
  percentual: number;
  valor_comissao: number;
  pago: boolean;
  data_pagamento: string | null;
  created_at: string;
  // Relações
  profissional?: Professional;
  agendamento?: Appointment;
}

export interface BusinessHours {
  id: string;
  dia_semana: number; // 0=Dom, 1=Seg, ..., 6=Sab
  abertura: string; // "09:00"
  fechamento: string; // "20:00"
  ativo: boolean;
}

export interface BlockedSlot {
  id: string;
  profissional_id: string | null; // null = barbearia inteira
  data_inicio: string;
  data_fim: string;
  motivo: string | null;
  created_at: string;
}

// ============================================
// DTOs E TIPOS AUXILIARES
// ============================================

export interface TimeSlot {
  horario: string; // "09:00"
  disponivel: boolean;
}

export interface CalculoAgendamento {
  valorServico: number;
  valorCobrado: number;
  cobertoAssinatura: boolean;
  assinaturaId: string | null;
  avisoPlanoLimitado: string | null;
}

export interface CancelamentoValidation {
  pode: boolean;
  motivo?: string;
}

// ============================================
// TIPOS DE FORMULÁRIO
// ============================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  nome: string;
  email: string;
  telefone: string;
  password: string;
  confirmPassword: string;
}

export interface AgendamentoFormData {
  servicoId: string;
  profissionalId: string;
  data: string;
  horario: string;
}

// ============================================
// TIPOS DE RESPOSTA DA API
// ============================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// MÉTRICAS DO DASHBOARD
// ============================================

export interface DashboardMetrics {
  agendamentosHoje: number;
  agendamentosHojePorStatus: Record<AppointmentStatus, number>;
  faturamentoHoje: number;
  faturamentoMes: number;
  ocupacaoHoje: number;
  assinantesAtivos: number;
  taxaNoShow: number;
  novosClientesMes: number;
}
