import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-black bg-black/50 backdrop-blur-sm px-4 py-2 text-sm text-[#EAD8AC] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#EAD8AC] placeholder:text-[#EAD8AC]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAD8AC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#013648] disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-black focus-visible:ring-[#EAD8AC]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
