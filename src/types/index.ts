export type Dictamen = "Cumple" | "No Cumple" | "Observado";
export type Severidad = "critica" | "mayor" | "menor" | "ninguna";
export type Especialidad =
  | "memoria_descriptiva"
  | "memoria_calculo"
  | "especificaciones"
  | "metrados"
  | "planos"
  | "otros";
export type EstadoKanban =
  | "por_revisar"
  | "en_correccion"
  | "subsanado"
  | "verificado";

export interface NormaResumen {
  codigo: string; // "A.040"
  nombre: string; // "Educación"
  requisitos: number;
  cumplimientos: number;
  noConformidades: number;
  precision: number; // %
  critica: number;
  mayor: number;
  menor: number;
}

export interface Cita {
  id: string;
  pagina: number;
  texto: string;
}

export interface CitaExpediente {
  documento: string;
  pagina: number;
  texto: string;
}

export interface Hallazgo {
  // = una no conformidad / omisión
  id: string; // "H-001"
  idRequisito: string; // "RVM_084_Art..."
  norma: string; // "RVM 084-2019"
  especialidad: Especialidad;
  dictamen: Dictamen; // "No Cumple" | "Observado"
  severidad: Severidad;
  titulo: string; // resumen corto del hallazgo
  justificacion: string;
  recomendacion: string;
  citaNorma: Cita;
  citaExpediente: CitaExpediente;
  estado: EstadoKanban; // para el Kanban
  responsable?: string;
  placeholder?: boolean; // citas ilustrativas (ver §5.6)
}

export interface Documento {
  id: string;
  nombre: string;
  tipo: Especialidad;
  paginas: number;
  requiereOCR: boolean;
  segundosProceso: number;
}

export interface KPI {
  id: string;
  etiqueta: string;
  unidad: string;
  meta: number;
  tradicional: number;
  propuesto: number;
  cumple: boolean;
  mejorEsAlto: boolean;
}

export interface Proyecto {
  id: string;
  nombre: string;
  ubicacion: string;
  areaM2: number;
  presupuestoSoles: number;
  totalPaginas: number;
  totalDocumentos: number;
  totalRequisitos: number;
  tiempoProcesoMin: number; // 4.35
  costoUSD: number; // 0.10
  corpusFragmentos: number; // 1586
  recallAt10: number;
  mapAt5: number;
  latenciaMs: number;
}

export interface ChatCitation {
  tipo: "norma" | "expediente";
  etiqueta: string; // "RVM 084-2019 · p.45" | "Memoria Descriptiva · p.12"
  hallazgoId?: string; // para abrir la fila en /trazabilidad
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: ChatCitation[];
  pending?: boolean;
}

export interface ChatSession {
  id: string;
  mode: "proyecto" | "archivo";
  documentoId?: string;
  messages: ChatMessage[];
  createdAt: string;
}

export type PrioridadActividad = "alta" | "media" | "baja";

export interface Actividad {
  id: string;
  titulo: string;
  hallazgoId?: string; // omisión vinculada (opcional)
  responsable?: string;
  prioridad: PrioridadActividad;
  hecha: boolean;
  createdAt: string;
}

export interface Dataset {
  proyecto: Proyecto;
  kpis: KPI[];
  normas: NormaResumen[];
  hallazgos: Hallazgo[];
  documentos: Documento[];
}
