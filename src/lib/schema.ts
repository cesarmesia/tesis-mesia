import { z } from "zod";

export const dictamenSchema = z.enum(["Cumple", "No Cumple", "Observado"]);
export const severidadSchema = z.enum(["critica", "mayor", "menor", "ninguna"]);
export const especialidadSchema = z.enum([
  "memoria_descriptiva",
  "memoria_calculo",
  "especificaciones",
  "metrados",
  "planos",
  "otros",
]);
export const estadoKanbanSchema = z.enum([
  "por_revisar",
  "en_correccion",
  "subsanado",
  "verificado",
]);

export const normaResumenSchema = z.object({
  codigo: z.string(),
  nombre: z.string(),
  requisitos: z.number(),
  cumplimientos: z.number(),
  noConformidades: z.number(),
  precision: z.number(),
  critica: z.number(),
  mayor: z.number(),
  menor: z.number(),
});

export const hallazgoSchema = z.object({
  id: z.string(),
  idRequisito: z.string(),
  norma: z.string(),
  especialidad: especialidadSchema,
  dictamen: dictamenSchema,
  severidad: severidadSchema,
  titulo: z.string(),
  justificacion: z.string(),
  recomendacion: z.string(),
  citaNorma: z.object({ id: z.string(), pagina: z.number(), texto: z.string() }),
  citaExpediente: z.object({
    documento: z.string(),
    pagina: z.number(),
    texto: z.string(),
  }),
  estado: estadoKanbanSchema,
  responsable: z.string().optional(),
  placeholder: z.boolean().optional(),
});

export const documentoSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  tipo: especialidadSchema,
  paginas: z.number(),
  requiereOCR: z.boolean(),
  segundosProceso: z.number(),
});

export const kpiSchema = z.object({
  id: z.string(),
  etiqueta: z.string(),
  unidad: z.string(),
  meta: z.number(),
  tradicional: z.number(),
  propuesto: z.number(),
  cumple: z.boolean(),
  mejorEsAlto: z.boolean(),
});

export const proyectoSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  ubicacion: z.string(),
  areaM2: z.number(),
  presupuestoSoles: z.number(),
  totalPaginas: z.number(),
  totalDocumentos: z.number(),
  totalRequisitos: z.number(),
  tiempoProcesoMin: z.number(),
  costoUSD: z.number(),
  corpusFragmentos: z.number(),
  recallAt10: z.number(),
  mapAt5: z.number(),
  latenciaMs: z.number(),
});

export const datasetSchema = z.object({
  proyecto: proyectoSchema,
  kpis: z.array(kpiSchema),
  normas: z.array(normaResumenSchema),
  hallazgos: z.array(hallazgoSchema),
  documentos: z.array(documentoSchema),
});

export type DatasetInput = z.infer<typeof datasetSchema>;
