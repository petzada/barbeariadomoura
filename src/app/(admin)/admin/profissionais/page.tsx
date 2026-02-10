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
import { getInitials, cn } from "@/lib/utils";
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Clock,
  Mail,
  Phone,
  CheckCircle,
} from "lucide-react";

interface Professional {
  id: string;
  user_id: string;
  bio: string | null;
  foto_url: string | null;
  ativo: boolean;
  user: {
    nome: string;
    email: string;
    telefone: string | null;
    avatar_url: string | null;
  } | null;
}

interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  avatar_url: string | null;
  role: string;
}

interface ProfessionalHour {
  id: string;
  profissional_id: string;
  dia_semana: number;
  abertura: string;
  fechamento: string;
  ativo: boolean;
}

const diasSemana = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
];

export default function AdminProfissionaisPage() {
  const { toast } = useToast();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showHoursDialog, setShowHoursDialog] = useState(false);
  const [editing, setEditing] = useState<Professional | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [professionalHours, setProfessionalHours] = useState<ProfessionalHour[]>([]);
  const [processing, setProcessing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [selectedUserId, setSelectedUserId] = useState("");
  const [bio, setBio] = useState("");
  const [userSearch, setUserSearch] = useState("");

  // Hours form state
  const [selectedDia, setSelectedDia] = useState<number>(1);
  const [horaAbertura, setHoraAbertura] = useState("09:00");
  const [horaFechamento, setHoraFechamento] = useState("18:00");

  // Carregar profissionais
  useEffect(() => {
    async function loadData() {
      const supabase = createClient();

      // Carregar profissionais com dados do usuário
      const { data: profsData, error: profsError } = await supabase
        .from("professionals")
        .select(`
          id,
          user_id,
          bio,
          foto_url,
          ativo,
          user:users!professionals_user_id_fkey(nome, email, telefone, avatar_url)
        `)
        .order("created_at", { ascending: false });

      if (!profsError && profsData) {
        const transformed = profsData.map((item: any) => ({
          ...item,
          user: Array.isArray(item.user) ? item.user[0] ?? null : item.user,
        })) as Professional[];
        setProfessionals(transformed);
      }

      // Carregar todos os usuários para busca
      const { data: usersData } = await supabase
        .from("users")
        .select("id, nome, email, telefone, avatar_url, role")
        .order("nome");

      if (usersData) {
        // Filtrar usuários que já são profissionais
        const existingUserIds = profsData?.map(p => p.user_id) || [];
        const available = usersData.filter(u => !existingUserIds.includes(u.id));
        setAvailableUsers(available);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  // Abrir dialog para criar
  const openCreateDialog = () => {
    setEditing(null);
    setSelectedUserId("");
    setBio("");
    setShowDialog(true);
  };

  // Abrir dialog para editar
  const openEditDialog = (professional: Professional) => {
    setEditing(professional);
    setSelectedUserId(professional.user_id);
    setBio(professional.bio || "");
    setShowDialog(true);
  };

  // Abrir dialog de horários
  const openHoursDialog = async (professional: Professional) => {
    setSelectedProfessional(professional);
    const supabase = createClient();

    const { data } = await supabase
      .from("professional_hours")
      .select("*")
      .eq("profissional_id", professional.id)
      .order("dia_semana");

    if (data) {
      setProfessionalHours(data);
    }
    setShowHoursDialog(true);
  };

  // Salvar profissional
  const handleSave = async () => {
    if (!editing && !selectedUserId) {
      toast({
        title: "Erro",
        description: "Selecione um usuário para vincular",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    const supabase = createClient();

    try {
      if (editing) {
        const { error } = await supabase
          .from("professionals")
          .update({ bio: bio || null })
          .eq("id", editing.id);

        if (error) throw error;

        setProfessionals((prev) =>
          prev.map((p) => (p.id === editing.id ? { ...p, bio: bio || null } : p))
        );

        toast({
          title: "Sucesso",
          description: "Profissional atualizado com sucesso",
          variant: "success",
        });
      } else {
        const { data, error } = await supabase
          .from("professionals")
          .insert({
            user_id: selectedUserId,
            bio: bio || null,
          })
          .select(`
            id,
            user_id,
            bio,
            foto_url,
            ativo,
            user:users!professionals_user_id_fkey(nome, email, telefone, avatar_url)
          `)
          .single();

        if (error) throw error;

        // Atualizar role do usuário para barbeiro
        await supabase
          .from("users")
          .update({ role: "barbeiro" })
          .eq("id", selectedUserId);

        // Transformar dados para formato correto
        const transformedData = {
          ...data,
          user: Array.isArray(data.user) ? data.user[0] ?? null : data.user,
        } as Professional;
        setProfessionals((prev) => [transformedData, ...prev]);

        // Remover usuário da lista de disponíveis
        setAvailableUsers((prev) => prev.filter(u => u.id !== selectedUserId));

        toast({
          title: "Sucesso",
          description: "Profissional cadastrado com sucesso",
          variant: "success",
        });
      }

      setShowDialog(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Não foi possível salvar o profissional";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Alternar status ativo/inativo
  const toggleActive = async (professional: Professional) => {
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("professionals")
        .update({ ativo: !professional.ativo })
        .eq("id", professional.id);

      if (error) throw error;

      setProfessionals((prev) =>
        prev.map((p) => (p.id === professional.id ? { ...p, ativo: !p.ativo } : p))
      );

      toast({
        title: "Sucesso",
        description: `Profissional ${professional.ativo ? "desativado" : "ativado"}`,
        variant: "success",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o profissional",
        variant: "destructive",
      });
    }
  };

  // Adicionar horário de trabalho
  const handleAddHour = async () => {
    if (!selectedProfessional) return;

    setProcessing(true);
    const supabase = createClient();

    try {
      // Verificar se já existe horário para este dia
      const existingHour = professionalHours.find(h => h.dia_semana === selectedDia);

      if (existingHour) {
        // Atualizar horário existente
        const { error } = await supabase
          .from("professional_hours")
          .update({
            abertura: horaAbertura,
            fechamento: horaFechamento,
            ativo: true,
          })
          .eq("id", existingHour.id);

        if (error) throw error;

        setProfessionalHours((prev) =>
          prev.map((h) => h.id === existingHour.id ? {
            ...h,
            abertura: horaAbertura,
            fechamento: horaFechamento,
            ativo: true,
          } : h)
        );
      } else {
        // Criar novo horário
        const { data, error } = await supabase
          .from("professional_hours")
          .insert({
            profissional_id: selectedProfessional.id,
            dia_semana: selectedDia,
            abertura: horaAbertura,
            fechamento: horaFechamento,
          })
          .select()
          .single();

        if (error) throw error;

        setProfessionalHours((prev) => [...prev, data].sort((a, b) => a.dia_semana - b.dia_semana));
      }

      toast({
        title: "Sucesso",
        description: "Horário salvo com sucesso",
        variant: "success",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o horário",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Remover horário de trabalho
  const handleRemoveHour = async (hourId: string) => {
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("professional_hours")
        .delete()
        .eq("id", hourId);

      if (error) throw error;

      setProfessionalHours((prev) => prev.filter(h => h.id !== hourId));

      toast({
        title: "Sucesso",
        description: "Horário removido",
        variant: "success",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível remover o horário",
        variant: "destructive",
      });
    }
  };

  // Excluir profissional
  const handleDelete = async () => {
    if (!deleteId) return;

    setProcessing(true);
    const supabase = createClient();

    try {
      // Buscar o profissional para obter o user_id antes de deletar
      const profToDelete = professionals.find(p => p.id === deleteId);

      const { error } = await supabase.from("professionals").delete().eq("id", deleteId);

      if (error) throw error;

      // Reverter role do usuário para cliente
      if (profToDelete) {
        await supabase
          .from("users")
          .update({ role: "cliente" })
          .eq("id", profToDelete.user_id);
      }

      setProfessionals((prev) => prev.filter((p) => p.id !== deleteId));

      // Adicionar usuário de volta à lista de disponíveis
      if (profToDelete) {
        setAvailableUsers((prev) => [...prev, {
          id: profToDelete.user_id,
          nome: profToDelete.user?.nome ?? "Profissional",
          email: profToDelete.user?.email ?? "",
          telefone: profToDelete.user?.telefone ?? null,
          avatar_url: profToDelete.user?.avatar_url ?? null,
          role: "cliente",
        }]);
      }

      setDeleteId(null);

      toast({
        title: "Sucesso",
        description: "Profissional removido com sucesso",
        variant: "success",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o profissional. Ele pode ter agendamentos.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Profissionais</h1>
          <p className="text-muted-foreground">
            Gerencie os barbeiros e seus horários de trabalho
          </p>
        </div>
        <Button onClick={openCreateDialog} disabled={availableUsers.length === 0}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Profissional
        </Button>
      </div>

      {/* Lista de Profissionais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Profissionais Cadastrados ({professionals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : professionals.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum profissional cadastrado</p>
              <Button className="mt-4" onClick={openCreateDialog} disabled={availableUsers.length === 0}>
                <Plus className="mr-2 h-4 w-4" />
                Cadastrar Primeiro Profissional
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {professionals.map((professional) => (
                <div
                  key={professional.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border ${!professional.ativo && "opacity-50"
                    }`}
                >
                  <div className="flex items-start gap-4 mb-4 sm:mb-0">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={professional?.foto_url || professional?.user?.avatar_url || undefined}
                        alt={professional?.user?.nome ?? "Profissional"}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(professional?.user?.nome ?? "P")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{professional?.user?.nome ?? "Profissional"}</h3>
                        <Badge variant={professional.ativo ? "success" : "secondary"}>
                          {professional.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      {professional.bio && (
                        <p className="text-sm text-muted-foreground mb-2 max-w-md">
                          {professional.bio}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {professional?.user?.email}
                        </span>
                        {professional?.user?.telefone && (
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {professional?.user?.telefone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openHoursDialog(professional)}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Horários
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleActive(professional)}
                      title={professional.ativo ? "Desativar" : "Ativar"}
                    >
                      {professional.ativo ? (
                        <ToggleRight className="h-5 w-5 text-success" />
                      ) : (
                        <ToggleLeft className="h-5 w-5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(professional)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(professional.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Criar/Editar */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar Profissional" : "Novo Profissional"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Atualize as informações do profissional"
                : "Vincule um usuário como profissional da barbearia"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {!editing && (
              <div className="space-y-2">
                <Label htmlFor="user">Usuário *</Label>
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="mb-2"
                />
                <div className="max-h-48 overflow-y-auto border rounded-lg">
                  {availableUsers
                    .filter((u) => {
                      const search = userSearch.toLowerCase();
                      return (
                        u.nome.toLowerCase().includes(search) ||
                        u.email.toLowerCase().includes(search)
                      );
                    })
                    .map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setSelectedUserId(u.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-secondary",
                          selectedUserId === u.id && "bg-primary/10 border-l-2 border-primary"
                        )}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={u.avatar_url || undefined} alt={u.nome} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {getInitials(u.nome)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{u.nome}</p>
                          <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                        </div>
                        {selectedUserId === u.id && (
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  {availableUsers.filter((u) => {
                    const search = userSearch.toLowerCase();
                    return (
                      u.nome.toLowerCase().includes(search) ||
                      u.email.toLowerCase().includes(search)
                    );
                  }).length === 0 && (
                      <p className="p-3 text-sm text-muted-foreground text-center">
                        Nenhum usuário encontrado
                      </p>
                    )}
                </div>
                {availableUsers.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Não há usuários disponíveis para vincular.
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Ex: Especialista em cortes modernos e degradê"
                rows={3}
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

      {/* Dialog de Horários */}
      <Dialog open={showHoursDialog} onOpenChange={setShowHoursDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Horários de {selectedProfessional?.user?.nome}
            </DialogTitle>
            <DialogDescription>
              Configure os horários de trabalho deste profissional
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Formulário de adicionar horário */}
            <div className="p-4 border rounded-lg space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Dia</Label>
                  <Select
                    value={selectedDia.toString()}
                    onValueChange={(v) => setSelectedDia(parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {diasSemana.map((dia) => (
                        <SelectItem key={dia.value} value={dia.value.toString()}>
                          {dia.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Abertura</Label>
                  <Input
                    type="time"
                    value={horaAbertura}
                    onChange={(e) => setHoraAbertura(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fechamento</Label>
                  <Input
                    type="time"
                    value={horaFechamento}
                    onChange={(e) => setHoraFechamento(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleAddHour} disabled={processing} className="w-full">
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar/Atualizar Horário
                  </>
                )}
              </Button>
            </div>

            {/* Lista de horários */}
            <div className="space-y-2">
              <Label>Horários Configurados</Label>
              {professionalHours.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Nenhum horário configurado
                </p>
              ) : (
                <div className="space-y-2">
                  {professionalHours.map((hour) => (
                    <div
                      key={hour.id}
                      className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                    >
                      <div>
                        <span className="font-medium">
                          {diasSemana.find(d => d.value === hour.dia_semana)?.label}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          {hour.abertura.slice(0, 5)} - {hour.fechamento.slice(0, 5)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveHour(hour.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowHoursDialog(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Profissional</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este profissional? Todo o histórico de
              agendamentos será mantido para consulta, porém ele não poderá mais
              receber novos agendamentos.
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
