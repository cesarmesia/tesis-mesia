"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Clock, ScanLine, FileText } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Hydrated } from "@/components/shared/hydrated";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useProjectStore } from "@/store/use-project-store";
import { especialidadLabel } from "@/lib/format";

function ExpedienteContent() {
  const documentos = useProjectStore((s) => s.documentos);
  const hallazgos = useProjectStore((s) => s.hallazgos);
  const proyecto = useProjectStore((s) => s.proyecto);

  const conOCR = documentos.filter((d) => d.requiereOCR).length;
  const maxSeg = Math.max(...documentos.map((d) => d.segundosProceso), 1);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Resumen label="Documentos" value={`${documentos.length}`} />
        <Resumen label="Páginas" value={`${proyecto.totalPaginas}`} />
        <Resumen
          label="Requirieron OCR"
          value={`${conOCR} (${Math.round((conOCR / documentos.length) * 100)}%)`}
        />
        <Resumen
          label="Corpus de fragmentos"
          value={`${proyecto.corpusFragmentos.toLocaleString("es-PE")}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {documentos.map((d, i) => {
          const nc = hallazgos.filter(
            (h) => h.citaExpediente.documento === d.nombre,
          ).length;
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, type: "spring", stiffness: 260, damping: 30 }}
            >
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex size-9 items-center justify-center rounded-[10px] bg-accent/12 text-accent">
                      <FileText className="size-4" />
                    </span>
                    <div className="flex gap-1.5">
                      {d.requiereOCR && (
                        <Badge variant="observed">
                          <ScanLine className="size-3" /> OCR
                        </Badge>
                      )}
                      {nc > 0 && <Badge variant="secondary">{nc} NC</Badge>}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-snug">{d.nombre}</p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {especialidadLabel[d.tipo]} · {d.paginas} págs
                    </p>
                  </div>
                  <div className="mt-auto">
                    <div className="mb-1 flex items-center justify-between text-[11px] text-text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" /> Proceso
                      </span>
                      <span className="tabular-nums">{d.segundosProceso}s</span>
                    </div>
                    <Progress
                      value={(d.segundosProceso / maxSeg) * 100}
                      indicatorClassName="bg-ok"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Resumen({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}

export default function ExpedientePage() {
  return (
    <div>
      <PageHeader
        title="Inventario del expediente"
        description="Los 12 documentos verificados: tipo, páginas, OCR y tiempo de proceso."
      />
      <Hydrated>
        <ExpedienteContent />
      </Hydrated>
    </div>
  );
}
