import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("super-surface text-center py-10 px-4", className)}>
      <Icon className="h-10 w-10 mx-auto text-[#EAD8AC]/75 mb-3" />
      <p className="font-semibold">{title}</p>
      {description && <p className="text-sm text-[#EAD8AC]/75 mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

