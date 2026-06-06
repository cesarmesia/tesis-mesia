// Formato peruano de moneda y números.

export function formatSoles(n: number, opts?: { decimals?: number }): string {
  const decimals = opts?.decimals ?? 2;
  const formatted = new Intl.NumberFormat("es-PE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
  return `S/ ${formatted}`;
}

export function formatSolesCompact(n: number): string {
  if (n >= 1_000_000) return `S/ ${(n / 1_000_000).toFixed(2)} M`;
  if (n >= 1_000) return `S/ ${(n / 1_000).toFixed(1)} k`;
  return formatSoles(n, { decimals: 0 });
}

export function formatNumber(n: number, decimals = 0): string {
  return new Intl.NumberFormat("es-PE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

export function formatPercent(n: number, decimals = 1): string {
  return `${formatNumber(n, decimals)}%`;
}

export const especialidadLabel: Record<string, string> = {
  memoria_descriptiva: "Memoria descriptiva",
  memoria_calculo: "Memoria de cálculo",
  especificaciones: "Especificaciones",
  metrados: "Metrados",
  planos: "Planos",
  otros: "Otros",
};

export const severidadLabel: Record<string, string> = {
  critica: "Crítica",
  mayor: "Mayor",
  menor: "Menor",
  ninguna: "Ninguna",
};

export const estadoLabel: Record<string, string> = {
  por_revisar: "Por revisar",
  en_correccion: "En corrección",
  subsanado: "Subsanado",
  verificado: "Verificado",
};

export const dictamenLabel: Record<string, string> = {
  Cumple: "Cumple",
  "No Cumple": "No cumple",
  Observado: "Observado",
};
