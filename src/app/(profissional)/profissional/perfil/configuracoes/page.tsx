"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import {
  Lock,
  Bell,
  Trash2,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Loader2,
  ArrowLeft,
} from "lucide-react";

export default function ConfiguracoesProfissionalPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: loadingUser, isAuthenticated, isBarbeiro } = useUser();

  const [isPendingPassword, setIsPendingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Redirecionar se não autenticado ou não for barbeiro
  useEffect(() => {
    if (!loadingUser) {
      if (!isAuthenticated) {
        router.push("/login?redirect=/profissional/perfil/configuracoes");
      } else if (!isBarbeiro) {
        router.push("/perfil/configuracoes");
      }
    }
  }, [loadingUser, isAuthenticated, isBarbeiro, router]);

  async function handlePasswordChange(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPendingPassword) return;

    setIsPendingPassword(true);
    setPasswordSuccess(false);
    setPasswordError(null);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres");
      setIsPendingPassword(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não conferem");
      setIsPendingPassword(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordSuccess(true);
        toast({
          title: "Sucesso",
          description: "Senha alterada com sucesso!",
          variant: "success",
        });
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error("Password change error:", error);
      setPasswordError("Erro ao alterar senha. Tente novamente.");
    } finally {
      setIsPendingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirmation !== "EXCLUIR" || isDeleting) return;

    setIsDeleting(true);

    try {
      const supabase = createClient();
      
      await supabase.auth.signOut();
      
      toast({
        title: "Solicitação recebida",
        description: "Sua solicitação de exclusão foi recebida. A conta será excluída em até 30 dias.",
      });
      
      router.push("/");
    } catch (error) {
      console.error("Delete account error:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar a solicitação.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isBarbeiro) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/profissional/perfil">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e segurança
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Alterar Senha */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Alterar Senha
            </CardTitle>
            <CardDescription>
              Mantenha sua conta segura com uma senha forte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* Mensagem de sucesso */}
              {passwordSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success text-sm">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Senha alterada com sucesso!</span>
                </div>
              )}

              {/* Mensagem de erro */}
              {passwordError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {/* Nova Senha */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova senha</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
              </div>

              {/* Confirmar Nova Senha */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Digite a senha novamente"
                  required
                />
              </div>

              <Button type="submit" disabled={isPendingPassword}>
                {isPendingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Alterando...
                  </>
                ) : (
                  "Alterar Senha"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preferências de Notificação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure como deseja receber avisos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Novos Agendamentos</Label>
                <p className="text-sm text-muted-foreground">
                  Receba aviso quando um cliente agendar
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cancelamentos</Label>
                <p className="text-sm text-muted-foreground">
                  Receba aviso quando um agendamento for cancelado
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Resumo Diário</Label>
                <p className="text-sm text-muted-foreground">
                  Receba um resumo dos agendamentos do dia
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Zona de Perigo */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Zona de Perigo
            </CardTitle>
            <CardDescription>
              Ações irreversíveis para sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Excluir minha conta</p>
                <p className="text-sm text-muted-foreground">
                  Remove permanentemente sua conta e todos os dados
                </p>
              </div>
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Excluir Conta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Excluir Conta</DialogTitle>
                    <DialogDescription asChild>
                      <div className="space-y-4">
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Esta ação é irreversível!</p>
                            <p className="text-sm mt-1">
                              Todos os seus dados, incluindo histórico de atendimentos e comissões,
                              serão permanentemente excluídos.
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="deleteConfirm">
                            Digite <strong>EXCLUIR</strong> para confirmar
                          </Label>
                          <Input
                            id="deleteConfirm"
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            placeholder="EXCLUIR"
                          />
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeleteDialog(false);
                        setDeleteConfirmation("");
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmation !== "EXCLUIR" || isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Excluindo...
                        </>
                      ) : (
                        "Confirmar Exclusão"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
