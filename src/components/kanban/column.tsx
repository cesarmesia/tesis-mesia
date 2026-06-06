"use client";

import * as React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Inbox } from "lucide-react";
import { SortableKanbanCard } from "@/components/kanban/card";
import type { EstadoKanban, Hallazgo } from "@/types";
import { estadoLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

const accentByEstado: Record<EstadoKanban, string> = {
  por_revisar: "bg-fail",
  en_correccion: "bg-observed",
  subsanado: "bg-accent",
  verificado: "bg-ok",
};

export function KanbanColumn({
  estado,
  hallazgos,
  onOpenCard,
  wipLimit,
}: {
  estado: EstadoKanban;
  hallazgos: Hallazgo[];
  onOpenCard: (h: Hallazgo) => void;
  wipLimit?: number;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: estado });

  const peso = hallazgos.reduce(
    (a, h) => a + (h.severidad === "critica" ? 5 : h.severidad === "mayor" ? 3 : 1),
    0,
  );
  const overLimit = wipLimit != null && hallazgos.length > wipLimit;

  return (
    <div className="flex min-w-[280px] flex-1 flex-col">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={cn("size-2 rounded-full", accentByEstado[estado])} />
          <h3 className="text-sm font-semibold">{estadoLabel[estado]}</h3>
          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium tabular-nums text-text-muted">
            {hallazgos.length}
            {wipLimit != null && `/${wipLimit}`}
          </span>
        </div>
        <span
          className={cn(
            "text-[11px] tabular-nums",
            overLimit ? "font-semibold text-fail" : "text-text-muted",
          )}
        >
          peso {peso}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-[200px] flex-1 flex-col gap-2.5 rounded-lg border border-dashed border-transparent bg-surface-2/30 p-2.5 transition-colors",
          isOver && "border-accent/40 bg-accent/5",
        )}
      >
        <SortableContext
          items={hallazgos.map((h) => h.id)}
          strategy={verticalListSortingStrategy}
        >
          {hallazgos.map((h) => (
            <SortableKanbanCard key={h.id} h={h} onOpen={() => onOpenCard(h)} />
          ))}
        </SortableContext>

        {hallazgos.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-1.5 py-8 text-center text-text-muted">
            <Inbox className="size-5 opacity-50" />
            <p className="text-xs">Arrastra tarjetas aquí</p>
          </div>
        )}
      </div>
    </div>
  );
}
