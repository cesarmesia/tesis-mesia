"use client";

import * as React from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useProjectStore } from "@/store/use-project-store";
import { especialidadLabel } from "@/lib/format";
import type { Especialidad } from "@/types";

const ESPECIALIDADES: Especialidad[] = [
  "memoria_descriptiva",
  "memoria_calculo",
  "especificaciones",
  "metrados",
  "planos",
  "otros",
];

export function SpecialtyRadar({ height = 320 }: { height?: number }) {
  const hallazgos = useProjectStore((s) => s.hallazgos);

  const data = ESPECIALIDADES.map((esp) => {
    const delEsp = hallazgos.filter((h) => h.especialidad === esp);
    const peso = delEsp.reduce(
      (a, h) => a + (h.severidad === "critica" ? 5 : h.severidad === "mayor" ? 3 : 1),
      0,
    );
    return {
      especialidad: especialidadLabel[esp].replace("Memoria ", "Mem. "),
      noConformidades: delEsp.length,
      peso,
    };
  }).filter((d) => d.noConformidades > 0);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis
          dataKey="especialidad"
          tick={{ fill: "hsl(var(--text-muted))", fontSize: 11 }}
        />
        <PolarRadiusAxis tick={{ fill: "hsl(var(--text-muted))", fontSize: 10 }} />
        <Radar
          name="No conformidades"
          dataKey="noConformidades"
          stroke="hsl(var(--accent))"
          fill="hsl(var(--accent))"
          fillOpacity={0.35}
        />
        <Tooltip
          content={({ active, payload, label }: any) =>
            active && payload?.length ? (
              <div className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs shadow-md">
                <p className="font-semibold">{label}</p>
                <p className="text-text-muted">
                  {payload[0].value} NC · peso {payload[0].payload.peso}
                </p>
              </div>
            ) : null
          }
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
