"use client";

import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useProjectStore } from "@/store/use-project-store";
import { severidadDesdeNormas } from "@/lib/kpis";

const COLORS = {
  critica: "hsl(var(--sev-critica))",
  mayor: "hsl(var(--sev-mayor))",
  menor: "hsl(var(--sev-menor))",
};

export function SeverityDonut({ height = 240 }: { height?: number }) {
  const normas = useProjectStore((s) => s.normas);
  const sev = severidadDesdeNormas(normas);

  const data = [
    { name: "Críticas", key: "critica", value: sev.critica, color: COLORS.critica },
    { name: "Mayores", key: "mayor", value: sev.mayor, color: COLORS.mayor },
    { name: "Menores", key: "menor", value: sev.menor, color: COLORS.menor },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* El contenedor relativo cubre SOLO el área del gráfico → el centro queda alineado */}
      <div className="relative w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="62%"
              outerRadius="90%"
              paddingAngle={2}
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((d) => (
                <Cell key={d.key} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }: any) =>
                active && payload?.length ? (
                  <div className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs shadow-md">
                    <span className="font-medium">{payload[0].name}: </span>
                    <span className="tabular-nums">{payload[0].value}</span>
                  </div>
                ) : null
              }
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tabular-nums leading-none">{sev.total}</span>
          <span className="mt-1 text-xs text-text-muted">no conformidades</span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
        {data.map((d) => (
          <div key={d.key} className="flex items-center gap-1.5 text-xs">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-text-muted">{d.name}</span>
            <span className="font-semibold tabular-nums">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
