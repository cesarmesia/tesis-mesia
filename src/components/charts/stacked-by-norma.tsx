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
import { useProjectStore } from "@/store/use-project-store";
import { distribucionPorNorma } from "@/lib/kpis";

const COLORS = {
  cumple: "hsl(var(--ok))",
  observado: "hsl(var(--observed))",
  noCumple: "hsl(var(--fail))",
};

const LABELS: Record<string, string> = {
  cumple: "Cumple",
  observado: "Observado",
  noCumple: "No cumple",
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-semibold">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="flex items-center gap-2">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          {LABELS[p.dataKey]}:{" "}
          <span className="font-medium tabular-nums">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export function StackedByNorma({
  layout = "vertical",
  onSelectNorma,
  metric = "noConformidades",
}: {
  layout?: "vertical" | "horizontal";
  onSelectNorma?: (codigo: string) => void;
  metric?: "noConformidades" | "all";
}) {
  const normas = useProjectStore((s) => s.normas);
  const hallazgos = useProjectStore((s) => s.hallazgos);
  const data = distribucionPorNorma(normas, hallazgos).map((d) => ({
    ...d,
    label: d.codigo,
  }));

  const isHorizontal = layout === "horizontal";
  const showCumple = metric === "all";

  return (
    <ResponsiveContainer width="100%" height={isHorizontal ? 360 : 300}>
      <BarChart
        data={data}
        layout={isHorizontal ? "vertical" : "horizontal"}
        margin={{ top: 8, right: 12, left: isHorizontal ? 8 : 0, bottom: 4 }}
        barCategoryGap={isHorizontal ? 10 : "20%"}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          horizontal={!isHorizontal}
          vertical={isHorizontal}
        />
        {isHorizontal ? (
          <>
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="label"
              width={86}
              tickLine={false}
              axisLine={false}
            />
          </>
        ) : (
          <>
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={32} />
          </>
        )}
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--surface-2))", opacity: 0.4 }} />
        {showCumple && (
          <Bar dataKey="cumple" stackId="a" fill={COLORS.cumple} radius={isHorizontal ? [0, 0, 0, 0] : [0, 0, 0, 0]} />
        )}
        <Bar
          dataKey="observado"
          stackId="a"
          fill={COLORS.observado}
          cursor={onSelectNorma ? "pointer" : undefined}
          onClick={(d: any) => onSelectNorma?.(d.codigo)}
        />
        <Bar
          dataKey="noCumple"
          stackId="a"
          fill={COLORS.noCumple}
          radius={isHorizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]}
          cursor={onSelectNorma ? "pointer" : undefined}
          onClick={(d: any) => onSelectNorma?.(d.codigo)}
        >
          {data.map((d) => (
            <Cell key={d.codigo} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
