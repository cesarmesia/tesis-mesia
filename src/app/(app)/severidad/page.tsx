"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { Hydrated } from "@/components/shared/hydrated";
import { SeverityDonut } from "@/components/charts/severity-donut";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectStore } from "@/store/use-project-store";
import { severidadColor } from "@/lib/kpis";
import { especialidadLabel } from "@/lib/format";
import type { Severidad } from "@/types";

const SEV_META: { key: "critica" | "mayor" | "menor"; label: string; peso: number }[] = [
  { key: "critica", label: "Crítica", peso: 5 },
  { key: "mayor", label: "Mayor", peso: 3 },
  { key: "menor", label: "Menor", peso: 1 },
];

function SeveridadContent() {
  const hallazgos = useProjectStore((s) => s.hallazgos);
  const normas = useProjectStore((s) => s.normas);
  const [groupBy, setGroupBy] = React.useState<"norma" | "especialidad">("norma");

  const conteo = (sev: Severidad) => hallazgos.filter((h) => h.severidad === sev).length;

  const dataAgrupada = React.useMemo(() => {
    if (groupBy === "norma") {
      return normas.map((n) => ({
        nombre: n.codigo,
        critica: n.critica,
        mayor: n.mayor,
        menor: n.menor,
      }));
    }
    const especialidades = Array.from(new Set(hallazgos.map((h) => h.especialidad)));
    return especialidades.map((esp) => {
      const del = hallazgos.filter((h) => h.especialidad === esp);
      return {
        nombre: especialidadLabel[esp].replace("Memoria ", "Mem. "),
        critica: del.filter((h) => h.severidad === "critica").length,
        mayor: del.filter((h) => h.severidad === "mayor").length,
        menor: del.filter((h) => h.severidad === "menor").length,
      };
    });
  }, [groupBy, normas, hallazgos]);

  return (
    <div className="flex flex-col gap-4">
      {/* Tres columnas de severidad */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {SEV_META.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, type: "spring", stiffness: 260, damping: 30 }}
          >
            <Card>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm font-medium text-text-muted">{s.label}</p>
                  <p
                    className="text-4xl font-semibold tabular-nums"
                    style={{ color: severidadColor(s.key) }}
                  >
                    {conteo(s.key)}
                  </p>
                  <p className="text-[11px] text-text-muted">peso de severidad ×{s.peso}</p>
                </div>
                <span
                  className="size-12 rounded-full"
                  style={{ backgroundColor: `${severidadColor(s.key)}22` }}
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Distribución global</CardTitle>
          </CardHeader>
          <CardContent>
            <SeverityDonut height={220} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between gap-3">
            <CardTitle>Severidad por categoría</CardTitle>
            <Tabs value={groupBy} onValueChange={(v) => setGroupBy(v as "norma" | "especialidad")}>
              <TabsList>
                <TabsTrigger value="norma">Por norma</TabsTrigger>
                <TabsTrigger value="especialidad">Por especialidad</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataAgrupada} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="nombre" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={32} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--surface-2))", opacity: 0.4 }}
                  content={({ active, payload, label }: any) =>
                    active && payload?.length ? (
                      <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-md">
                        <p className="mb-1 font-semibold">{label}</p>
                        {payload.map((p: any) => (
                          <p key={p.dataKey} className="flex items-center gap-2 capitalize">
                            <span className="size-2 rounded-full" style={{ background: p.color }} />
                            {p.dataKey}: <span className="font-medium">{p.value}</span>
                          </p>
                        ))}
                      </div>
                    ) : null
                  }
                />
                <Bar dataKey="critica" stackId="s" fill={severidadColor("critica")} />
                <Bar dataKey="mayor" stackId="s" fill={severidadColor("mayor")} />
                <Bar dataKey="menor" stackId="s" fill={severidadColor("menor")} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SeveridadPage() {
  return (
    <div>
      <PageHeader
        title="Severidad de no conformidades"
        description="Críticas, mayores y menores. El peso de severidad alimenta el IRP."
      />
      <Hydrated>
        <SeveridadContent />
      </Hydrated>
    </div>
  );
}
