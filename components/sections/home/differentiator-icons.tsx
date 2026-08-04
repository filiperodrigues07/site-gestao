import {
  Rocket,
  Compass,
  GraduationCap,
  LifeBuoy,
  HeartHandshake,
  ShieldCheck,
  Zap,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

const differentiatorIcons: Record<string, LucideIcon> = {
  Rocket,
  Compass,
  GraduationCap,
  LifeBuoy,
  HeartHandshake,
  ShieldCheck,
  Zap,
  BarChart3,
};

export function getDifferentiatorIcon(iconKey: string): LucideIcon {
  return differentiatorIcons[iconKey] ?? Zap;
}
