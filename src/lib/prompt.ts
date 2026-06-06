import type { Dataset, Documento, Hallazgo } from "@/types";
import { kpisGlobales } from "@/lib/kpis";

// §10 — Construcción del contexto y system prompt del verificador.

export interface ChatContexto {
  systemPrompt: string;
  documento?: Documento;
}

function resumenKPIs(dataset: Dataset): string {
  return dataset.kpis
    .map(
      (k) =>
        `- ${k.etiqueta}: tradicional ${k.tradicional}${k.unidad}, propuesto ${k.propuesto}${k.unidad}, meta ${k.meta}${k.unidad} (${k.cumple ? "cumple" : "no cumple"}).`,
    )
    .join("\n");
}

function resumenNormas(dataset: Dataset): string {
  return dataset.normas
    .map(
      (n) =>
        `- ${n.codigo} (${n.nombre}): ${n.requisitos} requisitos, ${n.noConformidades} NC [${n.critica} críticas / ${n.mayor} mayores / ${n.menor} menores], precisión ${n.precision}%.`,
    )
    .join("\n");
}

function lineaHallazgo(h: Hallazgo): string {
  return `[${h.id}] ${h.norma} · ${h.severidad} · ${h.dictamen} · ${h.especialidad}: ${h.titulo}. Justificación: ${h.justificacion} Recomendación: ${h.recomendacion} Cita norma: ${h.citaNorma.id} p.${h.citaNorma.pagina}. Cita expediente: ${h.citaExpediente.documento} p.${h.citaExpediente.pagina}.`;
}

export function construirContexto(
  dataset: Dataset,
  mode: "proyecto" | "archivo",
  documentoId?: string,
): ChatContexto {
  const { proyecto } = dataset;
  const g = kpisGlobales(dataset.normas, proyecto.totalRequisitos);

  let documento: Documento | undefined;
  let hallazgosContexto = dataset.hallazgos;

  if (mode === "archivo" && documentoId) {
    documento = dataset.documentos.find((d) => d.id === documentoId);
    if (documento) {
      // Hallazgos cuya cita de expediente apunta a este documento.
      hallazgosContexto = dataset.hallazgos.filter(
        (h) => h.citaExpediente.documento === documento!.nombre,
      );
    }
  }

  const alcance =
    mode === "archivo" && documento
      ? `MODO POR ARCHIVO. Tu contexto se limita EXCLUSIVAMENTE al documento «${documento.nombre}» (${documento.paginas} págs, ${documento.requiereOCR ? "requirió OCR" : "sin OCR"}, ${documento.segundosProceso}s de proceso) y sus ${hallazgosContexto.length} hallazgos asociados. No respondas sobre otros documentos.`
      : `MODO PROYECTO. Tu contexto abarca todo el expediente: KPIs, resumen por norma y los ${dataset.hallazgos.length} hallazgos.`;

  const hallazgosTexto =
    hallazgosContexto.length > 0
      ? hallazgosContexto.map(lineaHallazgo).join("\n")
      : "(No hay hallazgos en este contexto.)";

  const systemPrompt = `Eres el Asistente de Verificación del expediente técnico «${proyecto.nombre}» (${proyecto.ubicacion}). Ayudas a revisores técnicos de infraestructura educativa pública (PRONIED) a entender y gestionar las no conformidades detectadas por IA.

REGLAS ESTRICTAS:
1. Responde ÚNICAMENTE con base en el contexto entregado abajo. Si la pregunta está fuera del alcance del contexto, dilo claramente ("Eso está fuera del alcance del contexto disponible") y NO inventes (rechazo controlado).
2. TODA afirmación factual debe llevar una cita verificable, en formato: [norma: CÓDIGO p.PÁGINA] o [expediente: DOCUMENTO p.PÁGINA]. Usa los datos exactos del contexto.
3. Sé breve y concreto. Termina con una acción sugerida cuando aplique.
4. Responde en español, tono profesional y técnico.

${alcance}

=== DATOS DEL PROYECTO ===
Área: ${proyecto.areaM2} m². Presupuesto: S/ ${proyecto.presupuestoSoles}. Páginas: ${proyecto.totalPaginas}. Documentos: ${proyecto.totalDocumentos}. Requisitos verificados: ${proyecto.totalRequisitos}.
Tiempo de proceso: ${proyecto.tiempoProcesoMin} min. Costo: USD ${proyecto.costoUSD}. Recall@10: ${proyecto.recallAt10}. mAP@5: ${proyecto.mapAt5}.
Cumplimientos: ${g.totalCumplimientos} (${g.porcentajeCumplimiento.toFixed(1)}%). No conformidades: ${g.totalNoConformidades} (${g.porcentajeNoConformidad.toFixed(1)}%). Severidad: ${g.severidad.critica} críticas / ${g.severidad.mayor} mayores / ${g.severidad.menor} menores.

=== KPIs ===
${resumenKPIs(dataset)}

=== RESUMEN POR NORMA ===
${resumenNormas(dataset)}

=== HALLAZGOS EN CONTEXTO (${hallazgosContexto.length}) ===
${hallazgosTexto}

Recuerda: nunca cites información que no esté arriba. Si te piden algo no cubierto, recházalo educadamente.`;

  return { systemPrompt, documento };
}

// Heurística para extraer citas estructuradas de la respuesta del modelo
// (chips de cita). Busca patrones [norma: ... p.N] y [expediente: ... p.N].
export function extraerCitas(
  texto: string,
  dataset: Dataset,
): { tipo: "norma" | "expediente"; etiqueta: string; hallazgoId?: string }[] {
  const citas: { tipo: "norma" | "expediente"; etiqueta: string; hallazgoId?: string }[] = [];
  const regex = /\[(norma|expediente):\s*([^\]]+?)\s+p\.?\s*(\d+)\]/gi;
  let m: RegExpExecArray | null;
  const vistos = new Set<string>();

  while ((m = regex.exec(texto)) !== null) {
    const tipo = m[1].toLowerCase() as "norma" | "expediente";
    const ref = m[2].trim();
    const pagina = parseInt(m[3], 10);
    const etiqueta = `${ref} · p.${pagina}`;
    if (vistos.has(etiqueta)) continue;
    vistos.add(etiqueta);

    // Intenta enlazar a un hallazgo concreto.
    let hallazgoId: string | undefined;
    if (tipo === "norma") {
      hallazgoId = dataset.hallazgos.find(
        (h) => h.citaNorma.id.includes(ref) || ref.includes(h.norma),
      )?.id;
    } else {
      hallazgoId = dataset.hallazgos.find(
        (h) => h.citaExpediente.documento === ref || ref.includes(h.citaExpediente.documento),
      )?.id;
    }
    citas.push({ tipo, etiqueta, hallazgoId });
  }
  return citas;
}
