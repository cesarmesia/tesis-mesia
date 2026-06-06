import {
  LayoutDashboard,
  Scale,
  TriangleAlert,
  Layers,
  Network,
  SquareKanban,
  Gauge,
  MessageSquare,
  SlidersHorizontal,
  FolderOpen,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  group: "Análisis" | "Gestión" | "Sistema";
}

export const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, group: "Análisis" },
  { href: "/normas", label: "Por norma", icon: Scale, group: "Análisis" },
  { href: "/severidad", label: "Severidad", icon: TriangleAlert, group: "Análisis" },
  { href: "/especialidades", label: "Especialidades", icon: Layers, group: "Análisis" },
  { href: "/trazabilidad", label: "Trazabilidad", icon: Network, group: "Análisis" },
  { href: "/omisiones", label: "Omisiones (Kanban)", icon: SquareKanban, group: "Gestión" },
  { href: "/riesgo", label: "Riesgo (IRP)", icon: Gauge, group: "Gestión" },
  { href: "/chat", label: "Asistente", icon: MessageSquare, group: "Gestión" },
  { href: "/control", label: "Control", icon: SlidersHorizontal, group: "Sistema" },
  { href: "/expediente", label: "Expediente", icon: FolderOpen, group: "Sistema" },
];
