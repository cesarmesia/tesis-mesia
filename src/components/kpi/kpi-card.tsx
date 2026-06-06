"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCountUp } from "@/hooks/use-count-up";
import { kpiCumple, kpiDelta } from "@/lib/kpis";
import { formatNumber } from "@/lib/format";
import type { KPI } from "@/types";
import { cn } from "@/lib/utils";

function fmt(value: number, unidad: string) {
  const decimals = unidad === "score" ? 2 : value % 1 !== 0 ? 1 : 0;
  const num = formatNumber(value, decimals);
  if (unidad === "%") return `${num}%`;
  if (unidad === "/5") return `${num}/5`;
  if (unidad === "score") return num;
  return num;
}

export function KpiCard({ kpi, index = 0 }: { kpi: KPI; index?: number }) {
  const decimals = kpi.unidad === "score" ? 2 : kpi.propuesto % 1 !== 0 ? 1 : 0;
  const animated = useCountUp(kpi.propuesto, { decimals, duration: 0.9 });
  const cumple = kpiCumple(kpi.meta, kpi.propuesto, kpi.mejorEsAlto);
  const delta = kpiDelta(kpi.meta, kpi.propuesto, kpi.mejorEsAlto);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 30, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col gap-3 rounded-lg border border-border/50 bg-surface p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-text-muted">{kpi.etiqueta}</p>
        {cumple && (
          <Badge variant="ok">
            <Check className="size-3" />
            Cumple
          </Badge>
        )}
      </div>

      <div className="flex items-end gap-2">
        <span className="text-3xl font-semibold tracking-tight tabular-nums">
          {fmt(animated, kpi.unidad)}
        </span>
        <span
          className={cn(
            "mb-1 inline-flex items-center gap-0.5 text-xs font-medium",
            delta >= 0 ? "text-ok" : "text-fail",
          )}
        >
          <TrendingUp className="size-3" />
          {delta >= 0 ? "+" : ""}
          {formatNumber(delta, decimals)} vs meta
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>
          Tradicional:{" "}
          <span className="font-medium text-text">
            {fmt(kpi.tradicional, kpi.unidad)}
          </span>
        </span>
        <span>
          Meta:{" "}
          <span className="font-medium text-text">{fmt(kpi.meta, kpi.unidad)}</span>
        </span>
      </div>

      {/* Barra comparativa tradicional vs propuesto */}
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-accent transition-all duration-700"
          style={{
            width: `${Math.min(100, kpi.mejorEsAlto ? (kpi.propuesto / Math.max(kpi.meta, kpi.propuesto)) * 100 : (kpi.meta / Math.max(kpi.propuesto, kpi.meta)) * 100)}%`,
          }}
        />
      </div>
    </motion.div>
  );
}
