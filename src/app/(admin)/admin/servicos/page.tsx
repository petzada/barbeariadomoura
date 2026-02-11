"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import {
  Scissors,
  Plus,
  Pencil,
  Trash2,
  Clock,
  DollarSign,
  Loader2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface Service {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  duracao_minutos: number;
  ativo: boolean;
}

export default function AdminServicosPage() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [processing, setProcessing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form state
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [duracao, setDuracao] = useState("");

  // Carregar serviços
  useEffect(() => {
    async function loadServices() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("nome");

      if (!error && data) {
        setServices(data);
      }
      setLoading(false);
    }

    loadServices();
  }, []);

  // Abrir dialog para criar
  const openCreateDialog = () => {
    setEditing(null);
    setNome("");
    setDescricao("");
    setPreco("");
    setDuracao("");
    setShowDialog(true);
  };

  // Abrir dialog para editar
  const openEditDialog = (service: Service) => {
    setEditing(service);
    setNome(service.nome);
    setDescricao(service.descricao || "");
    setPreco(service.preco.toString());
    setDuracao(service.duracao_minutos.toString());
    setShowDialog(true);
  };

  // Salvar serviço
  const handleSave = async () => {
    if (!nome || !preco || !duracao) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    const supabase = createClient();

    try {
      const serviceData = {
        nome,
        descricao: descricao || null,
        preco: parseFloat(preco),
        duracao_minutos: parseInt(duracao),
      };

      if (editing) {
        const { error } = await supabase
          .from("services")
          .update(serviceData)
          .eq("id", editing.id);

        if (error) throw error;

        setServices((prev) =>
          prev.map((s) => (s.id === editing.id ? { ...s, ...serviceData } : s))
        );

        toast({
          title: "Sucesso",
          description: "Serviço atualizado com sucesso",
          variant: "success",
        });
      } else {
        const { data, error } = await supabase
          .from("services")
          .insert(serviceData)
          .select()
          .single();

        if (error) throw error;

        setServices((prev) => [...prev, data]);

        toast({
          title: "Sucesso",
          description: "Serviço criado com sucesso",
          variant: "success",
        });
      }

      setShowDialog(false);
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o serviço",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  // Alternar status ativo/inativo
  const toggleActive = async (service: Service) => {
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("services")
        .update({ ativo: !service.ativo })
        .eq("id", service.id);

      if (error) throw error;

      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, ativo: !s.ativo } : s))
      );

      toast({
        title: "Sucesso",
        description: `Serviço ${service.ativo ? "desativado" : "ativado"}`,
        variant: "success",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o serviço",
        variant: "destructive",
      });
    }
  };

  // Excluir serviço
  const handleDelete = async () => {
    if (!deleteId) return;

    setProcessing(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.from("services").delete().eq("id", deleteId);

      if (error) throw error;

      setServices((prev) => prev.filter((s) => s.id !== deleteId));
      setDeleteId(null);

      toast({
        title: "Sucesso",
        description: "Serviço excluído com sucesso",
        variant: "success",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o serviço. Ele pode estar em uso.",
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
          <h1 className="text-3xl font-bold">Serviços</h1>
          <p className="text-[#EAD8AC]">
            Gerencie os serviços oferecidos pela barbearia
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Serviço
        </Button>
      </div>

      {/* Lista de Serviços */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Serviços Cadastrados ({services.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12 text-[#EAD8AC]">
              <Scissors className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum serviço cadastrado</p>
              <Button className="mt-4" onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Serviço
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border ${
                    !service.ativo && "opacity-50"
                  }`}
                >
                  <div className="mb-4 sm:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{service.nome}</h3>
                      <Badge variant={service.ativo ? "success" : "secondary"}>
                        {service.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    {service.descricao && (
                      <p className="text-sm text-[#EAD8AC] mb-2">
                        {service.descricao}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-[#EAD8AC]">
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formatCurrency(service.preco)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duracao_minutos} min
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleActive(service)}
                      title={service.ativo ? "Desativar" : "Ativar"}
                    >
                      {service.ativo ? (
                        <ToggleRight className="h-5 w-5 text-[#EAD8AC]" />
                      ) : (
                        <ToggleLeft className="h-5 w-5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(service)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(service.id)}
                    >
                      <Trash2 className="h-4 w-4 text-[#EAD8AC]" />
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
              {editing ? "Editar Serviço" : "Novo Serviço"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Atualize as informações do serviço"
                : "Preencha os dados do novo serviço"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Corte de Cabelo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Corte masculino tradicional ou moderno"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preco">Preço (R$) *</Label>
                <Input
                  id="preco"
                  type="number"
                  min="0"
                  step="0.01"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  placeholder="45.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duracao">Duração (min) *</Label>
                <Input
                  id="duracao"
                  type="number"
                  min="5"
                  step="5"
                  value={duracao}
                  onChange={(e) => setDuracao(e.target.value)}
                  placeholder="30"
                />
              </div>
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
            <DialogTitle>Excluir Serviço</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este serviço? Esta ação não pode ser
              desfeita.
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


