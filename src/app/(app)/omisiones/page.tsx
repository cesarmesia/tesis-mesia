"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Hydrated } from "@/components/shared/hydrated";
import { KanbanBoard } from "@/components/kanban/board";
import { IRPBadge } from "@/components/irp/irp-badge";

function OmisionesInner() {
  const params = useSearchParams();
  const focus = params.get("focus");
  return <KanbanBoard focusId={focus} />;
}

export default function OmisionesPage() {
  return (
    <div>
      <PageHeader
        title="Omisiones — Tablero Kanban"
        description="Controla el ciclo de vida de cada no conformidad: Por revisar → En corrección → Subsanado → Verificado. Mover a subsanado/verificado reduce el IRP en vivo."
      >
        <IRPBadge />
      </PageHeader>
      <Hydrated fallback={<div className="h-96 animate-pulse rounded-lg bg-surface-2" />}>
        <React.Suspense>
          <OmisionesInner />
        </React.Suspense>
      </Hydrated>
    </div>
  );
}
