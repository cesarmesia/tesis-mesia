"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { Hydrated } from "@/components/shared/hydrated";
import { StackedByNorma } from "@/components/charts/stacked-by-norma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SeveridadPill } from "@/components/shared/pills";
import { useProjectStore } from "@/store/use-project-store";
import { formatPercent } from "@/lib/format";
import type { Severidad } from "@/types";
import { ArrowRight } from "lucide-react";

function NormasContent() {
  const normas = useProjectStore((s) => s.normas);
  const hallazgos = useProjectStore((s) => s.hallazgos);
  const [filtroSev, setFiltroSev] = React.useState<Severidad | "todas">("todas");
  const [seleccion, setSeleccion] = React.useState<string | null>(null);

  const hallazgosNorma = React.useMemo(() => {
    if (!seleccion) return [];
    return hallazgos
      .filter((h) => h.norma === seleccion)
      .filter((h) => filtroSev === "todas" || h.severidad === filtroSev);
  }, [seleccion, hallazgos, filtroSev]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader className="flex-row items-center justify-between gap-3">
          <CardTitle>No conformidades por norma</CardTitle>
          <Select value={filtroSev} onValueChange={(v) => setFiltroSev(v as Severidad | "todas")}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Severidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las severidades</SelectItem>
              <SelectItem value="critica">Críticas</SelectItem>
              <SelectItem value="mayor">Mayores</SelectItem>
              <SelectItem value="menor">Menores</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-text-muted">
            Haz clic en una barra para ver el detalle de hallazgos de esa norma.
          </p>
          <StackedByNorma layout="horizontal" onSelectNorma={setSeleccion} />

          {seleccion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 overflow-hidden rounded-lg border border-border/50 bg-surface-2/30 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold">
                  {seleccion} ·{" "}
                  <span className="text-text-muted">{hallazgosNorma.length} hallazgos</span>
                </p>
                <Button variant="ghost" size="sm" onClick={() => setSeleccion(null)}>
                  Cerrar
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {hallazgosNorma.map((h) => (
                  <Link
                    key={h.id}
                    href={`/trazabilidad?focus=${h.id}`}
                    className="flex items-center gap-3 rounded-md border border-border/40 bg-surface p-2.5 text-sm transition-colors hover:bg-surface-2"
                  >
                    <span className="font-mono text-xs text-text-muted">{h.id}</span>
                    <span className="min-w-0 flex-1 truncate">{h.titulo}</span>
                    <SeveridadPill severidad={h.severidad} />
                    <ArrowRight className="size-4 text-text-muted" />
                  </Link>
                ))}
                {hallazgosNorma.length === 0 && (
                  <p className="py-4 text-center text-sm text-text-muted">
                    Sin hallazgos para este filtro.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Precisión por norma</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {normas.map((n) => (
            <div key={n.codigo}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Badge variant="outline">{n.codigo}</Badge>
                  <span className="text-text-muted">{n.nombre}</span>
                </span>
                <span className="font-semibold tabular-nums">
                  {formatPercent(n.precision)}
                </span>
              </div>
              <Progress value={n.precision} />
              <p className="mt-1 text-[11px] text-text-muted">
                {n.requisitos} requisitos · {n.noConformidades} NC ({n.critica}/{n.mayor}/
                {n.menor})
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function NormasPage() {
  return (
    <div>
      <PageHeader
        title="Cumplimiento por norma"
        description="Qué norma concentra los incumplimientos. La tabla por norma es la fuente de verdad (69 NC)."
      />
      <Hydrated>
        <NormasContent />
      </Hydrated>
    </div>
  );
}
