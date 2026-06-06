"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Upload, Inbox } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Hydrated } from "@/components/shared/hydrated";
import { EmptyState } from "@/components/shared/empty-state";
import { ProjectHero } from "@/components/dashboard/project-hero";
import { ErrorOverview } from "@/components/dashboard/error-overview";
import { PrincipalesOmisiones } from "@/components/dashboard/principales-omisiones";
import { TareasPanel } from "@/components/dashboard/tareas-panel";
import { KpiGrid } from "@/components/kpi/kpi-grid";
import { StackedByNorma } from "@/components/charts/stacked-by-norma";
import { SeverityDonut } from "@/components/charts/severity-donut";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/store/use-project-store";

function DashboardContent() {
  const hallazgos = useProjectStore((s) => s.hallazgos);

  if (hallazgos.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Aún no hay expediente cargado"
        description="Importa un dataset JSON o restaura el caso piloto para comenzar el análisis."
      >
        <Button asChild>
          <Link href="/control">
            <Upload className="size-4" /> Cargar piloto / Importar JSON
          </Link>
        </Button>
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 1 · Datos del proyecto en grande + IRP */}
      <ProjectHero />

      {/* 2 · Errores del expediente (intuitivo) */}
      <ErrorOverview />

      {/* 3 · Principales omisiones (con detalle) + Tareas/Actividades */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PrincipalesOmisiones />
        <TareasPanel />
      </div>

      {/* 4 · Indicadores de la tesis */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Indicadores de la tesis</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/normas">
              Detalle por norma <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <KpiGrid />
      </section>

      {/* 5 · Gráficos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cumplimiento por norma</CardTitle>
          </CardHeader>
          <CardContent>
            <StackedByNorma metric="noConformidades" />
            <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-observed" /> Observado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-fail" /> No cumple
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Severidad</CardTitle>
          </CardHeader>
          <CardContent>
            <SeverityDonut />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Centro de control"
        description="Vista viva del expediente: omisiones, tareas de subsanación y riesgo de paralización."
      >
        <Button asChild>
          <Link href="/omisiones">
            Ver omisiones <ArrowRight className="size-4" />
          </Link>
        </Button>
      </PageHeader>
      <Hydrated fallback={<div className="h-96 animate-pulse rounded-lg bg-surface-2" />}>
        <DashboardContent />
      </Hydrated>
    </div>
  );
}
