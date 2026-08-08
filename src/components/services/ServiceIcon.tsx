import {
  MapPin,
  Search,
  Share2,
  Target,
  TrendingUp,
  Camera,
  ShoppingBag,
  Video,
  Palette,
  Code,
  LucideIcon
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  MapPin,
  Search,
  Share2,
  Target,
  TrendingUp,
  Camera,
  ShoppingBag,
  Video,
  Palette,
  Code
};

export function getServiceIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || Search;
}
