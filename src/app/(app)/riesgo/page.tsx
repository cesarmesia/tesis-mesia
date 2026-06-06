"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingDown, Info } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Hydrated } from "@/components/shared/hydrated";
import { IRPGauge } from "@/components/irp/gauge";
import { RiskAmount } from "@/components/irp/risk-amount";
import { WhatIfSimulator } from "@/components/irp/what-if-simulator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeveridadPill } from "@/components/shared/pills";
import { useProjectStore } from "@/store/use-project-store";
import { useIRP } from "@/hooks/use-derived";
import { apalancamiento, contribucionPorNorma } from "@/lib/irp";
import { formatSoles } from "@/lib/format";

function RiesgoContent() {
  const hallazgos = useProjectStore((s) => s.hallazgos);
  const totalRequisitos = useProjectStore((s) => s.proyecto.totalRequisitos);
  const exposicionFactor = useProjectStore((s) => s.exposicionFactor);
  const irp = useIRP();

  const contrib = contribucionPorNorma(hallazgos);
  const top3 = apalancamiento(hallazgos, totalRequisitos, exposicionFactor)
    .filter((a) => a.delta > 0)
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-4">
      {/* Resumen IRP */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center p-6">
          <IRPGauge value={irp.irp} semaforo={irp.semaforo} size={260} />
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Exposición financiera</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <RiskAmount monto={irp.monto} />
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <Stat label="IRP" value={`${irp.irp}`} />
              <Stat label="Base normalizada" value={`${irp.base}`} />
              <Stat label="Penal. E.030" value={`+${irp.penalE030}`} />
              <Stat label="Penal. A.040" value={`+${irp.penalA040}`} />
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-surface-2/50 p-3 text-xs text-text-muted">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              <span>
                Heurístico (módulo predictivo de “investigaciones futuras”). Monto en riesgo ={" "}
                presupuesto × (IRP/100) × {exposicionFactor} (factor de exposición editable en{" "}
                <Link href="/control" className="text-accent underline">
                  Control
                </Link>
                ). Solo cuentan hallazgos abiertos (por revisar / en corrección).
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desglose + apalancamiento */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contribución al riesgo por norma</CardTitle>
          </CardHeader>
          <CardContent>
            {contrib.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={contrib}
                  layout="vertical"
                  margin={{ top: 4, right: 12, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="norma"
                    width={90}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--surface-2))", opacity: 0.4 }}
                    content={({ active, payload, label }: any) =>
                      active && payload?.length ? (
                        <div className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs shadow-md">
                          <span className="font-medium">{label}</span>: peso {payload[0].value}
                        </div>
                      ) : null
                    }
                  />
                  <Bar dataKey="peso" fill="hsl(var(--fail))" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-12 text-center text-sm text-text-muted">
                Sin hallazgos abiertos — el riesgo está controlado.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mayor apalancamiento</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="mb-1 text-xs text-text-muted">
              Top 3 hallazgos que más bajan el IRP si se subsanan (guiño Lean/PMBOK).
            </p>
            {top3.map((a, i) => (
              <Link
                key={a.hallazgo.id}
                href={`/omisiones?focus=${a.hallazgo.id}`}
                className="flex items-center gap-3 rounded-lg border border-border/40 bg-surface-2/30 p-3 transition-colors hover:bg-surface-2"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-accent/12 text-xs font-bold text-accent">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.hallazgo.titulo}</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <Badge variant="outline" className="text-[10px]">
                      {a.hallazgo.norma}
                    </Badge>
                    <SeveridadPill severidad={a.hallazgo.severidad} />
                  </div>
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-ok">
                  <TrendingDown className="size-4" /> −{a.delta}
                </span>
              </Link>
            ))}
            {top3.length === 0 && (
              <p className="py-8 text-center text-sm text-text-muted">
                No hay hallazgos abiertos.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Simulador */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Simulador “¿Qué pasa si…?”</h2>
        <WhatIfSimulator />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-2/50 p-2.5">
      <p className="text-[11px] text-text-muted">{label}</p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export default function RiesgoPage() {
  return (
    <div>
      <PageHeader
        title="Índice de Riesgo de Paralización (IRP)"
        description="¿Esta obra se va a paralizar y cuánta plata está en riesgo? Conecta cumplimiento normativo con riesgo de obra."
      />
      <Hydrated fallback={<div className="h-96 animate-pulse rounded-lg bg-surface-2" />}>
        <RiesgoContent />
      </Hydrated>
    </div>
  );
}
