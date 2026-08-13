import {
  Building2,
  ShoppingBasket,
  Globe,
  Route,
  ClipboardList,
  Wrench,
  Truck,
  PawPrint,
  Receipt,
  UtensilsCrossed,
  BedDouble,
  Hammer,
  Factory,
  Handshake,
  Fingerprint,
  Smartphone,
  ClipboardCheck,
  BarChart3,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

export const solutionIcons: Record<string, LucideIcon> = {
  Building2,
  ShoppingBasket,
  Globe,
  Route,
  ClipboardList,
  Wrench,
  Truck,
  PawPrint,
  Receipt,
  UtensilsCrossed,
  BedDouble,
  Hammer,
  Factory,
  Handshake,
  Fingerprint,
  Smartphone,
  ClipboardCheck,
  BarChart3,
  CreditCard,
};

export function getSolutionIcon(iconKey: string): LucideIcon {
  return solutionIcons[iconKey] ?? Building2;
}
