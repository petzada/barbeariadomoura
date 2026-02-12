import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-black text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAD8AC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#013648] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[#EAD8AC] text-[#013648] border border-black hover:brightness-110",
        gradient: "bg-gradient-to-r from-[#EAD8AC] to-[#C4B48A] text-[#013648] border border-black hover:brightness-110 shadow-[0_0_18px_rgba(234,216,172,0.28)]",
        destructive: "bg-[#013648] text-[#EAD8AC] border border-black hover:opacity-90",
        outline: "border border-black bg-transparent text-[#EAD8AC] hover:bg-[#EAD8AC] hover:text-[#013648]",
        secondary: "bg-[#013648] text-[#EAD8AC] border border-black hover:opacity-90",
        ghost: "text-[#EAD8AC] hover:bg-[#EAD8AC]/10",
        link: "text-[#EAD8AC] underline-offset-4 hover:underline",
        success: "bg-[#013648] text-[#EAD8AC] border border-black hover:opacity-90",
        warning: "bg-[#013648] text-[#EAD8AC] border border-black hover:opacity-90",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
        iconOnly: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Carregando...</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
