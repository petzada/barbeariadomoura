import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-[#EAD8AC]/20",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
