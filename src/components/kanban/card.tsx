"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { SeveridadPill } from "@/components/shared/pills";
import { severidadColor } from "@/lib/kpis";
import { especialidadLabel } from "@/lib/format";
import type { Hallazgo } from "@/types";
import { cn } from "@/lib/utils";

export function KanbanCardView({
  h,
  onOpen,
  dragging,
  listeners,
  attributes,
  setActivatorNodeRef,
}: {
  h: Hallazgo;
  onOpen?: () => void;
  dragging?: boolean;
  listeners?: any;
  attributes?: any;
  setActivatorNodeRef?: (el: HTMLElement | null) => void;
}) {
  const inicial = (h.responsable ?? "··")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      onClick={onOpen}
      className={cn(
        "group relative cursor-pointer rounded-[12px] border border-border/50 bg-surface p-3 shadow-sm transition-shadow hover:shadow-md",
        dragging && "opacity-50",
      )}
      style={{ borderLeft: `3px solid ${severidadColor(h.severidad)}` }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug line-clamp-2">{h.titulo}</p>
        <button
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
          onClick={(e) => e.stopPropagation()}
          aria-label="Mover tarjeta"
          className="shrink-0 cursor-grab touch-none text-text-muted/50 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <Badge variant="outline" className="text-[10px]">
          {h.norma}
        </Badge>
        <SeveridadPill severidad={h.severidad} />
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-[11px] text-text-muted">
          {especialidadLabel[h.especialidad]} · p.{h.citaExpediente.pagina}
        </span>
        <Avatar className="size-6">
          <AvatarFallback className="text-[9px]">{inicial}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

export function SortableKanbanCard({
  h,
  onOpen,
}: {
  h: Hallazgo;
  onOpen: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: h.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <KanbanCardView
        h={h}
        onOpen={onOpen}
        dragging={isDragging}
        listeners={listeners}
        attributes={attributes}
        setActivatorNodeRef={setActivatorNodeRef}
      />
    </div>
  );
}
