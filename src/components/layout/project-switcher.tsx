"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProjectStore } from "@/store/use-project-store";

// Selector de proyecto (preparado para multi-expediente; semilla = 1).
export function ProjectSwitcher() {
  const proyecto = useProjectStore((s) => s.proyecto);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex max-w-[260px] items-center gap-2 rounded-[10px] border border-border/60 bg-surface/60 px-3 py-1.5 text-left text-sm transition-colors hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-accent/12 text-accent">
          <Building2 className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-semibold leading-tight">
            {proyecto.nombre}
          </span>
          <span className="block truncate text-[11px] text-text-muted">
            {proyecto.ubicacion}
          </span>
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-text-muted" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[280px]">
        <DropdownMenuLabel>Expedientes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2">
          <Check className="size-4 text-accent" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{proyecto.nombre}</p>
            <p className="truncate text-xs text-text-muted">Caso piloto · activo</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="text-xs text-text-muted">
          + Importar otro expediente (próximamente)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
