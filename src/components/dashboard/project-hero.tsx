"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Ruler,
  Wallet,
  FileStack,
  Files,
  ListChecks,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { IRPGauge } from "@/components/irp/gauge";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/store/use-project-store";
import { useIRP } from "@/hooks/use-derived";
import { formatNumber, formatSoles, formatSolesCompact } from "@/lib/format";

function BigStat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-[12px] bg-surface-2/40 p-4">
      <span className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
        <Icon className="size-3.5" /> {label}
      </span>
      <span className="text-2xl font-semibold tabular-nums leading-tight">{value}</span>
      {sub && <span className="text-[11px] text-text-muted">{sub}</span>}
    </div>
  );
}

export function ProjectHero() {
  const proyecto = useProjectStore((s) => s.proyecto);
  const irp = useIRP();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_auto] lg:p-8">
          {/* Datos del proyecto en grande */}
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/12 px-3 py-1 text-xs font-medium text-accent">
              Expediente técnico · Caso piloto
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {proyecto.nombre}
            </h2>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-text-muted">
              <MapPin className="size-4 shrink-0" /> {proyecto.ubicacion}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
              <BigStat
                icon={Ruler}
                label="Área"
                value={`${formatNumber(proyecto.areaM2, 2)}`}
                sub="m²"
              />
              <BigStat
                icon={Wallet}
                label="Presupuesto"
                value={formatSolesCompact(proyecto.presupuestoSoles)}
                sub={formatSoles(proyecto.presupuestoSoles, { decimals: 2 })}
              />
              <BigStat
                icon={FileStack}
                label="Páginas"
                value={formatNumber(proyecto.totalPaginas)}
                sub={`${proyecto.tiempoProcesoMin} min de proceso`}
              />
              <BigStat
                icon={Files}
                label="Documentos"
                value={`${proyecto.totalDocumentos}`}
                sub="del expediente"
              />
              <BigStat
                icon={ListChecks}
                label="Requisitos"
                value={formatNumber(proyecto.totalRequisitos)}
                sub="verificados por IA"
              />
            </div>
          </div>

          {/* IRP + monto en riesgo */}
          <div className="flex flex-col items-center justify-center gap-3 rounded-[14px] bg-surface-2/30 p-5 lg:w-[280px]">
            <IRPGauge value={irp.irp} semaforo={irp.semaforo} size={200} />
            <div className="w-full rounded-[10px] bg-fail/10 px-4 py-3 text-center">
              <p className="text-xs font-medium text-text-muted">Monto en riesgo</p>
              <p className="text-xl font-semibold tabular-nums text-fail">
                {formatSoles(irp.monto, { decimals: 0 })}
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/riesgo">
                Analizar riesgo <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
