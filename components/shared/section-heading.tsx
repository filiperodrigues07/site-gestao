import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: HeadingTag = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <Reveal>
          <span className="text-sm font-medium tracking-wide text-primary uppercase">
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <HeadingTag className="mt-3 font-heading text-display-3 font-medium text-balance">
          {title}
        </HeadingTag>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
