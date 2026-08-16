import { cn } from "@/lib/utils";

export function TechGridBackground({
  className,
  glow = "top",
}: {
  className?: string;
  glow?: "top" | "center" | "none";
}) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10", className)}>
      {glow !== "none" && (
        <div
          className={cn(
            "absolute inset-x-0 h-[700px] bg-[radial-gradient(ellipse_at_top,var(--brand-blue-700),transparent_65%)] opacity-60",
            glow === "top" ? "top-0" : "top-1/2 -translate-y-1/2"
          )}
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(0_0_0/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.06)_1px,transparent_1px)] bg-size-[64px_64px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_0%,black,transparent)] dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.08)_1px,transparent_1px)]" />
    </div>
  );
}
