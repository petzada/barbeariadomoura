"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import {
  CalendarOff,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { format, parseISO, isBefore, isAfter } from "date-fns";
import { fromZonedTime, toZonedTime, formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";

// Timezone do Brasil (GMT-3)
const TIMEZONE = "America/Sao_Paulo";

interface BlockedSlot {
  id: string;
  profissional_id: string | null;
  data_inicio: string;
  data_fim: string;
  motivo: string | null;
  created_at: string;
}

export default function BloqueiosPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: loadingUser, isAuthenticated, isBarbeiro } = useUser();

  const [blocks, setBlocks] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [professionalId, setProfessionalId] = useState<string | null>(null);

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<BlockedSlot | null>(null);
  const [processing, setProcessing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    dataInicio: "",
    horaInicio: "",
    dataFim: "",
    horaFim: "",
    motivo: "",
  });

  // Redirecionar se não autenticado ou não for barbeiro
  useEffect(() => {
    if (!loadingUser) {
      if (!isAuthenticated) {
        router.push("/login?redirect=/profissional/bloqueios");
      } else if (!isBarbeiro) {
        router.push("/");
      }
    }
  }, [loadingUser, isAuthenticated, isBarbeiro, router]);

  // Carregar bloqueios
  useEffect(() => {
    async function loadBlocks() {
      if (!user) return;

      const supabase = createClient();

      // Buscar ID do profissional
      const { data: professional } = await supabase
        .from("professionals")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!professional) {
        setLoading(false);
        return;
      }

      setProfessionalId(professional.id);

      // Buscar bloqueios do profissional
      const { data: blocksData, error } = await supabase
        .from("blocked_slots")
        .select("*")
        .eq("profissional_id", professional.id)
        .order("data_inicio", { ascending: false });

      if (error) {
        console.error("Erro ao carregar bloqueios:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os bloqueios",
          variant: "destructive",
        });
      } else {
        setBlocks(blocksData || []);
      }

      setLoading(false);
    }

    if (user && isBarbeiro) {
      loadBlocks();
    }
  }, [user, isBarbeiro, toast]);

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      dataInicio: "",
      horaInicio: "",
      dataFim: "",
      horaFim: "",
      motivo: "",
    });
  };

  // Abrir dialog de edição
  const openEditDialog = (block: BlockedSlot) => {
    setSelectedBlock(block);
    // Converter para timezone Brasil para exibição
    setFormData({
      dataInicio: formatInTimeZone(parseISO(block.data_inicio), TIMEZONE, "yyyy-MM-dd"),
      horaInicio: formatInTimeZone(parseISO(block.data_inicio), TIMEZONE, "HH:mm"),
      dataFim: formatInTimeZone(parseISO(block.data_fim), TIMEZONE, "yyyy-MM-dd"),
      horaFim: formatInTimeZone(parseISO(block.data_fim), TIMEZONE, "HH:mm"),
      motivo: block.motivo || "",
    });
    setShowEditDialog(true);
  };

  // Abrir dialog de exclusão
  const openDeleteDialog = (block: BlockedSlot) => {
    setSelectedBlock(block);
    setShowDeleteDialog(true);
  };

  // Criar bloqueio
  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!professionalId || processing) return;

    // Converter horário local do Brasil para UTC
    const dataInicioLocal = new Date(`${formData.dataInicio}T${formData.horaInicio}:00`);
    const dataFimLocal = new Date(`${formData.dataFim}T${formData.horaFim}:00`);
    
    const dataInicio = fromZonedTime(dataInicioLocal, TIMEZONE);
    const dataFim = fromZonedTime(dataFimLocal, TIMEZONE);

    if (isAfter(dataInicio, dataFim) || dataInicio.getTime() === dataFim.getTime()) {
      toast({
        title: "Erro",
        description: "A data/hora de fim deve ser posterior à de início",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("blocked_slots")
      .insert({
        profissional_id: professionalId,
        data_inicio: dataInicio.toISOString(),
        data_fim: dataFim.toISOString(),
        motivo: formData.motivo || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar bloqueio:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o bloqueio",
        variant: "destructive",
      });
    } else {
      setBlocks((prev) => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Bloqueio criado com sucesso",
        variant: "success",
      });
      setShowCreateDialog(false);
      resetForm();
    }

    setProcessing(false);
  };

  // Editar bloqueio
  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedBlock || processing) return;

    // Converter horário local do Brasil para UTC
    const dataInicioLocal = new Date(`${formData.dataInicio}T${formData.horaInicio}:00`);
    const dataFimLocal = new Date(`${formData.dataFim}T${formData.horaFim}:00`);
    
    const dataInicio = fromZonedTime(dataInicioLocal, TIMEZONE);
    const dataFim = fromZonedTime(dataFimLocal, TIMEZONE);

    if (isAfter(dataInicio, dataFim) || dataInicio.getTime() === dataFim.getTime()) {
      toast({
        title: "Erro",
        description: "A data/hora de fim deve ser posterior à de início",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("blocked_slots")
      .update({
        data_inicio: dataInicio.toISOString(),
        data_fim: dataFim.toISOString(),
        motivo: formData.motivo || null,
      })
      .eq("id", selectedBlock.id);

    if (error) {
      console.error("Erro ao editar bloqueio:", error);
      toast({
        title: "Erro",
        description: "Não foi possível editar o bloqueio",
        variant: "destructive",
      });
    } else {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === selectedBlock.id
            ? {
                ...b,
                data_inicio: dataInicio.toISOString(),
                data_fim: dataFim.toISOString(),
                motivo: formData.motivo || null,
              }
            : b
        )
      );
      toast({
        title: "Sucesso",
        description: "Bloqueio atualizado com sucesso",
        variant: "success",
      });
      setShowEditDialog(false);
      resetForm();
      setSelectedBlock(null);
    }

    setProcessing(false);
  };

  // Excluir bloqueio
  const handleDelete = async () => {
    if (!selectedBlock || processing) return;

    setProcessing(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("blocked_slots")
      .delete()
      .eq("id", selectedBlock.id);

    if (error) {
      console.error("Erro ao excluir bloqueio:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o bloqueio",
        variant: "destructive",
      });
    } else {
      setBlocks((prev) => prev.filter((b) => b.id !== selectedBlock.id));
      toast({
        title: "Sucesso",
        description: "Bloqueio excluído com sucesso",
        variant: "success",
      });
      setShowDeleteDialog(false);
      setSelectedBlock(null);
    }

    setProcessing(false);
  };

  // Verificar se bloqueio está ativo (usando timezone Brasil)
  const isBlockActive = (block: BlockedSlot) => {
    const now = new Date();
    const inicio = parseISO(block.data_inicio);
    const fim = parseISO(block.data_fim);
    return isAfter(now, inicio) && isBefore(now, fim);
  };

  // Verificar se bloqueio é passado (usando timezone Brasil)
  const isBlockPast = (block: BlockedSlot) => {
    return isBefore(parseISO(block.data_fim), new Date());
  };

  // Formatar data no timezone do Brasil
  const formatDateBR = (dateStr: string, formatStr: string) => {
    return formatInTimeZone(parseISO(dateStr), TIMEZONE, formatStr, { locale: ptBR });
  };

  if (loadingUser || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!user || !isBarbeiro) {
    return null;
  }

  const activeBlocks = blocks.filter((b) => !isBlockPast(b));
  const pastBlocks = blocks.filter((b) => isBlockPast(b));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bloqueios de Horário</h1>
          <p className="text-muted-foreground">
            Gerencie os horários em que você não estará disponível
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Bloqueio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Criar Bloqueio</DialogTitle>
                <DialogDescription>
                  Defina o período em que você não estará disponível para atendimentos.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataInicio">Data Início</Label>
                    <Input
                      id="dataInicio"
                      type="date"
                      value={formData.dataInicio}
                      onChange={(e) =>
                        setFormData({ ...formData, dataInicio: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horaInicio">Hora Início</Label>
                    <Input
                      id="horaInicio"
                      type="time"
                      value={formData.horaInicio}
                      onChange={(e) =>
                        setFormData({ ...formData, horaInicio: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataFim">Data Fim</Label>
                    <Input
                      id="dataFim"
                      type="date"
                      value={formData.dataFim}
                      onChange={(e) =>
                        setFormData({ ...formData, dataFim: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horaFim">Hora Fim</Label>
                    <Input
                      id="horaFim"
                      type="time"
                      value={formData.horaFim}
                      onChange={(e) =>
                        setFormData({ ...formData, horaFim: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivo">Motivo (opcional)</Label>
                  <Textarea
                    id="motivo"
                    placeholder="Ex: Férias, consulta médica, etc."
                    value={formData.motivo}
                    onChange={(e) =>
                      setFormData({ ...formData, motivo: e.target.value })
                    }
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateDialog(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    "Criar Bloqueio"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Card */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-start gap-3 pt-6">
          <AlertTriangle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">Como funcionam os bloqueios</p>
            <p className="text-muted-foreground mt-1">
              Os bloqueios que você criar afetam apenas a sua agenda pessoal. Os clientes não poderão
              agendar horários com você durante os períodos bloqueados, mas outros profissionais
              continuarão disponíveis normalmente.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bloqueios Ativos/Futuros */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Bloqueios Ativos e Futuros</h2>
        {activeBlocks.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CalendarOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Você não possui bloqueios ativos ou futuros
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeBlocks.map((block) => (
              <Card key={block.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <CalendarOff className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {formatDateBR(block.data_inicio, "dd/MM/yyyy")}
                          {formatDateBR(block.data_inicio, "yyyy-MM-dd") !==
                            formatDateBR(block.data_fim, "yyyy-MM-dd") &&
                            ` - ${formatDateBR(block.data_fim, "dd/MM/yyyy")}`}
                        </span>
                        {isBlockActive(block) && (
                          <Badge variant="default">Ativo</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDateBR(block.data_inicio, "HH:mm")} às{" "}
                        {formatDateBR(block.data_fim, "HH:mm")}
                      </p>
                      {block.motivo && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {block.motivo}
                        </p>
                      )}
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
                      className="text-destructive hover:text-destructive"
                      onClick={() => openDeleteDialog(block)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Bloqueios Passados */}
      {pastBlocks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
            Bloqueios Passados
          </h2>
          <div className="grid gap-4 opacity-60">
            {pastBlocks.slice(0, 5).map((block) => (
              <Card key={block.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-secondary">
                      <CalendarOff className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <span className="font-medium">
                        {formatDateBR(block.data_inicio, "dd/MM/yyyy")}
                        {formatDateBR(block.data_inicio, "yyyy-MM-dd") !==
                          formatDateBR(block.data_fim, "yyyy-MM-dd") &&
                          ` - ${formatDateBR(block.data_fim, "dd/MM/yyyy")}`}
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {formatDateBR(block.data_inicio, "HH:mm")} às{" "}
                        {formatDateBR(block.data_fim, "HH:mm")}
                      </p>
                      {block.motivo && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {block.motivo}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => openDeleteDialog(block)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Dialog de Edição */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>Editar Bloqueio</DialogTitle>
              <DialogDescription>
                Atualize as informações do bloqueio.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editDataInicio">Data Início</Label>
                  <Input
                    id="editDataInicio"
                    type="date"
                    value={formData.dataInicio}
                    onChange={(e) =>
                      setFormData({ ...formData, dataInicio: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editHoraInicio">Hora Início</Label>
                  <Input
                    id="editHoraInicio"
                    type="time"
                    value={formData.horaInicio}
                    onChange={(e) =>
                      setFormData({ ...formData, horaInicio: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editDataFim">Data Fim</Label>
                  <Input
                    id="editDataFim"
                    type="date"
                    value={formData.dataFim}
                    onChange={(e) =>
                      setFormData({ ...formData, dataFim: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editHoraFim">Hora Fim</Label>
                  <Input
                    id="editHoraFim"
                    type="time"
                    value={formData.horaFim}
                    onChange={(e) =>
                      setFormData({ ...formData, horaFim: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editMotivo">Motivo (opcional)</Label>
                <Textarea
                  id="editMotivo"
                  placeholder="Ex: Férias, consulta médica, etc."
                  value={formData.motivo}
                  onChange={(e) =>
                    setFormData({ ...formData, motivo: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false);
                  resetForm();
                  setSelectedBlock(null);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Bloqueio</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este bloqueio? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedBlock(null);
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={processing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
