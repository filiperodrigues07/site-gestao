import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

export function IconBadge({
  icon: Icon,
  className,
  iconClassName,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary",
        className
      )}
    >
      <Icon className={cn("size-5", iconClassName)} strokeWidth={1.75} />
    </div>
  );
}
