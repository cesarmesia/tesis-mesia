"use client";

import { useProjectStore } from "@/store/use-project-store";
import { calcularIRP, montoEnRiesgo } from "@/lib/irp";
import { kpisGlobales } from "@/lib/kpis";

// Hook derivado: IRP + monto en riesgo (recalculado desde el store, §9).
export function useIRP() {
  const hallazgos = useProjectStore((s) => s.hallazgos);
  const totalRequisitos = useProjectStore((s) => s.proyecto.totalRequisitos);
  const presupuesto = useProjectStore((s) => s.proyecto.presupuestoSoles);
  const exposicionFactor = useProjectStore((s) => s.exposicionFactor);

  const resultado = calcularIRP(hallazgos, totalRequisitos, exposicionFactor);
  const monto = montoEnRiesgo(presupuesto, resultado.irp, exposicionFactor);

  return { ...resultado, monto, exposicionFactor };
}

// Hook derivado: KPIs globales.
export function useKPIsGlobales() {
  const normas = useProjectStore((s) => s.normas);
  const totalRequisitos = useProjectStore((s) => s.proyecto.totalRequisitos);
  return kpisGlobales(normas, totalRequisitos);
}

// Evita hydration mismatch: indica si el store de localStorage ya rehidrató.
export function useHydrated() {
  return useProjectStore((s) => s.hydrated);
}
