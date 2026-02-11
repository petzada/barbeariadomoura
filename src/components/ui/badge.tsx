import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-black px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#EAD8AC] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-black/50 backdrop-blur-sm text-[#EAD8AC] border border-black",
        secondary: "bg-black/50 backdrop-blur-sm text-[#EAD8AC] border border-black",
        destructive: "bg-black/50 backdrop-blur-sm text-[#EAD8AC] border border-black",
        outline: "text-[#EAD8AC] border border-black",
        success: "bg-black/50 backdrop-blur-sm text-[#EAD8AC] border border-black",
        warning: "bg-black/50 backdrop-blur-sm text-[#EAD8AC] border border-black",
        info: "bg-black/50 backdrop-blur-sm text-[#EAD8AC] border border-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
