"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Hydrated } from "@/components/shared/hydrated";
import { SpecialtyRadar } from "@/components/charts/specialty-radar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useProjectStore } from "@/store/use-project-store";
import { especialidadLabel } from "@/lib/format";
import type { Especialidad } from "@/types";
import { Clock, ScanLine } from "lucide-react";

function EspecialidadesContent() {
  const hallazgos = useProjectStore((s) => s.hallazgos);
  const documentos = useProjectStore((s) => s.documentos);

  const especialidades = Array.from(new Set(documentos.map((d) => d.tipo))) as Especialidad[];

  const porEspecialidad = especialidades.map((esp) => {
    const docs = documentos.filter((d) => d.tipo === esp);
    const nc = hallazgos.filter((h) => h.especialidad === esp);
    return {
      esp,
      docs: docs.length,
      paginas: docs.reduce((a, d) => a + d.paginas, 0),
      segundos: docs.reduce((a, d) => a + d.segundosProceso, 0),
      nc: nc.length,
      criticas: nc.filter((h) => h.severidad === "critica").length,
    };
  });

  const maxSeg = Math.max(...documentos.map((d) => d.segundosProceso), 1);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>No conformidades por especialidad</CardTitle>
        </CardHeader>
        <CardContent>
          <SpecialtyRadar />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Desempeño por tipo de documento</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {porEspecialidad.map((e) => (
            <div
              key={e.esp}
              className="flex items-center justify-between rounded-lg border border-border/40 bg-surface-2/30 p-3"
            >
              <div className="min-w-0">
                <p className="font-medium">{especialidadLabel[e.esp]}</p>
                <p className="text-xs text-text-muted">
                  {e.docs} doc(s) · {e.paginas} págs · {e.segundos}s de proceso
                </p>
              </div>
              <div className="flex items-center gap-2">
                {e.criticas > 0 && <Badge variant="critica">{e.criticas} crít.</Badge>}
                <Badge variant="secondary">{e.nc} NC</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Tiempo de proceso por documento</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {documentos.map((d) => (
            <div key={d.id} className="rounded-lg border border-border/40 bg-surface-2/30 p-3">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="min-w-0 truncate text-sm font-medium">{d.nombre}</span>
                <span className="flex shrink-0 items-center gap-1 text-xs text-text-muted">
                  <Clock className="size-3" /> {d.segundosProceso}s
                </span>
              </div>
              <Progress value={(d.segundosProceso / maxSeg) * 100} />
              <div className="mt-1.5 flex items-center gap-2 text-[11px] text-text-muted">
                <span>{d.paginas} págs</span>
                {d.requiereOCR && (
                  <Badge variant="observed" className="px-1.5 py-0">
                    <ScanLine className="size-2.5" /> OCR
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function EspecialidadesPage() {
  return (
    <div>
      <PageHeader
        title="Desempeño por especialidad"
        description="No conformidades y tiempos de proceso por tipo de documento del expediente."
      />
      <Hydrated>
        <EspecialidadesContent />
      </Hydrated>
    </div>
  );
}
