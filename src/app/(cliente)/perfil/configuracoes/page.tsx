"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Loader2,
  Lock,
  ShieldAlert,
  Trash2,
} from "lucide-react";

export default function ConfiguracoesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: loadingUser, isAuthenticated } = useUser();

  const [isPendingPassword, setIsPendingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!loadingUser && !isAuthenticated) {
      router.push("/login?redirect=/perfil/configuracoes");
    }
  }, [loadingUser, isAuthenticated, router]);

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
      setPasswordError("As senhas nao conferem");
      setIsPendingPassword(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });

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
    } catch {
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
        title: "Solicitacao recebida",
        description: "Sua solicitacao de exclusao foi recebida. A conta sera excluida em ate 30 dias.",
      });

      router.push("/");
    } catch {
      toast({
        title: "Erro",
        description: "Nao foi possivel processar a solicitacao.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  if (loadingUser) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#EAD8AC]" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-[#013648] pb-8">
      <section className="bg-gradient-to-b from-black/20 to-transparent py-8 md:py-10">
        <div className="container-app">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#EAD8AC]/60">Seguranca e privacidade</p>
              <h1 className="text-4xl font-bold tracking-tight">Configuracoes</h1>
              <p className="text-[#EAD8AC]/70">Controle sua conta e preferencias</p>
            </div>
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="/perfil">Voltar ao perfil</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container-app space-y-6">
        <Card className="rounded-3xl border-black bg-black/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Lock className="h-5 w-5" />
              Alterar Senha
            </CardTitle>
            <CardDescription>Mantenha sua conta protegida com uma senha forte.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {passwordSuccess && (
                <div className="flex items-center gap-2 rounded-lg bg-green-500/20 p-3 text-sm text-green-300">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Senha alterada com sucesso!</span>
                </div>
              )}

              {passwordError && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/20 p-3 text-sm text-red-300">
                  <AlertCircle className="h-4 w-4" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova senha</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="Minimo 6 caracteres"
                  required
                  minLength={6}
                />
              </div>

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

              <Button type="submit" disabled={isPendingPassword} className="h-11 px-6">
                {isPendingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Alterando...
                  </>
                ) : (
                  "Alterar senha"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-black bg-black/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Bell className="h-5 w-5" />
              Notificacoes
            </CardTitle>
            <CardDescription>Escolha como deseja receber lembretes e avisos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Lembretes por email</p>
                <p className="text-sm text-[#EAD8AC]/70">Receba lembretes de agendamento por email</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Lembretes por SMS</p>
                <p className="text-sm text-[#EAD8AC]/70">Receba lembretes de agendamento por SMS</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Promocoes e novidades</p>
                <p className="text-sm text-[#EAD8AC]/70">Receba ofertas especiais e comunicados</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-black bg-black/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Trash2 className="h-5 w-5" />
              Zona de Perigo
            </CardTitle>
            <CardDescription>Acao irreversivel sobre sua conta.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 rounded-2xl border border-black p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">Excluir minha conta</p>
                <p className="text-sm text-[#EAD8AC]/70">
                  Remove permanentemente seus dados e historico.
                </p>
              </div>

              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Excluir conta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Excluir conta</DialogTitle>
                    <DialogDescription asChild>
                      <div className="space-y-4">
                        <div className="flex items-start gap-2 rounded-lg bg-[#EAD8AC]/10 p-3 text-[#EAD8AC]">
                          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Esta acao e irreversivel.</p>
                            <p className="mt-1 text-sm">
                              Todos os dados da conta serao removidos permanentemente.
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="deleteConfirm">Digite EXCLUIR para confirmar</Label>
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
                        "Confirmar exclusao"
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
