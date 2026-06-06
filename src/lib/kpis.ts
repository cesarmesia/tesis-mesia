import type { Dictamen, Hallazgo, NormaResumen, Severidad } from "@/types";

// Selectores derivados (§9): se computan desde hallazgos/normas — nada duplicado.

export interface ConteoSeveridad {
  critica: number;
  mayor: number;
  menor: number;
  total: number;
}

// Fuente de verdad de severidad: SUMAR la tabla por norma (§5.4).
export function severidadDesdeNormas(normas: NormaResumen[]): ConteoSeveridad {
  const c = normas.reduce(
    (acc, n) => {
      acc.critica += n.critica;
      acc.mayor += n.mayor;
      acc.menor += n.menor;
      return acc;
    },
    { critica: 0, mayor: 0, menor: 0 },
  );
  return { ...c, total: c.critica + c.mayor + c.menor };
}

export function severidadDesdeHallazgos(hallazgos: Hallazgo[]): ConteoSeveridad {
  const c = { critica: 0, mayor: 0, menor: 0 };
  for (const h of hallazgos) {
    if (h.severidad === "critica") c.critica += 1;
    else if (h.severidad === "mayor") c.mayor += 1;
    else if (h.severidad === "menor") c.menor += 1;
  }
  return { ...c, total: c.critica + c.mayor + c.menor };
}

export interface KPIsGlobales {
  totalRequisitos: number;
  totalNoConformidades: number;
  totalCumplimientos: number;
  porcentajeCumplimiento: number;
  porcentajeNoConformidad: number;
  severidad: ConteoSeveridad;
}

export function kpisGlobales(
  normas: NormaResumen[],
  totalRequisitos: number,
): KPIsGlobales {
  const totalNC = normas.reduce((a, n) => a + n.noConformidades, 0);
  const totalCumpl = normas.reduce((a, n) => a + n.cumplimientos, 0);
  const denom = totalCumpl + totalNC || 1;
  return {
    totalRequisitos,
    totalNoConformidades: totalNC,
    totalCumplimientos: totalCumpl,
    porcentajeCumplimiento: (totalCumpl / denom) * 100,
    porcentajeNoConformidad: (totalNC / denom) * 100,
    severidad: severidadDesdeNormas(normas),
  };
}

// Distribución Cumple / Observado / No cumple por norma (para barras apiladas).
export interface DistribucionNorma {
  codigo: string;
  nombre: string;
  cumple: number;
  observado: number;
  noCumple: number;
}

export function distribucionPorNorma(
  normas: NormaResumen[],
  hallazgos: Hallazgo[],
): DistribucionNorma[] {
  return normas.map((n) => {
    const delaNorma = hallazgos.filter((h) => h.norma === n.codigo);
    const observado = delaNorma.filter((h) => h.dictamen === "Observado").length;
    const noCumple = delaNorma.filter((h) => h.dictamen === "No Cumple").length;
    return {
      codigo: n.codigo,
      nombre: n.nombre,
      cumple: n.cumplimientos,
      observado,
      noCumple,
    };
  });
}

export function dictamenColor(d: Dictamen): string {
  if (d === "Cumple") return "hsl(var(--ok))";
  if (d === "Observado") return "hsl(var(--observed))";
  return "hsl(var(--fail))";
}

export function severidadColor(s: Severidad): string {
  if (s === "critica") return "hsl(var(--sev-critica))";
  if (s === "mayor") return "hsl(var(--sev-mayor))";
  if (s === "menor") return "hsl(var(--sev-menor))";
  return "hsl(var(--text-muted))";
}

// ¿Un KPI cumple su meta? (recalculado, no confía en el flag guardado)
export function kpiCumple(meta: number, propuesto: number, mejorEsAlto: boolean): boolean {
  return mejorEsAlto ? propuesto >= meta : propuesto <= meta;
}

// Delta vs meta (positivo = a favor)
export function kpiDelta(meta: number, propuesto: number, mejorEsAlto: boolean): number {
  return mejorEsAlto ? propuesto - meta : meta - propuesto;
}
