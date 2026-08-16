import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LOGO_HEIGHT = {
  default: { base: "h-[155px]", scrolled: "h-16" },
  lg: { base: "h-[155px]", scrolled: "h-[155px]" },
} as const;

export function Logo({
  className,
  scrolled = false,
  size = "default",
}: {
  className?: string;
  scrolled?: boolean;
  size?: "default" | "lg";
}) {
  return (
    <Link
      href="/"
      aria-label="Gestão Consultorias & Sistemas Integrados — página inicial"
      className={cn("flex items-center", className)}
    >
      <Image
        src="/logo-light.png"
        alt="Gestão Consultorias & Sistemas Integrados"
        width={800}
        height={800}
        priority
        className={cn(
          "w-auto transition-all duration-300 dark:hidden",
          scrolled ? LOGO_HEIGHT[size].scrolled : LOGO_HEIGHT[size].base
        )}
      />
      <Image
        src="/logo.png"
        alt="Gestão Consultorias & Sistemas Integrados"
        width={800}
        height={800}
        priority
        className={cn(
          "hidden w-auto transition-all duration-300 dark:block",
          scrolled ? LOGO_HEIGHT[size].scrolled : LOGO_HEIGHT[size].base
        )}
      />
    </Link>
  );
}
