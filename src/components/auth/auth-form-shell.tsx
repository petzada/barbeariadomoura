import type { ReactNode } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthFormShellProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function AuthFormShell({
  title,
  description,
  children,
  footer,
  backHref,
  backLabel = "Voltar",
}: AuthFormShellProps) {
  return (
    <Card className="border-black bg-card">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {backHref && (
          <div className="pt-1">
            <Link
              href={backHref}
              className="text-sm text-[#EAD8AC]/70 transition-colors hover:text-[#EAD8AC]"
            >
              {backLabel}
            </Link>
          </div>
        )}
      </CardHeader>

      <CardContent>{children}</CardContent>
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </Card>
  );
}

