import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-black px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#EAD8AC] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-[#EAD8AC] text-[#013648] border border-black",
        secondary: "bg-[#013648] text-[#EAD8AC] border border-black",
        destructive: "bg-[#013648] text-[#EAD8AC] border border-black",
        outline: "text-[#EAD8AC] border border-black",
        success: "bg-[#013648] text-[#EAD8AC] border border-black",
        warning: "bg-[#013648] text-[#EAD8AC] border border-black",
        info: "bg-[#013648] text-[#EAD8AC] border border-black",
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
