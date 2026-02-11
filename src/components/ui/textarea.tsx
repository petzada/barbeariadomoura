import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-black bg-[#013648] px-3 py-2 text-sm text-[#EAD8AC] placeholder:text-[#EAD8AC]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAD8AC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#013648] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };