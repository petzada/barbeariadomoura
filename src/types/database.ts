/**
 * Tipos gerados para o banco de dados Supabase
 * Este arquivo deve ser atualizado quando o schema do banco mudar
 * Usar: npx supabase gen types typescript --project-id <id> > src/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: "cliente" | "barbeiro" | "admin";
          nome: string;
          telefone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: "cliente" | "barbeiro" | "admin";
          nome: string;
          telefone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: "cliente" | "barbeiro" | "admin";
          nome?: string;
          telefone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      professionals: {
        Row: {
          id: string;
          user_id: string;
          bio: string | null;
          foto_url: string | null;
          ativo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bio?: string | null;
          foto_url?: string | null;
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          bio?: string | null;
          foto_url?: string | null;
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "professionals_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      services: {
        Row: {
          id: string;
          nome: string;
          descricao: string | null;
          preco: number;
          duracao_minutos: number;
          ativo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          descricao?: string | null;
          preco: number;
          duracao_minutos: number;
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          descricao?: string | null;
          preco?: number;
          duracao_minutos?: number;
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      packages: {
        Row: {
          id: string;
          nome: string;
          descricao: string | null;
          preco: number;
          servicos_ids: string[];
          ativo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          descricao?: string | null;
          preco: number;
          servicos_ids: string[];
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          descricao?: string | null;
          preco?: number;
          servicos_ids?: string[];
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscription_plans: {
        Row: {
          id: string;
          nome: string;
          descricao: string | null;
          preco_mensal: number;
          servicos_inclusos: string[];
          dias_permitidos: number[] | null;
          ativo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          descricao?: string | null;
          preco_mensal: number;
          servicos_inclusos: string[];
          dias_permitidos?: number[] | null;
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          descricao?: string | null;
          preco_mensal?: number;
          servicos_inclusos?: string[];
          dias_permitidos?: number[] | null;
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          cliente_id: string;
          plano_id: string;
          status: "ativa" | "cancelada" | "suspensa" | "expirada";
          mp_subscription_id: string | null;
          data_inicio: string;
          proxima_cobranca: string | null;
          data_cancelamento: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cliente_id: string;
          plano_id: string;
          status?: "ativa" | "cancelada" | "suspensa" | "expirada";
          mp_subscription_id?: string | null;
          data_inicio: string;
          proxima_cobranca?: string | null;
          data_cancelamento?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cliente_id?: string;
          plano_id?: string;
          status?: "ativa" | "cancelada" | "suspensa" | "expirada";
          mp_subscription_id?: string | null;
          data_inicio?: string;
          proxima_cobranca?: string | null;
          data_cancelamento?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_cliente_id_fkey";
            columns: ["cliente_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_plano_id_fkey";
            columns: ["plano_id"];
            referencedRelation: "subscription_plans";
            referencedColumns: ["id"];
          }
        ];
      };
      appointments: {
        Row: {
          id: string;
          cliente_id: string;
          profissional_id: string;
          servico_id: string;
          data_hora_inicio: string;
          data_hora_fim: string;
          status: "agendado" | "em_andamento" | "concluido" | "cancelado" | "nao_compareceu";
          valor_servico: number;
          valor_cobrado: number;
          coberto_assinatura: boolean;
          assinatura_id: string | null;
          payment_status: "pendente" | "pago" | "reembolsado" | "cancelado";
          payment_method: "pix" | "cartao_credito" | "cartao_debito" | "dinheiro" | "assinatura" | null;
          observacoes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cliente_id: string;
          profissional_id: string;
          servico_id: string;
          data_hora_inicio: string;
          data_hora_fim: string;
          status?: "agendado" | "em_andamento" | "concluido" | "cancelado" | "nao_compareceu";
          valor_servico: number;
          valor_cobrado: number;
          coberto_assinatura?: boolean;
          assinatura_id?: string | null;
          payment_status?: "pendente" | "pago" | "reembolsado" | "cancelado";
          payment_method?: "pix" | "cartao_credito" | "cartao_debito" | "dinheiro" | "assinatura" | null;
          observacoes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cliente_id?: string;
          profissional_id?: string;
          servico_id?: string;
          data_hora_inicio?: string;
          data_hora_fim?: string;
          status?: "agendado" | "em_andamento" | "concluido" | "cancelado" | "nao_compareceu";
          valor_servico?: number;
          valor_cobrado?: number;
          coberto_assinatura?: boolean;
          assinatura_id?: string | null;
          payment_status?: "pendente" | "pago" | "reembolsado" | "cancelado";
          payment_method?: "pix" | "cartao_credito" | "cartao_debito" | "dinheiro" | "assinatura" | null;
          observacoes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_cliente_id_fkey";
            columns: ["cliente_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_profissional_id_fkey";
            columns: ["profissional_id"];
            referencedRelation: "professionals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_servico_id_fkey";
            columns: ["servico_id"];
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_assinatura_id_fkey";
            columns: ["assinatura_id"];
            referencedRelation: "subscriptions";
            referencedColumns: ["id"];
          }
        ];
      };
      payments: {
        Row: {
          id: string;
          agendamento_id: string | null;
          assinatura_id: string | null;
          valor: number;
          metodo: "pix" | "cartao_credito" | "cartao_debito" | "dinheiro" | "assinatura";
          status: "pendente" | "pago" | "reembolsado" | "cancelado";
          mp_payment_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agendamento_id?: string | null;
          assinatura_id?: string | null;
          valor: number;
          metodo: "pix" | "cartao_credito" | "cartao_debito" | "dinheiro" | "assinatura";
          status?: "pendente" | "pago" | "reembolsado" | "cancelado";
          mp_payment_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          agendamento_id?: string | null;
          assinatura_id?: string | null;
          valor?: number;
          metodo?: "pix" | "cartao_credito" | "cartao_debito" | "dinheiro" | "assinatura";
          status?: "pendente" | "pago" | "reembolsado" | "cancelado";
          mp_payment_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_agendamento_id_fkey";
            columns: ["agendamento_id"];
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_assinatura_id_fkey";
            columns: ["assinatura_id"];
            referencedRelation: "subscriptions";
            referencedColumns: ["id"];
          }
        ];
      };
      commissions: {
        Row: {
          id: string;
          profissional_id: string;
          agendamento_id: string;
          valor_servico: number;
          percentual: number;
          valor_comissao: number;
          pago: boolean;
          data_pagamento: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profissional_id: string;
          agendamento_id: string;
          valor_servico: number;
          percentual: number;
          valor_comissao: number;
          pago?: boolean;
          data_pagamento?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          profissional_id?: string;
          agendamento_id?: string;
          valor_servico?: number;
          percentual?: number;
          valor_comissao?: number;
          pago?: boolean;
          data_pagamento?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "commissions_profissional_id_fkey";
            columns: ["profissional_id"];
            referencedRelation: "professionals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "commissions_agendamento_id_fkey";
            columns: ["agendamento_id"];
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          }
        ];
      };
      business_hours: {
        Row: {
          id: string;
          dia_semana: number;
          abertura: string;
          fechamento: string;
          ativo: boolean;
        };
        Insert: {
          id?: string;
          dia_semana: number;
          abertura: string;
          fechamento: string;
          ativo?: boolean;
        };
        Update: {
          id?: string;
          dia_semana?: number;
          abertura?: string;
          fechamento?: string;
          ativo?: boolean;
        };
        Relationships: [];
      };
      professional_hours: {
        Row: {
          id: string;
          profissional_id: string;
          dia_semana: number;
          abertura: string;
          fechamento: string;
          ativo: boolean;
        };
        Insert: {
          id?: string;
          profissional_id: string;
          dia_semana: number;
          abertura: string;
          fechamento: string;
          ativo?: boolean;
        };
        Update: {
          id?: string;
          profissional_id?: string;
          dia_semana?: number;
          abertura?: string;
          fechamento?: string;
          ativo?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "professional_hours_profissional_id_fkey";
            columns: ["profissional_id"];
            referencedRelation: "professionals";
            referencedColumns: ["id"];
          }
        ];
      };
      blocked_slots: {
        Row: {
          id: string;
          profissional_id: string | null;
          data_inicio: string;
          data_fim: string;
          motivo: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profissional_id?: string | null;
          data_inicio: string;
          data_fim: string;
          motivo?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          profissional_id?: string | null;
          data_inicio?: string;
          data_fim?: string;
          motivo?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blocked_slots_profissional_id_fkey";
            columns: ["profissional_id"];
            referencedRelation: "professionals";
            referencedColumns: ["id"];
          }
        ];
      };
      commission_rates: {
        Row: {
          id: string;
          profissional_id: string;
          servico_id: string;
          percentual: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profissional_id: string;
          servico_id: string;
          percentual: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profissional_id?: string;
          servico_id?: string;
          percentual?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "commission_rates_profissional_id_fkey";
            columns: ["profissional_id"];
            referencedRelation: "professionals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "commission_rates_servico_id_fkey";
            columns: ["servico_id"];
            referencedRelation: "services";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      user_role: "cliente" | "barbeiro" | "admin";
      appointment_status: "agendado" | "em_andamento" | "concluido" | "cancelado" | "nao_compareceu";
      payment_status: "pendente" | "pago" | "reembolsado" | "cancelado";
      payment_method: "pix" | "cartao_credito" | "cartao_debito" | "dinheiro" | "assinatura";
      subscription_status: "ativa" | "cancelada" | "suspensa" | "expirada";
    };
    CompositeTypes: {};
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;
