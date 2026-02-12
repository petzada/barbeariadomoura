"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

type AvatarStatus = "online" | "busy" | "offline" | "none";
type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  status?: AvatarStatus;
  size?: AvatarSize;
}

const avatarSizeClasses: Record<AvatarSize, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, status = "none", size = "md", ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex shrink-0 overflow-hidden rounded-full border border-black/60",
      avatarSizeClasses[size],
      className
    )}
    {...props}
  >
    {status !== "none" && (
      <span
        className={cn(
          "absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border border-black",
          status === "online" && "bg-[#22C55E]",
          status === "busy" && "bg-[#F59E0B]",
          status === "offline" && "bg-[#64748B]"
        )}
      />
    )}
  </AvatarPrimitive.Root>
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-[#EAD8AC] text-sm font-medium text-[#013648]",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  limit?: number;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, children, limit = 4, ...props }, ref) => {
    const items = React.Children.toArray(children);
    const visibleItems = items.slice(0, limit);
    const remaining = items.length - visibleItems.length;

    return (
      <div ref={ref} className={cn("flex -space-x-3", className)} {...props}>
        {visibleItems.map((item, index) => (
          <div key={index} className="ring-2 ring-[#013648] rounded-full">
            {item}
          </div>
        ))}
        {remaining > 0 && (
          <div className="h-10 w-10 rounded-full border border-black/60 bg-[#013648] text-[#EAD8AC] text-xs font-semibold flex items-center justify-center ring-2 ring-[#013648]">
            +{remaining}
          </div>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup };
