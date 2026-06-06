import type { Hallazgo } from "@/types";

// §7.1 Índice de Riesgo de Paralización (IRP)
// Solo cuentan los hallazgos ABIERTOS (estado por_revisar o en_correccion).

export const EXPOSICION_FACTOR = 0.35; // factor de exposición (heurístico, editable en /control)

export interface IRPResultado {
  irp: number;
  base: number;
  penalE030: number;
  penalA040: number;
  pesoSeveridad: number;
  pesoMax: number;
  semaforo: "verde" | "ambar" | "rojo";
  abiertos: number;
  criticasAbiertas: number;
  mayoresAbiertas: number;
  menoresAbiertas: number;
}

export function esAbierto(h: Hallazgo): boolean {
  return h.estado === "por_revisar" || h.estado === "en_correccion";
}

export function calcularIRP(
  hallazgos: Hallazgo[],
  totalRequisitos: number,
  exposicionFactor: number = EXPOSICION_FACTOR,
): IRPResultado {
  const abiertos = hallazgos.filter(esAbierto);

  const criticas = abiertos.filter((h) => h.severidad === "critica").length;
  const mayores = abiertos.filter((h) => h.severidad === "mayor").length;
  const menores = abiertos.filter((h) => h.severidad === "menor").length;

  const pesoSeveridad = criticas * 5 + mayores * 3 + menores * 1;
  const pesoMax = totalRequisitos * 0.05 * 5; // tope normalizador
  const base = pesoMax > 0 ? Math.min(100, (pesoSeveridad / pesoMax) * 100) : 0;

  const penalE030 =
    abiertos.filter((h) => h.norma === "E.030" && h.severidad === "critica").length * 6;
  const penalA040 =
    abiertos.filter((h) => h.norma === "A.040" && h.severidad === "critica").length * 5;

  const irp = Math.round(Math.min(100, base + penalE030 + penalA040));

  const semaforo: IRPResultado["semaforo"] = irp < 25 ? "verde" : irp <= 55 ? "ambar" : "rojo";

  return {
    irp,
    base: Math.round(base * 10) / 10,
    penalE030,
    penalA040,
    pesoSeveridad,
    pesoMax,
    semaforo,
    abiertos: abiertos.length,
    criticasAbiertas: criticas,
    mayoresAbiertas: mayores,
    menoresAbiertas: menores,
  };
}

// §7.1 Monto en riesgo (S/)
export function montoEnRiesgo(
  presupuesto: number,
  irp: number,
  exposicionFactor: number = EXPOSICION_FACTOR,
): number {
  return presupuesto * (irp / 100) * exposicionFactor;
}

export const semaforoColor: Record<IRPResultado["semaforo"], string> = {
  verde: "hsl(var(--ok))",
  ambar: "hsl(var(--observed))",
  rojo: "hsl(var(--fail))",
};

export const semaforoLabel: Record<IRPResultado["semaforo"], string> = {
  verde: "Bajo",
  ambar: "Medio",
  rojo: "Alto",
};

// §7.2 Apalancamiento: cuánto baja el IRP si se subsana un hallazgo abierto.
export function apalancamiento(
  hallazgos: Hallazgo[],
  totalRequisitos: number,
  exposicionFactor: number = EXPOSICION_FACTOR,
): { hallazgo: Hallazgo; delta: number }[] {
  const irpActual = calcularIRP(hallazgos, totalRequisitos, exposicionFactor).irp;
  const abiertos = hallazgos.filter(esAbierto);

  return abiertos
    .map((h) => {
      const simulados = hallazgos.map((x) =>
        x.id === h.id ? { ...x, estado: "subsanado" as const } : x,
      );
      const irpSim = calcularIRP(simulados, totalRequisitos, exposicionFactor).irp;
      return { hallazgo: h, delta: irpActual - irpSim };
    })
    .sort((a, b) => b.delta - a.delta);
}

// Contribución al riesgo por norma (peso de severidad de abiertos por norma).
export function contribucionPorNorma(
  hallazgos: Hallazgo[],
): { norma: string; peso: number }[] {
  const abiertos = hallazgos.filter(esAbierto);
  const mapa = new Map<string, number>();
  for (const h of abiertos) {
    const peso = h.severidad === "critica" ? 5 : h.severidad === "mayor" ? 3 : 1;
    mapa.set(h.norma, (mapa.get(h.norma) ?? 0) + peso);
  }
  return Array.from(mapa.entries())
    .map(([norma, peso]) => ({ norma, peso }))
    .sort((a, b) => b.peso - a.peso);
}
