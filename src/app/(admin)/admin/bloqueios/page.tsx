"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils";
import {
  Clock,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Building,
  User,
  CalendarOff,
} from "lucide-react";
import { format, parseISO, isBefore, isAfter } from "date-fns";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";

const TIMEZONE = "America/Sao_Paulo";

interface Professional {
  id: string;
  user: {
    nome: string;
    avatar_url: string | null;
  };
}

interface BlockedSlot {
  id: string;
  profissional_id: string | null;
  data_inicio: string;
  data_fim: string;
  motivo: string | null;
  created_at: string;
  profissional?: {
    user: {
      nome: string;
      avatar_url: string | null;
    };
  };
}

export default function AdminBloqueiosPage() {
  const { toast } = useToast();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<BlockedSlot | null>(null);
  const [processing, setProcessing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filtro
  const [filterType, setFilterType] = useState<string>("all");

  // Form state
  const [tipoBloquieo, setTipoBloquieo] = useState<"geral" | "profissional">("geral");
  const [profissionalId, setProfissionalId] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [dataFim, setDataFim] = useState("");
  const [horaFim, setHoraFim] = useState("18:00");
  const [motivo, setMotivo] = useState("");

  // Carregar dados
  useEffect(() => {
    async function loadData() {
      const supabase = createClient();

      // Carregar profissionais
      const { data: profsData } = await supabase
        .from("professionals")
        .select(`
          id,
          user:users!professionals_user_id_fkey(nome, avatar_url)
        `)
        .eq("ativo", true)
        .order("created_at");

      if (profsData) {
        const transformed = profsData.map((item: any) => ({
          ...item,
          user: Array.isArray(item.user) ? item.user[0] : item.user,
        })) as Professional[];
        setProfessionals(transformed);
      }

      // Carregar bloqueios
      const { data: blocksData } = await supabase
        .from("blocked_slots")
        .select(`
          id,
          profissional_id,
          data_inicio,
          data_fim,
          motivo,
          created_at,
          profissional:professionals(
            user:users(nome, avatar_url)
          )
        `)
        .order("data_inicio", { ascending: false });

      if (blocksData) {
        const transformedBlocks = blocksData.map((item: any) => ({
          ...item,
          profissional: item.profissional ? (Array.isArray(item.profissional) ? {
            ...item.profissional[0],
            user: Array.isArray(item.profissional[0]?.user) ? item.profissional[0].user[0] : item.profissional[0]?.user,
          } : {
            ...item.profissional,
            user: Array.isArray(item.profissional?.user) ? item.profissional.user[0] : item.profissional?.user,
          }) : null,
        })) as BlockedSlot[];
        setBlockedSlots(transformedBlocks);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  // Abrir dialog para criar
  const openCreateDialog = () => {
    setEditing(null);
    setTipoBloquieo("geral");
    setProfissionalId("");
    setDataInicio("");
    setHoraInicio("08:00");
    setDataFim("");
    setHoraFim("18:00");
    setMotivo("");
    setShowDialog(true);
  };

  // Abrir dialog para editar
  const openEditDialog = (block: BlockedSlot) => {
    setEditing(block);
    setTipoBloquieo(block.profissional_id ? "profissional" : "geral");
    setProfissionalId(block.profissional_id || "");
    
    // Converter datas UTC para local
    const startDate = parseISO(block.data_inicio);
    const endDate = parseISO(block.data_fim);
    
    setDataInicio(formatInTimeZone(startDate, TIMEZONE, "yyyy-MM-dd"));
    setHoraInicio(formatInTimeZone(startDate, TIMEZONE, "HH:mm"));
    setDataFim(formatInTimeZone(endDate, TIMEZONE, "yyyy-MM-dd"));
    setHoraFim(formatInTimeZone(endDate, TIMEZONE, "HH:mm"));
    setMotivo(block.motivo || "");
    setShowDialog(true);
  };

  // Salvar bloqueio
  const handleSave = async () => {
    if (!dataInicio || !dataFim) {
      toast({
        title: "Erro",
        description: "Preencha as datas de início e fim",
        variant: "destructive",
      });
      return;
    }

    if (tipoBloquieo === "profissional" && !profissionalId) {
      toast({
        title: "Erro",
        description: "Selecione um profissional",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    const supabase = createClient();

    try {
      // Converter datas locais para UTC
      const dataInicioLocal = new Date(`${dataInicio}T${horaInicio}:00`);
      const dataFimLocal = new Date(`${dataFim}T${horaFim}:00`);

      const dataInicioUTC = fromZonedTime(dataInicioLocal, TIMEZONE);
      const dataFimUTC = fromZonedTime(dataFimLocal, TIMEZONE);

      const blockData = {
        profissional_id: tipoBloquieo === "profissional" ? profissionalId : null,
        data_inicio: dataInicioUTC.toISOString(),
        data_fim: dataFimUTC.toISOString(),
        motivo: motivo || null,
      };

      if (editing) {
        const { error } = await supabase
          .from("blocked_slots")
          .update(blockData)
          .eq("id", editing.id);

        if (error) throw error;

        // Recarregar para obter dados do profissional
        const { data: updatedBlock } = await supabase
          .from("blocked_slots")
          .select(`
            id,
            profissional_id,
            data_inicio,
            data_fim,
            motivo,
            created_at,
            profissional:professionals(
              user:users(nome, avatar_url)
            )
          `)
          .eq("id", editing.id)
          .single();

        if (updatedBlock) {
          // Transformar dados para formato correto
          const transformedBlock = {
            ...updatedBlock,
            profissional: updatedBlock.profissional ? (Array.isArray(updatedBlock.profissional) ? {
              ...(updatedBlock.profissional as any[])[0],
              user: Array.isArray((updatedBlock.profissional as any[])[0]?.user) ? (updatedBlock.profissional as any[])[0].user[0] : (updatedBlock.profissional as any[])[0]?.user,
            } : {
              ...(updatedBlock.profissional as any),
              user: Array.isArray((updatedBlock.profissional as any)?.user) ? (updatedBlock.profissional as any).user[0] : (updatedBlock.profissional as any)?.user,
            }) : null,
          } as BlockedSlot;
          setBlockedSlots((prev) =>
            prev.map((b) => (b.id === editing.id ? transformedBlock : b))
          );
        }

        toast({
          title: "Sucesso",
          description: "Bloqueio atualizado com sucesso",
          variant: "success",
        });
      } else {
        const { data, error } = await supabase
          .from("blocked_slots")
          .insert(blockData)
          .select(`
            id,
            profissional_id,
            data_inicio,
            data_fim,
            motivo,
            created_at,
            profissional:professionals(
              user:users(nome, avatar_url)
            )
          `)
          .single();

        if (error) throw error;

        // Transformar dados para formato correto
        const transformedData = {
          ...data,
          profissional: data.profissional ? (Array.isArray(data.profissional) ? {
            ...(data.profissional as any[])[0],
            user: Array.isArray((data.profissional as any[])[0]?.user) ? (data.profissional as any[])[0].user[0] : (data.profissional as any[])[0]?.user,
          } : {
            ...(data.profissional as any),
            user: Array.isArray((data.profissional as any)?.user) ? (data.profissional as any).user[0] : (data.profissional as any)?.user,
          }) : null,
        } as BlockedSlot;
        setBlockedSlots((prev) => [transformedData, ...prev]);

        toast({
          title: "Sucesso",
          description: "Bloqueio criado com sucesso",
          variant: "success",
        });
      }

      setShowDialog(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Não foi possível salvar o bloqueio";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Excluir bloqueio
  const handleDelete = async () => {
    if (!deleteId) return;

    setProcessing(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.from("blocked_slots").delete().eq("id", deleteId);

      if (error) throw error;

      setBlockedSlots((prev) => prev.filter((b) => b.id !== deleteId));
      setDeleteId(null);

      toast({
        title: "Sucesso",
        description: "Bloqueio removido com sucesso",
        variant: "success",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o bloqueio",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Formatar data no timezone do Brasil
  const formatDateBR = (dateStr: string, formatStr: string) => {
    return formatInTimeZone(parseISO(dateStr), TIMEZONE, formatStr, { locale: ptBR });
  };

  // Verificar se bloqueio está ativo
  const isBlockActive = (block: BlockedSlot) => {
    const now = new Date();
    const start = parseISO(block.data_inicio);
    const end = parseISO(block.data_fim);
    return isAfter(now, start) && isBefore(now, end);
  };

  // Verificar se bloqueio é futuro
  const isBlockFuture = (block: BlockedSlot) => {
    const now = new Date();
    const start = parseISO(block.data_inicio);
    return isAfter(start, now);
  };

  // Filtrar bloqueios
  const filteredBlocks = blockedSlots.filter((block) => {
    if (filterType === "geral" && block.profissional_id) return false;
    if (filterType === "profissional" && !block.profissional_id) return false;
    return true;
  });

  // Estatísticas
  const stats = {
    total: blockedSlots.length,
    geral: blockedSlots.filter((b) => !b.profissional_id).length,
    profissional: blockedSlots.filter((b) => b.profissional_id).length,
    ativos: blockedSlots.filter((b) => isBlockActive(b)).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bloqueios de Horários</h1>
          <p className="text-[#EAD8AC]">
            Gerencie bloqueios gerais e visualize os bloqueios dos profissionais
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Bloqueio
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-[#EAD8AC]">Total de Bloqueios</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#EAD8AC]">{stats.geral}</div>
            <p className="text-sm text-[#EAD8AC]">Bloqueios Gerais</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#EAD8AC]">{stats.profissional}</div>
            <p className="text-sm text-[#EAD8AC]">Bloqueios Individuais</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#EAD8AC]">{stats.ativos}</div>
            <p className="text-sm text-[#EAD8AC]">Ativos Agora</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtro */}
      <div className="flex gap-4">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Bloqueios</SelectItem>
            <SelectItem value="geral">Bloqueios Gerais</SelectItem>
            <SelectItem value="profissional">Bloqueios Individuais</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Bloqueios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarOff className="h-5 w-5" />
            Bloqueios ({filteredBlocks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : filteredBlocks.length === 0 ? (
            <div className="text-center py-12 text-[#EAD8AC]">
              <CalendarOff className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum bloqueio encontrado</p>
              <Button className="mt-4" onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Bloqueio
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBlocks.map((block) => {
                const isActive = isBlockActive(block);
                const isFuture = isBlockFuture(block);

                return (
                  <div
                    key={block.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border ${
                      isActive ? "border-[#EAD8AC] bg-[#EAD8AC]/10" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4 mb-4 sm:mb-0">
                      {block.profissional_id ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={block.profissional?.user?.avatar_url || undefined}
                            alt={block.profissional?.user?.nome}
                          />
                          <AvatarFallback className="bg-secondary">
                            {getInitials(block.profissional?.user?.nome || "")}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-[#013648]/70 flex items-center justify-center">
                          <Building className="h-5 w-5 text-[#EAD8AC]" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">
                            {block.profissional_id
                              ? block.profissional?.user?.nome
                              : "Bloqueio Geral da Barbearia"}
                          </h3>
                          {isActive && <Badge variant="warning">Ativo</Badge>}
                          {isFuture && <Badge variant="secondary">Futuro</Badge>}
                          {!isActive && !isFuture && <Badge variant="outline">Passado</Badge>}
                        </div>
                        {block.motivo && (
                          <p className="text-sm text-[#EAD8AC] mb-2">
                            {block.motivo}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[#EAD8AC]">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDateBR(block.data_inicio, "dd/MM/yyyy 'às' HH:mm")}
                          </span>
                          <span>até</span>
                          <span>
                            {formatDateBR(block.data_fim, "dd/MM/yyyy 'às' HH:mm")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(block)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(block.id)}
                      >
                        <Trash2 className="h-4 w-4 text-[#EAD8AC]" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Criar/Editar */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar Bloqueio" : "Novo Bloqueio"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Atualize as informações do bloqueio"
                : "Crie um bloqueio geral ou para um profissional específico"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tipo de Bloqueio</Label>
              <Select
                value={tipoBloquieo}
                onValueChange={(v) => setTipoBloquieo(v as "geral" | "profissional")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Bloqueio Geral (toda a barbearia)
                    </div>
                  </SelectItem>
                  <SelectItem value="profissional">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Bloqueio de Profissional
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {tipoBloquieo === "profissional" && (
              <div className="space-y-2">
                <Label>Profissional</Label>
                <Select value={profissionalId} onValueChange={setProfissionalId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionals.map((prof) => (
                      <SelectItem key={prof.id} value={prof.id}>
                        {prof.user?.nome ?? "Profissional"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Início</Label>
                <Input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Hora Início</Label>
                <Input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Fim</Label>
                <Input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Hora Fim</Label>
                <Input
                  type="time"
                  value={horaFim}
                  onChange={(e) => setHoraFim(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Motivo (opcional)</Label>
              <Textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ex: Feriado, Manutenção, Férias..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Bloqueio</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este bloqueio? Os horários ficarão
              disponíveis para agendamento novamente.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}



