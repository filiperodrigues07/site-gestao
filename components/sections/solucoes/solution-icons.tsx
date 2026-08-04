import {
  Building2,
  ShoppingCart,
  ShoppingBasket,
  Globe,
  TrendingUp,
  ClipboardList,
  Wrench,
  Truck,
  PawPrint,
  Banknote,
  UtensilsCrossed,
  BedDouble,
  Hammer,
  Factory,
  Users,
  type LucideIcon,
} from "lucide-react";

export const solutionIcons: Record<string, LucideIcon> = {
  Building2,
  ShoppingCart,
  ShoppingBasket,
  Globe,
  TrendingUp,
  ClipboardList,
  Wrench,
  Truck,
  PawPrint,
  Banknote,
  UtensilsCrossed,
  BedDouble,
  Hammer,
  Factory,
  Users,
};

export function getSolutionIcon(iconKey: string): LucideIcon {
  return solutionIcons[iconKey] ?? Building2;
}
