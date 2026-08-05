import Image from "next/image";
import { getVendor, type VendorId } from "@/data/vendors";
import { cn } from "@/lib/utils";

export function VendorBadge({
  vendor,
  className,
  size = "default",
}: {
  vendor: VendorId;
  className?: string;
  size?: "default" | "sm";
}) {
  const v = getVendor(vendor);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-2xl border border-border/70 bg-card py-2.5 pr-4 pl-2.5",
        className
      )}
    >
      <span className="flex items-center justify-center rounded-xl bg-white px-3 py-2">
        <Image
          src={v.logo}
          alt={v.logoAlt}
          width={180}
          height={40}
          className={cn("w-auto", size === "sm" ? "h-5" : "h-6")}
        />
      </span>
      <span className="text-xs font-medium text-muted-foreground text-pretty">
        {v.tagline}
      </span>
    </div>
  );
}
