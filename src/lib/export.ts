import type { Hallazgo } from "@/types";

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportHallazgosJSON(hallazgos: Hallazgo[]) {
  download(
    "hallazgos.json",
    JSON.stringify(hallazgos, null, 2),
    "application/json",
  );
}

function csvEscape(v: unknown): string {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function exportHallazgosCSV(hallazgos: Hallazgo[]) {
  const headers = [
    "id",
    "idRequisito",
    "norma",
    "especialidad",
    "dictamen",
    "severidad",
    "titulo",
    "justificacion",
    "recomendacion",
    "estado",
    "responsable",
    "citaNorma_id",
    "citaNorma_pagina",
    "citaExpediente_documento",
    "citaExpediente_pagina",
  ];
  const rows = hallazgos.map((h) =>
    [
      h.id,
      h.idRequisito,
      h.norma,
      h.especialidad,
      h.dictamen,
      h.severidad,
      h.titulo,
      h.justificacion,
      h.recomendacion,
      h.estado,
      h.responsable ?? "",
      h.citaNorma.id,
      h.citaNorma.pagina,
      h.citaExpediente.documento,
      h.citaExpediente.pagina,
    ]
      .map(csvEscape)
      .join(","),
  );
  download("hallazgos.csv", [headers.join(","), ...rows].join("\n"), "text/csv");
}

export function exportDatasetJSON(dataset: unknown) {
  download(
    "dataset-tesis-mesia.json",
    JSON.stringify(dataset, null, 2),
    "application/json",
  );
}
