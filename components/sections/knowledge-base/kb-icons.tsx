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

export const KB_ICON_KEYS = ["Rocket", "Banknote", "ShieldCheck", "Package", "ShoppingCart", "Plug"] as const;
export type KbIconKey = (typeof KB_ICON_KEYS)[number];

export function getKbIcon(iconKey: string): LucideIcon {
  return kbIcons[iconKey] ?? Package;
}
