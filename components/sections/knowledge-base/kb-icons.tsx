import {
  Rocket,
  Banknote,
  ShieldCheck,
  Package,
  ShoppingCart,
  Plug,
  type LucideIcon,
} from "lucide-react";

const kbIcons: Record<string, LucideIcon> = {
  Rocket,
  Banknote,
  ShieldCheck,
  Package,
  ShoppingCart,
  Plug,
};

export function getKbIcon(iconKey: string): LucideIcon {
  return kbIcons[iconKey] ?? Package;
}
