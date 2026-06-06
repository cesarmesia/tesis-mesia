"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Hydrated } from "@/components/shared/hydrated";
import { TraceTable } from "@/components/trace/trace-table";

function TrazabilidadInner() {
  const params = useSearchParams();
  const focus = params.get("focus");
  return <TraceTable focusId={focus} />;
}

export default function TrazabilidadPage() {
  return (
    <div>
      <PageHeader
        title="Trazabilidad"
        description="Cada hallazgo enlaza requisito ↔ página del expediente ↔ fragmento normativo. Búsqueda, filtros y exportación (R3, R5)."
      />
      <Hydrated>
        <React.Suspense>
          <TrazabilidadInner />
        </React.Suspense>
      </Hydrated>
    </div>
  );
}
