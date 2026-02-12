import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div className={cn("container-landing", className)} {...props}>
      {children}
    </div>
  );
}

type SectionBg = "default" | "dark" | "darker";

const sectionBgMap: Record<SectionBg, string> = {
  default: "",
  dark: "bg-[#012A3A]",
  darker: "bg-[#011E2D]",
};

interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  bg?: SectionBg;
}

export function SectionWrapper({
  className,
  children,
  bg = "default",
  id,
  ...props
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn("section-landing", sectionBgMap[bg], className)}
      {...props}
    >
      {children}
    </section>
  );
}

interface SectionTitleProps {
  badge?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionTitle({
  badge,
  title,
  description,
  align = "center",
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "mb-10 md:mb-14",
        align === "center" && "text-center",
        className
      )}
    >
      {badge && (
        <span className="inline-block mb-3 px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-[#EAD8AC]/30 bg-[#EAD8AC]/10 text-[#EAD8AC]">
          {badge}
        </span>
      )}
      <h2 className="super-heading text-3xl sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {description && (
        <p className="super-subheading mt-3 max-w-2xl mx-auto">{description}</p>
      )}
    </div>
  );
}
