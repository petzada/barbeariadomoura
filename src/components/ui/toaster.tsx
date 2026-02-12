"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type ToasterPosition = "top-right" | "top-center" | "bottom-right" | "bottom-center";

const viewportByPosition: Record<ToasterPosition, string> = {
  "top-right": "top-0 right-0 sm:top-0 sm:right-0 sm:bottom-auto",
  "top-center": "top-0 left-1/2 -translate-x-1/2 sm:top-0 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto sm:bottom-auto",
  "bottom-right": "bottom-0 right-0 sm:bottom-0 sm:right-0 sm:top-auto",
  "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 sm:bottom-0 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto sm:top-auto",
};

export function Toaster({ position = "bottom-right" }: { position?: ToasterPosition }) {
  const { toasts } = useToast();

  return (
    <ToastProvider duration={3000}>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport className={cn(viewportByPosition[position])} />
    </ToastProvider>
  );
}
