"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, AlertTriangle, AlertCircle, CircleDot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useProjectStore } from "@/store/use-project-store";
import { useKPIsGlobales } from "@/hooks/use-derived";
import { severidadColor } from "@/lib/kpis";
import { formatNumber } from "@/lib/format";

function SeverityTile({
  icon: Icon,
  label,
  value,
  color,
  hint,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  hint: string;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-[12px] border border-border/40 bg-surface p-4"
      style={{ boxShadow: `inset 3px 0 0 ${color}` }}
    >
      <span
        className="flex size-10 items-center justify-center rounded-[10px]"
        style={{ backgroundColor: `${color}1f`, color }}
      >
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-2xl font-semibold tabular-nums leading-none" style={{ color }}>
          {value}
        </p>
        <p className="mt-0.5 text-xs font-medium">{label}</p>
        <p className="text-[10px] text-text-muted">{hint}</p>
      </div>
    </div>
  );
}

export function ErrorOverview() {
  const g = useKPIsGlobales();
  const hallazgos = useProjectStore((s) => s.hallazgos);

  const observado = hallazgos.filter((h) => h.dictamen === "Observado").length;
  const noCumple = hallazgos.filter((h) => h.dictamen === "No Cumple").length;

  return (
    <Card>
      <CardContent className="flex flex-col gap-5 p-6">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-text-muted">
            Estado del expediente
          </p>
          <h3 className="text-lg font-semibold">
            <span className="text-fail">{g.totalNoConformidades} errores</span> detectados en{" "}
            {formatNumber(g.totalRequisitos)} requisitos
          </h3>
        </div>

        {/* Barra de cumplimiento */}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-ok">
              <ShieldCheck className="size-3.5" /> Cumple ·{" "}
              {formatNumber(g.totalCumplimientos)} ({g.porcentajeCumplimiento.toFixed(1)}%)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-fail">
              <ShieldAlert className="size-3.5" /> No conforme ·{" "}
              {g.totalNoConformidades} ({g.porcentajeNoConformidad.toFixed(1)}%)
            </span>
          </div>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface-2">
            <motion.div
              className="h-full bg-ok"
              initial={{ width: 0 }}
              animate={{ width: `${g.porcentajeCumplimiento}%` }}
              transition={{ type: "spring", stiffness: 60, damping: 18 }}
            />
            <div className="h-full flex-1 bg-fail" />
          </div>
          <p className="mt-1.5 text-[11px] text-text-muted">
            De los {g.totalNoConformidades} errores: {noCumple} «No cumple» y {observado}{" "}
            «Observado».
          </p>
        </div>

        {/* Severidad en tiles claros */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SeverityTile
            icon={AlertCircle}
            label="Críticas"
            value={g.severidad.critica}
            color={severidadColor("critica")}
            hint="bloquean la obra"
          />
          <SeverityTile
            icon={AlertTriangle}
            label="Mayores"
            value={g.severidad.mayor}
            color={severidadColor("mayor")}
            hint="requieren subsanación"
          />
          <SeverityTile
            icon={CircleDot}
            label="Menores"
            value={g.severidad.menor}
            color={severidadColor("menor")}
            hint="observaciones"
          />
        </div>
      </CardContent>
    </Card>
  );
}
