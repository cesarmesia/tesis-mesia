import type {
  Documento,
  Especialidad,
  Hallazgo,
  KPI,
  NormaResumen,
  Proyecto,
  Severidad,
} from "@/types";

// ──────────────────────────────────────────────────────────────────────────
// §5.2 Proyecto (semilla) — datos reales de la tesis
// ──────────────────────────────────────────────────────────────────────────
export const proyectoSeed: Proyecto = {
  id: "IE_7074",
  nombre: "I.E. N° 7074 «La Inmaculada»",
  ubicacion: "San Juan de Miraflores, Lima Metropolitana",
  areaM2: 3546.5,
  presupuestoSoles: 10289658.68,
  totalPaginas: 484,
  totalDocumentos: 12,
  totalRequisitos: 1266,
  tiempoProcesoMin: 4.35,
  costoUSD: 0.1,
  corpusFragmentos: 1586,
  recallAt10: 0.91,
  mapAt5: 0.87,
  latenciaMs: 78,
};

// ──────────────────────────────────────────────────────────────────────────
// §5.3 KPIs (Tabla 4/5 — los 6 indicadores)
// ──────────────────────────────────────────────────────────────────────────
export const kpisSeed: KPI[] = [
  {
    id: "precision",
    etiqueta: "Precisión detección de errores",
    unidad: "%",
    meta: 85,
    tradicional: 34,
    propuesto: 94.8,
    cumple: true,
    mejorEsAlto: true,
  },
  {
    id: "omisiones",
    etiqueta: "Omisiones",
    unidad: "%",
    meta: 5,
    tradicional: 48,
    propuesto: 2.3,
    cumple: true,
    mejorEsAlto: false,
  },
  {
    id: "tiempo",
    etiqueta: "Reducción de tiempo",
    unidad: "%",
    meta: 80,
    tradicional: 0,
    propuesto: 96.2,
    cumple: true,
    mejorEsAlto: true,
  },
  {
    id: "f1",
    etiqueta: "F1-score",
    unidad: "score",
    meta: 0.8,
    tradicional: 0.48,
    propuesto: 0.89,
    cumple: true,
    mejorEsAlto: true,
  },
  {
    id: "clasif",
    etiqueta: "Clasificación jerárquica",
    unidad: "%",
    meta: 90,
    tradicional: 72,
    propuesto: 93.7,
    cumple: true,
    mejorEsAlto: true,
  },
  {
    id: "satisfaccion",
    etiqueta: "Satisfacción de usuario",
    unidad: "/5",
    meta: 4.5,
    tradicional: 3.4,
    propuesto: 4.67,
    cumple: true,
    mejorEsAlto: true,
  },
];

// ──────────────────────────────────────────────────────────────────────────
// §5.4 Resumen por norma — FUENTE DE VERDAD (suma 69 NC)
// ──────────────────────────────────────────────────────────────────────────
export const normasSeed: NormaResumen[] = [
  { codigo: "A.040", nombre: "Educación", requisitos: 287, cumplimientos: 272, noConformidades: 15, precision: 94.8, critica: 2, mayor: 6, menor: 7 },
  { codigo: "E.030", nombre: "Diseño Sismorresistente", requisitos: 198, cumplimientos: 189, noConformidades: 9, precision: 95.5, critica: 3, mayor: 4, menor: 2 },
  { codigo: "E.060", nombre: "Concreto Armado", requisitos: 165, cumplimientos: 158, noConformidades: 7, precision: 95.8, critica: 2, mayor: 3, menor: 2 },
  { codigo: "E.070", nombre: "Albañilería", requisitos: 134, cumplimientos: 129, noConformidades: 5, precision: 96.3, critica: 1, mayor: 2, menor: 2 },
  { codigo: "RVM 104-2019", nombre: "Locales Inicial", requisitos: 241, cumplimientos: 231, noConformidades: 10, precision: 95.9, critica: 1, mayor: 4, menor: 5 },
  { codigo: "RVM 084-2019", nombre: "Primaria/Secundaria", requisitos: 319, cumplimientos: 305, noConformidades: 14, precision: 95.6, critica: 3, mayor: 7, menor: 4 },
  { codigo: "RVM 010-2022", nombre: "Criterios Generales", requisitos: 182, cumplimientos: 175, noConformidades: 7, precision: 96.2, critica: 1, mayor: 3, menor: 3 },
  { codigo: "PMBOK 6", nombre: "Gestión de proyectos", requisitos: 60, cumplimientos: 58, noConformidades: 2, precision: 96.7, critica: 0, mayor: 1, menor: 1 },
];

// Discrepancia documentada (§5.4): el texto de la tesis dice 50 NC; la tabla suma 69.
export const auditoriaDiscrepancia = {
  totalTexto: 50,
  totalTabla: 69,
  severidadTexto: { critica: 13, mayor: 21, menor: 16 }, // suma 50
  severidadTabla: { critica: 13, mayor: 30, menor: 26 }, // suma 69 (fuente de verdad)
  nota: "El texto de la tesis reporta 50 no conformidades (13/21/16); la tabla por norma suma 69 (13/30/26). Se usa la tabla por norma como fuente de verdad porque desagrega por severidad. Concilie el texto o la tabla antes de la sustentación.",
};

// ──────────────────────────────────────────────────────────────────────────
// §5.5 Documentos del expediente (12 docs, 484 pág, 4 requieren OCR ≈ 33%)
// ──────────────────────────────────────────────────────────────────────────
export const documentosSeed: Documento[] = [
  { id: "DOC-01", nombre: "Memoria Descriptiva", tipo: "memoria_descriptiva", paginas: 87, requiereOCR: true, segundosProceso: 31 },
  { id: "DOC-02", nombre: "Memoria Descriptiva — Arquitectura", tipo: "memoria_descriptiva", paginas: 38, requiereOCR: false, segundosProceso: 19 },
  { id: "DOC-03", nombre: "Memoria Descriptiva — Estructuras", tipo: "memoria_descriptiva", paginas: 31, requiereOCR: false, segundosProceso: 17 },
  { id: "DOC-04", nombre: "Memoria Descriptiva — Inst. Eléctricas", tipo: "memoria_descriptiva", paginas: 26, requiereOCR: true, segundosProceso: 22 },
  { id: "DOC-05", nombre: "Memoria Descriptiva — Inst. Sanitarias", tipo: "memoria_descriptiva", paginas: 24, requiereOCR: false, segundosProceso: 14 },
  { id: "DOC-06", nombre: "Memoria de Cálculo Estructural", tipo: "memoria_calculo", paginas: 52, requiereOCR: false, segundosProceso: 28 },
  { id: "DOC-07", nombre: "Especificaciones Técnicas — Generales", tipo: "especificaciones", paginas: 29, requiereOCR: false, segundosProceso: 16 },
  { id: "DOC-08", nombre: "Especificaciones Técnicas — Arquitectura", tipo: "especificaciones", paginas: 22, requiereOCR: true, segundosProceso: 18 },
  { id: "DOC-09", nombre: "Especificaciones Técnicas — Estructuras", tipo: "especificaciones", paginas: 18, requiereOCR: false, segundosProceso: 12 },
  { id: "DOC-10", nombre: "Metrados y Presupuesto", tipo: "metrados", paginas: 89, requiereOCR: false, segundosProceso: 34 },
  { id: "DOC-11", nombre: "Planos Arquitectónicos", tipo: "planos", paginas: 56, requiereOCR: true, segundosProceso: 26 },
  { id: "DOC-12", nombre: "Planilla de Áreas", tipo: "otros", paginas: 12, requiereOCR: false, segundosProceso: 8 },
];

// ──────────────────────────────────────────────────────────────────────────
// §5.6 Generador de los 69 hallazgos (no conformidades)
// ──────────────────────────────────────────────────────────────────────────

interface Plantilla {
  titulo: string;
  justificacion: string;
  recomendacion: string;
  especialidad: Especialidad;
  articulo: string; // id de cita normativa
  pagNorma: number;
  documento: string; // nombre del documento del expediente
  pagExp: number;
  textoNorma: string;
  textoExp: string;
}

// Pools temáticos por norma y severidad. Contenido ILUSTRATIVO (placeholder:true).
const POOLS: Record<string, Partial<Record<Severidad, Plantilla[]>>> = {
  "A.040": {
    critica: [
      {
        titulo: "Ancho de pasaje de evacuación menor al mínimo normativo",
        justificacion:
          "El pasaje de circulación del 2.º piso reporta 1.20 m de ancho libre; A.040 exige 1.50 m mínimo para evacuación de aulas. Compromete la salida segura ante sismo o incendio.",
        recomendacion:
          "Rediseñar la circulación a ≥1.50 m de ancho libre y actualizar planos de evacuación y memoria de seguridad.",
        especialidad: "planos",
        articulo: "A.040 Art. 13",
        pagNorma: 18,
        documento: "Planos Arquitectónicos",
        pagExp: 14,
        textoNorma:
          "El ancho mínimo de los pasajes de circulación que sirven como ruta de evacuación será de 1.50 m.",
        textoExp:
          "Pasaje 2.º nivel, eje C-D: ancho libre proyectado 1.20 m entre muros.",
      },
      {
        titulo: "Puerta de aula con apertura contraria al sentido de evacuación",
        justificacion:
          "Tres aulas del bloque B presentan puertas que abren hacia el interior. A.040 exige que las puertas de ambientes con más de 50 ocupantes abran en el sentido de la evacuación.",
        recomendacion:
          "Invertir el sentido de apertura de las puertas afectadas y verificar barra antipánico.",
        especialidad: "planos",
        articulo: "A.040 Art. 15",
        pagNorma: 21,
        documento: "Planos Arquitectónicos",
        pagExp: 22,
        textoNorma:
          "Las puertas de evacuación abrirán en el sentido del flujo de los evacuantes cuando el ambiente albergue más de 50 personas.",
        textoExp: "Detalle de carpintería P-3: hoja abre hacia el interior del aula.",
      },
    ],
    mayor: [
      {
        titulo: "Altura libre de aula por debajo del mínimo",
        justificacion:
          "La memoria reporta 2.85 m de altura libre en aulas; A.040 recomienda 3.00 m para clima costa. Afecta ventilación y confort térmico.",
        recomendacion: "Ajustar altura de piso a techo a 3.00 m o justificar técnicamente la excepción.",
        especialidad: "memoria_descriptiva",
        articulo: "A.040 Art. 9",
        pagNorma: 12,
        documento: "Memoria Descriptiva — Arquitectura",
        pagExp: 19,
        textoNorma: "La altura libre mínima en aulas será de 3.00 m en la región costa.",
        textoExp: "Cuadro de ambientes: aulas tipo con altura libre 2.85 m.",
      },
      {
        titulo: "Índice de ocupación de aula superior al permitido",
        justificacion:
          "Se proyecta 1.40 m²/alumno; A.040 exige 1.60 m²/alumno en nivel primaria. Genera hacinamiento.",
        recomendacion: "Reducir aforo por aula o ampliar área útil hasta cumplir 1.60 m²/alumno.",
        especialidad: "memoria_descriptiva",
        articulo: "A.040 Art. 7",
        pagNorma: 9,
        documento: "Memoria Descriptiva — Arquitectura",
        pagExp: 23,
        textoNorma: "El índice de ocupación mínimo para aulas de primaria es 1.60 m² por alumno.",
        textoExp: "Aula tipo 56 m² para 40 alumnos → 1.40 m²/alumno.",
      },
      {
        titulo: "Servicios higiénicos insuficientes para el aforo",
        justificacion:
          "Relación de aparatos sanitarios por alumno no alcanza el ratio de A.040 para la población escolar declarada.",
        recomendacion: "Incrementar número de inodoros/lavatorios según tabla de dotación de A.040.",
        especialidad: "memoria_descriptiva",
        articulo: "A.040 Art. 11",
        pagNorma: 15,
        documento: "Memoria Descriptiva — Inst. Sanitarias",
        pagExp: 11,
        textoNorma: "Dotación mínima: 1 inodoro por cada 60 alumnos y 1 lavatorio por cada 40.",
        textoExp: "SS.HH. varones primaria: 4 inodoros para 320 alumnos.",
      },
      {
        titulo: "Rampa de accesibilidad con pendiente excesiva",
        justificacion:
          "La rampa de ingreso presenta 10% de pendiente; el máximo accesible es 8% para el desnivel salvado.",
        recomendacion: "Recalcular desarrollo de rampa a ≤8% y añadir descansos intermedios.",
        especialidad: "planos",
        articulo: "A.040 / A.120 Art. 9",
        pagNorma: 24,
        documento: "Planos Arquitectónicos",
        pagExp: 31,
        textoNorma: "La pendiente máxima de rampas accesibles es 8% según el desnivel a salvar.",
        textoExp: "Rampa de patio principal: pendiente proyectada 10%.",
      },
      {
        titulo: "Distancia de recorrido de evacuación excede el máximo",
        justificacion:
          "El recorrido desde el aula más alejada hasta la salida supera los 45 m permitidos.",
        recomendacion: "Añadir una salida adicional o reubicar ambientes para reducir el recorrido.",
        especialidad: "planos",
        articulo: "A.040 Art. 14",
        pagNorma: 19,
        documento: "Planos Arquitectónicos",
        pagExp: 16,
        textoNorma: "La distancia máxima de recorrido hasta una salida de evacuación es 45 m.",
        textoExp: "Aula B-204 a escalera: 52 m de recorrido.",
      },
      {
        titulo: "Falta señalización de ruta de evacuación en bloque B",
        justificacion:
          "Los planos de seguridad no incluyen señalética de evacuación e iluminación de emergencia en el bloque B.",
        recomendacion: "Completar el plano de señalización y luces de emergencia conforme a A.040.",
        especialidad: "planos",
        articulo: "A.040 Art. 16",
        pagNorma: 22,
        documento: "Planos Arquitectónicos",
        pagExp: 40,
        textoNorma: "Toda ruta de evacuación contará con señalización e iluminación de emergencia.",
        textoExp: "Plano SE-02: bloque B sin simbología de evacuación.",
      },
    ],
    menor: [
      {
        titulo: "Altura de baranda de escalera ligeramente menor",
        justificacion: "La baranda reporta 0.88 m; el mínimo recomendado es 0.90 m.",
        recomendacion: "Ajustar la altura de baranda a 0.90 m en el detalle de carpintería metálica.",
        especialidad: "planos",
        articulo: "A.040 Art. 13",
        pagNorma: 18,
        documento: "Planos Arquitectónicos",
        pagExp: 27,
        textoNorma: "La altura mínima de barandas en escaleras es 0.90 m.",
        textoExp: "Detalle D-12: baranda h=0.88 m.",
      },
      {
        titulo: "Color de contraste en peldaños no especificado",
        justificacion: "No se indica banda antideslizante de contraste en el borde de los peldaños.",
        recomendacion: "Especificar banda de contraste antideslizante en escaleras.",
        especialidad: "especificaciones",
        articulo: "A.040 Art. 13",
        pagNorma: 18,
        documento: "Especificaciones Técnicas — Arquitectura",
        pagExp: 9,
        textoNorma: "Se recomienda banda de contraste y antideslizante en el borde de peldaños.",
        textoExp: "EE.TT. escaleras: sin mención de banda de contraste.",
      },
      {
        titulo: "Ventilación cruzada de aula no documentada",
        justificacion: "La memoria no detalla el área efectiva de vanos para ventilación cruzada.",
        recomendacion: "Documentar el cálculo de área de ventilación natural por aula.",
        especialidad: "memoria_descriptiva",
        articulo: "A.040 Art. 10",
        pagNorma: 13,
        documento: "Memoria Descriptiva — Arquitectura",
        pagExp: 21,
        textoNorma: "Las aulas contarán con ventilación natural cruzada suficiente.",
        textoExp: "Memoria: descripción cualitativa sin área de vanos.",
      },
      {
        titulo: "Radio de giro en SS.HH. accesible no acotado",
        justificacion: "El plano no acota el círculo de giro de 1.50 m en el baño accesible.",
        recomendacion: "Acotar el radio de giro de 1.50 m en el SS.HH. para PCD.",
        especialidad: "planos",
        articulo: "A.040 / A.120",
        pagNorma: 25,
        documento: "Planos Arquitectónicos",
        pagExp: 34,
        textoNorma: "El baño accesible debe permitir un giro de 1.50 m de diámetro.",
        textoExp: "Plano A-09: SS.HH. PCD sin cota de giro.",
      },
      {
        titulo: "Acabado de patio sin especificación antideslizante",
        justificacion: "El piso del patio no indica clase de resistencia al deslizamiento.",
        recomendacion: "Especificar piso antideslizante clase ≥ R10 en áreas exteriores.",
        especialidad: "especificaciones",
        articulo: "A.040 Art. 12",
        pagNorma: 16,
        documento: "Especificaciones Técnicas — Arquitectura",
        pagExp: 12,
        textoNorma: "Los pisos en circulaciones serán antideslizantes.",
        textoExp: "EE.TT. pisos exteriores: sin clase de deslizamiento.",
      },
      {
        titulo: "Mobiliario de aula no incluido en memoria",
        justificacion: "Falta listado de mobiliario que valide el índice de ocupación.",
        recomendacion: "Incluir cuadro de mobiliario por ambiente.",
        especialidad: "memoria_descriptiva",
        articulo: "A.040 Art. 7",
        pagNorma: 9,
        documento: "Memoria Descriptiva — Arquitectura",
        pagExp: 24,
        textoNorma: "La distribución considerará el mobiliario propio del nivel educativo.",
        textoExp: "Memoria: sin cuadro de mobiliario.",
      },
      {
        titulo: "Altura de ventana inferior no verificada en aula",
        justificacion: "No se verifica el antepecho de 1.10 m para seguridad en aulas de planta alta.",
        recomendacion: "Verificar y acotar antepecho mínimo de 1.10 m.",
        especialidad: "planos",
        articulo: "A.040 Art. 10",
        pagNorma: 13,
        documento: "Planos Arquitectónicos",
        pagExp: 18,
        textoNorma: "El antepecho de ventanas en pisos altos será ≥1.10 m.",
        textoExp: "Plano A-05: antepecho sin cota verificable.",
      },
    ],
  },
  "E.030": {
    critica: [
      {
        titulo: "Deriva de entrepiso excede el límite sísmico",
        justificacion:
          "El análisis reporta deriva máxima de 0.009 en el eje X; E.030 limita a 0.007 para estructuras de concreto armado. Riesgo estructural ante sismo severo.",
        recomendacion:
          "Rigidizar el sistema (placas adicionales o aumento de secciones) hasta deriva ≤0.007 y reprocesar la memoria de cálculo.",
        especialidad: "memoria_calculo",
        articulo: "E.030 Art. 32",
        pagNorma: 41,
        documento: "Memoria de Cálculo Estructural",
        pagExp: 28,
        textoNorma: "La distorsión máxima de entrepiso para concreto armado es 0.007.",
        textoExp: "Tabla de derivas: dirección X-X deriva máx. 0.009 (piso 2).",
      },
      {
        titulo: "Factor de zona sísmica incorrecto para Lima",
        justificacion:
          "Se empleó Z=0.35; la zona 4 (Lima Metropolitana) exige Z=0.45. Subestima la fuerza sísmica de diseño.",
        recomendacion: "Corregir Z a 0.45 y recalcular cortante basal y elementos.",
        especialidad: "memoria_calculo",
        articulo: "E.030 Art. 10",
        pagNorma: 14,
        documento: "Memoria de Cálculo Estructural",
        pagExp: 7,
        textoNorma: "Para la zona 4 el factor de zona Z es 0.45.",
        textoExp: "Parámetros sísmicos: Z=0.35 (zona 3).",
      },
      {
        titulo: "Irregularidad torsional no penalizada",
        justificacion:
          "Existe irregularidad torsional no considerada en el factor de irregularidad Ip, lo que reduce indebidamente las fuerzas de diseño.",
        recomendacion: "Aplicar el factor Ip correspondiente y reanalizar la estructura.",
        especialidad: "memoria_calculo",
        articulo: "E.030 Art. 20",
        pagNorma: 27,
        documento: "Memoria de Cálculo Estructural",
        pagExp: 33,
        textoNorma: "Las irregularidades en planta penalizan el coeficiente de reducción.",
        textoExp: "Memoria: Ip=1.0 pese a relación de derivas >1.3.",
      },
    ],
    mayor: [
      {
        titulo: "Periodo fundamental sin verificación con análisis modal",
        justificacion: "El periodo empleado no se contrasta con el análisis modal espectral.",
        recomendacion: "Verificar el periodo con el análisis modal y documentar masa participativa ≥90%.",
        especialidad: "memoria_calculo",
        articulo: "E.030 Art. 29",
        pagNorma: 38,
        documento: "Memoria de Cálculo Estructural",
        pagExp: 24,
        textoNorma: "El análisis dinámico considerará modos hasta sumar 90% de masa participativa.",
        textoExp: "Memoria: masa participativa reportada 81%.",
      },
      {
        titulo: "Sistema estructural declarado no coincide con el modelo",
        justificacion: "Se declara muros estructurales pero el modelo se comporta como pórticos.",
        recomendacion: "Reconciliar el coeficiente R con el sistema real verificado.",
        especialidad: "memoria_calculo",
        articulo: "E.030 Art. 16",
        pagNorma: 22,
        documento: "Memoria de Cálculo Estructural",
        pagExp: 18,
        textoNorma: "El coeficiente R corresponde al sistema estructural sismorresistente real.",
        textoExp: "Memoria: R=6 (muros) con <30% de cortante en placas.",
      },
      {
        titulo: "Junta sísmica entre bloques insuficiente",
        justificacion: "La separación entre bloques es menor a la requerida para evitar golpeteo.",
        recomendacion: "Ampliar la junta sísmica según desplazamientos máximos calculados.",
        especialidad: "planos",
        articulo: "E.030 Art. 33",
        pagNorma: 43,
        documento: "Planos Arquitectónicos",
        pagExp: 45,
        textoNorma: "La separación entre edificios evitará el contacto durante el sismo.",
        textoExp: "Plano de juntas: separación 3 cm entre bloques A y B.",
      },
      {
        titulo: "Espectro de diseño sin factor de amplificación correcto",
        justificacion: "El factor C de amplificación sísmica no corresponde al periodo del suelo.",
        recomendacion: "Ajustar el factor C según Tp/Tl del perfil de suelo.",
        especialidad: "memoria_calculo",
        articulo: "E.030 Art. 14",
        pagNorma: 19,
        documento: "Memoria de Cálculo Estructural",
        pagExp: 12,
        textoNorma: "El factor de amplificación sísmica C depende del periodo y del suelo.",
        textoExp: "Espectro: C constante sin transición en Tp.",
      },
    ],
    menor: [
      {
        titulo: "Perfil de suelo S2 sin EMS adjunto",
        justificacion: "Se asume suelo S2 sin estudio de mecánica de suelos referenciado.",
        recomendacion: "Adjuntar el EMS que sustente el factor de suelo.",
        especialidad: "memoria_calculo",
        articulo: "E.030 Art. 12",
        pagNorma: 16,
        documento: "Memoria de Cálculo Estructural",
        pagExp: 6,
        textoNorma: "El factor de suelo se sustenta en el estudio de mecánica de suelos.",
        textoExp: "Memoria: cita EMS no incluido en el expediente.",
      },
      {
        titulo: "Categoría de edificación no explicitada",
        justificacion: "No se declara explícitamente el factor de uso U=1.5 (edificación esencial).",
        recomendacion: "Indicar la categoría A2 y el factor U en los parámetros.",
        especialidad: "memoria_calculo",
        articulo: "E.030 Art. 15",
        pagNorma: 21,
        documento: "Memoria de Cálculo Estructural",
        pagExp: 10,
        textoNorma: "Las edificaciones esenciales tienen factor de uso U=1.5.",
        textoExp: "Parámetros: U no explicitado en el cuadro.",
      },
    ],
  },
  "E.060": {
    critica: [
      {
        titulo: "Cuantía de acero en viga por debajo de la mínima",
        justificacion:
          "Las vigas del pórtico principal presentan cuantía inferior a la mínima de E.060, comprometiendo la capacidad a flexión.",
        recomendacion: "Incrementar el acero longitudinal hasta cumplir la cuantía mínima y rediseñar.",
        especialidad: "memoria_calculo",
        articulo: "E.060 Art. 10.5",
        pagNorma: 34,
        documento: "Memoria de Cálculo Estructural",
        pagExp: 36,
        textoNorma: "La cuantía mínima de refuerzo a flexión es 0.7·√f'c/fy.",
        textoExp: "Viga V-101: As provisto 3.2 cm² < As mín 4.1 cm².",
      },
      {
        titulo: "Recubrimiento de concreto insuficiente en cimentación",
        justificacion:
          "El recubrimiento de zapatas es 5 cm; E.060 exige 7.5 cm en concreto vaciado contra suelo. Riesgo de corrosión del acero.",
        recomendacion: "Aumentar el recubrimiento a 7.5 cm y actualizar planos de cimentación.",
        especialidad: "planos",
        articulo: "E.060 Art. 7.7",
        pagNorma: 28,
        documento: "Planos Arquitectónicos",
        pagExp: 49,
        textoNorma: "El recubrimiento mínimo contra suelo es 7.5 cm.",
        textoExp: "Detalle de zapata Z-3: recubrimiento indicado 5 cm.",
      },
    ],
    mayor: [
      {
        titulo: "Separación de estribos en zona de confinamiento excedida",
        justificacion: "Los estribos en la zona de confinamiento de columnas superan la separación máxima.",
        recomendacion: "Reducir el espaciamiento de estribos en la longitud de confinamiento.",
        especialidad: "memoria_calculo",
        articulo: "E.060 Art. 21",
        pagNorma: 44,
        documento: "Memoria de Cálculo Estructural",
        pagExp: 41,
        textoNorma: "En zonas de confinamiento, s ≤ menor de (d/4, 10 db, 100 mm).",
        textoExp: "Columna C-2: estribos @150 mm en confinamiento.",
      },
      {
        titulo: "Resistencia f'c especificada inconsistente entre documentos",
        justificacion: "La memoria indica f'c=210 y las EE.TT. f'c=175 para el mismo elemento.",
        recomendacion: "Unificar la resistencia del concreto entre memoria, EE.TT. y planos.",
        especialidad: "especificaciones",
        articulo: "E.060 Art. 4",
        pagNorma: 11,
        documento: "Especificaciones Técnicas — Estructuras",
        pagExp: 8,
        textoNorma: "La resistencia especificada f'c será consistente en todo el proyecto.",
        textoExp: "EE.TT.: f'c=175 kg/cm² para columnas; memoria 210.",
      },
      {
        titulo: "Longitud de desarrollo de barras no verificada",
        justificacion: "No se verifica la longitud de anclaje del acero en nudos.",
        recomendacion: "Verificar y detallar las longitudes de desarrollo y ganchos.",
        especialidad: "memoria_calculo",
        articulo: "E.060 Art. 12",
        pagNorma: 37,
        documento: "Memoria de Cálculo Estructural",
        pagExp: 39,
        textoNorma: "Las barras desarrollarán la longitud de anclaje requerida.",
        textoExp: "Memoria: sin verificación de ld en nudos viga-columna.",
      },
    ],
    menor: [
      {
        titulo: "Asentamiento máximo de losa sin verificación de deflexión",
        justificacion: "No se reporta la verificación de deflexiones de servicio en losas.",
        recomendacion: "Incluir verificación de deflexión instantánea y diferida.",
        especialidad: "memoria_calculo",
        articulo: "E.060 Art. 9.6",
        pagNorma: 32,
        documento: "Memoria de Cálculo Estructural",
        pagExp: 30,
        textoNorma: "Las deflexiones de servicio no excederán los límites de la tabla 9.1.",
        textoExp: "Memoria: deflexiones no tabuladas.",
      },
      {
        titulo: "Detalle de junta de construcción ausente",
        justificacion: "Falta el detalle de juntas de construcción en losas extensas.",
        recomendacion: "Añadir el detalle típico de junta de construcción.",
        especialidad: "planos",
        articulo: "E.060 Art. 6",
        pagNorma: 24,
        documento: "Planos Arquitectónicos",
        pagExp: 51,
        textoNorma: "Las juntas de construcción se ubicarán y detallarán en planos.",
        textoExp: "Planos: sin detalle de junta de construcción.",
      },
    ],
  },
  "E.070": {
    critica: [
      {
        titulo: "Muro portante sin confinamiento en zona sísmica",
        justificacion:
          "Un muro portante de albañilería carece de columnas de confinamiento, prohibido en zona sísmica 4.",
        recomendacion: "Confinar el muro con columnas y vigas soleras o reclasificarlo como no portante.",
        especialidad: "memoria_calculo",
        articulo: "E.070 Art. 27",
        pagNorma: 31,
        documento: "Memoria de Cálculo Estructural",
        pagExp: 44,
        textoNorma: "En zonas sísmicas, la albañilería portante será confinada o armada.",
        textoExp: "Muro M-7: portante sin elementos de confinamiento.",
      },
    ],
    mayor: [
      {
        titulo: "Densidad de muros en una dirección por debajo del mínimo",
        justificacion: "La densidad de muros en la dirección Y es inferior al mínimo de E.070.",
        recomendacion: "Incrementar la densidad de muros o añadir placas en la dirección débil.",
        especialidad: "memoria_calculo",
        articulo: "E.070 Art. 19",
        pagNorma: 24,
        documento: "Memoria de Cálculo Estructural",
        pagExp: 46,
        textoNorma: "La densidad mínima de muros se verifica en ambas direcciones.",
        textoExp: "Memoria: densidad Y-Y 0.8% < mínimo requerido.",
      },
      {
        titulo: "Resistencia f'm de la albañilería no ensayada",
        justificacion: "Se asume f'm sin respaldo de ensayo de pilas/muretes.",
        recomendacion: "Sustentar f'm con ensayos o adoptar valores conservadores de la norma.",
        especialidad: "especificaciones",
        articulo: "E.070 Art. 13",
        pagNorma: 17,
        documento: "Especificaciones Técnicas — Estructuras",
        pagExp: 14,
        textoNorma: "La resistencia f'm se obtiene de ensayos de prisma o de tabla normativa.",
        textoExp: "EE.TT.: f'm asumido sin ensayo referenciado.",
      },
    ],
    menor: [
      {
        titulo: "Tipo de unidad de albañilería no especificado",
        justificacion: "No se indica si la unidad es King Kong industrial clase V.",
        recomendacion: "Especificar clase y tipo de ladrillo conforme a E.070.",
        especialidad: "especificaciones",
        articulo: "E.070 Art. 5",
        pagNorma: 8,
        documento: "Especificaciones Técnicas — Estructuras",
        pagExp: 15,
        textoNorma: "Las unidades de albañilería para muros portantes serán clase IV o V.",
        textoExp: "EE.TT.: 'ladrillo King Kong' sin clase.",
      },
      {
        titulo: "Espesor de junta de mortero fuera de rango",
        justificacion: "No se acota el espesor de junta (debe ser 1.0–1.5 cm).",
        recomendacion: "Especificar espesor de junta de mortero 1.0–1.5 cm.",
        especialidad: "especificaciones",
        articulo: "E.070 Art. 11",
        pagNorma: 15,
        documento: "Especificaciones Técnicas — Estructuras",
        pagExp: 16,
        textoNorma: "El espesor de las juntas de mortero será de 1.0 a 1.5 cm.",
        textoExp: "EE.TT.: espesor de junta no indicado.",
      },
    ],
  },
  "RVM 104-2019": {
    critica: [
      {
        titulo: "Área de aula de inicial menor a la norma RVM 104-2019",
        justificacion:
          "El aula de educación inicial proyecta 48 m²; la RVM 104-2019 exige 59 m² para el aforo declarado.",
        recomendacion: "Ampliar el área del aula de inicial a ≥59 m² o reducir el aforo.",
        especialidad: "planos",
        articulo: "RVM 104-2019 Num. 6.2",
        pagNorma: 22,
        documento: "Planos Arquitectónicos",
        pagExp: 20,
        textoNorma: "El área mínima del aula de inicial es 59 m² para 25 niños.",
        textoExp: "Aula inicial A-1: 48 m² para 25 niños.",
      },
    ],
    mayor: [
      {
        titulo: "Falta área de psicomotricidad en nivel inicial",
        justificacion: "No se contempla el ambiente de psicomotricidad obligatorio para inicial.",
        recomendacion: "Incorporar el ambiente de psicomotricidad según RVM 104-2019.",
        especialidad: "memoria_descriptiva",
        articulo: "RVM 104-2019 Num. 6.4",
        pagNorma: 26,
        documento: "Memoria Descriptiva — Arquitectura",
        pagExp: 28,
        textoNorma: "El nivel inicial contará con un ambiente de psicomotricidad.",
        textoExp: "Programa arquitectónico: sin ambiente de psicomotricidad.",
      },
      {
        titulo: "SS.HH. de inicial sin aparatos a escala infantil",
        justificacion: "Los aparatos sanitarios no consideran las dimensiones a escala infantil.",
        recomendacion: "Especificar aparatos sanitarios de escala infantil para inicial.",
        especialidad: "especificaciones",
        articulo: "RVM 104-2019 Num. 6.6",
        pagNorma: 29,
        documento: "Especificaciones Técnicas — Arquitectura",
        pagExp: 13,
        textoNorma: "Los SS.HH. de inicial usarán aparatos a escala de los niños.",
        textoExp: "EE.TT.: inodoros estándar para inicial.",
      },
      {
        titulo: "Patio de inicial sin separación del nivel primaria",
        justificacion: "El patio de inicial no está diferenciado del de primaria por seguridad.",
        recomendacion: "Delimitar y separar el patio de inicial.",
        especialidad: "planos",
        articulo: "RVM 104-2019 Num. 6.8",
        pagNorma: 31,
        documento: "Planos Arquitectónicos",
        pagExp: 33,
        textoNorma: "El área exterior de inicial estará diferenciada de otros niveles.",
        textoExp: "Plano de patios: inicial y primaria comparten patio.",
      },
      {
        titulo: "Altura de antepecho de ventanas inadecuada para inicial",
        justificacion: "El antepecho permite visibilidad insegura para niños pequeños.",
        recomendacion: "Ajustar la altura de antepecho conforme a la norma de inicial.",
        especialidad: "planos",
        articulo: "RVM 104-2019 Num. 6.3",
        pagNorma: 24,
        documento: "Planos Arquitectónicos",
        pagExp: 21,
        textoNorma: "El antepecho en aulas de inicial garantizará seguridad y visión adecuada.",
        textoExp: "Plano A-04: antepecho 1.20 m en aula inicial.",
      },
    ],
    menor: [
      {
        titulo: "Color y señalética por nivel no definidos",
        justificacion: "Falta el criterio de color/señalética diferenciado para inicial.",
        recomendacion: "Definir paleta y señalética del nivel inicial.",
        especialidad: "especificaciones",
        articulo: "RVM 104-2019 Num. 7",
        pagNorma: 34,
        documento: "Especificaciones Técnicas — Arquitectura",
        pagExp: 17,
        textoNorma: "Se recomienda señalética diferenciada por nivel educativo.",
        textoExp: "EE.TT.: sin criterio de señalética por nivel.",
      },
      {
        titulo: "Mobiliario de inicial no dimensionado",
        justificacion: "El mobiliario no se dimensiona a escala infantil en la memoria.",
        recomendacion: "Dimensionar mobiliario a escala infantil.",
        especialidad: "memoria_descriptiva",
        articulo: "RVM 104-2019 Num. 6.5",
        pagNorma: 27,
        documento: "Memoria Descriptiva — Arquitectura",
        pagExp: 29,
        textoNorma: "El mobiliario del nivel inicial será a escala de los niños.",
        textoExp: "Memoria: mobiliario sin dimensiones.",
      },
      {
        titulo: "Lavadero de aula de inicial no previsto",
        justificacion: "No se prevé el lavadero dentro del aula de inicial.",
        recomendacion: "Incluir lavadero dentro del aula de inicial.",
        especialidad: "planos",
        articulo: "RVM 104-2019 Num. 6.2",
        pagNorma: 22,
        documento: "Planos Arquitectónicos",
        pagExp: 22,
        textoNorma: "El aula de inicial contará con lavadero interno.",
        textoExp: "Plano A-04: aula inicial sin lavadero.",
      },
      {
        titulo: "Área verde por alumno no documentada (inicial)",
        justificacion: "No se documenta el ratio de área verde para el nivel inicial.",
        recomendacion: "Documentar el área verde por alumno.",
        especialidad: "memoria_descriptiva",
        articulo: "RVM 104-2019 Num. 6.9",
        pagNorma: 32,
        documento: "Memoria Descriptiva — Arquitectura",
        pagExp: 30,
        textoNorma: "Se preverá área verde acorde al número de alumnos.",
        textoExp: "Memoria: sin ratio de área verde.",
      },
      {
        titulo: "Acceso diferenciado de inicial no señalizado",
        justificacion: "El ingreso del nivel inicial no está señalizado de forma independiente.",
        recomendacion: "Señalizar el acceso independiente del nivel inicial.",
        especialidad: "planos",
        articulo: "RVM 104-2019 Num. 6.8",
        pagNorma: 31,
        documento: "Planos Arquitectónicos",
        pagExp: 35,
        textoNorma: "Se recomienda acceso diferenciado para el nivel inicial.",
        textoExp: "Plano de accesos: ingreso único para todos los niveles.",
      },
    ],
  },
  "RVM 084-2019": {
    critica: [
      {
        titulo: "Área de aula de primaria menor al estándar RVM 084-2019",
        justificacion:
          "Las aulas de primaria proyectan 1.40 m²/alumno; la RVM 084-2019 fija el estándar en 1.60 m²/alumno. Incumple áreas mínimas.",
        recomendacion: "Redimensionar las aulas de primaria al estándar de área de la RVM 084-2019.",
        especialidad: "planos",
        articulo: "RVM 084-2019 Num. 5.3",
        pagNorma: 33,
        documento: "Planos Arquitectónicos",
        pagExp: 23,
        textoNorma: "El estándar de área para aulas de primaria es 1.60 m² por estudiante.",
        textoExp: "Aula P-3: 56 m² para 40 alumnos → 1.40 m²/alumno.",
      },
      {
        titulo: "Ausencia de ambiente de aula de innovación pedagógica (AIP)",
        justificacion:
          "El proyecto no contempla el AIP exigido por la RVM 084-2019 para primaria/secundaria.",
        recomendacion: "Incorporar el aula de innovación pedagógica al programa.",
        especialidad: "memoria_descriptiva",
        articulo: "RVM 084-2019 Num. 5.6",
        pagNorma: 39,
        documento: "Memoria Descriptiva — Arquitectura",
        pagExp: 26,
        textoNorma: "Las IIEE de primaria/secundaria contarán con un AIP.",
        textoExp: "Programa: sin AIP.",
      },
      {
        titulo: "Escalera de evacuación con ancho insuficiente para el aforo",
        justificacion:
          "El ancho de escalera no satisface el aforo total declarado según la RVM 084-2019.",
        recomendacion: "Ampliar el ancho de escalera o añadir una segunda caja conforme al aforo.",
        especialidad: "planos",
        articulo: "RVM 084-2019 Num. 5.9",
        pagNorma: 45,
        documento: "Planos Arquitectónicos",
        pagExp: 25,
        textoNorma: "El ancho de escaleras de evacuación se dimensiona según el aforo.",
        textoExp: "Escalera E-1: 1.20 m para 480 ocupantes.",
      },
    ],
    mayor: [
      {
        titulo: "Falta laboratorio de ciencias para secundaria",
        justificacion: "El programa no incluye el laboratorio de ciencias requerido.",
        recomendacion: "Incorporar laboratorio de ciencias con su dotación.",
        especialidad: "memoria_descriptiva",
        articulo: "RVM 084-2019 Num. 5.7",
        pagNorma: 41,
        documento: "Memoria Descriptiva — Arquitectura",
        pagExp: 27,
        textoNorma: "El nivel secundaria contará con laboratorio de ciencias.",
        textoExp: "Programa: sin laboratorio de ciencias.",
      },
      {
        titulo: "Biblioteca con área inferior a la mínima",
        justificacion: "El área de biblioteca está por debajo del estándar de la RVM 084-2019.",
        recomendacion: "Ampliar la biblioteca al área mínima normativa.",
        especialidad: "planos",
        articulo: "RVM 084-2019 Num. 5.5",
        pagNorma: 37,
        documento: "Planos Arquitectónicos",
        pagExp: 29,
        textoNorma: "La biblioteca cumplirá el área mínima según matrícula.",
        textoExp: "Biblioteca: 42 m² para 600 estudiantes.",
      },
      {
        titulo: "Dotación de SS.HH. de secundaria insuficiente",
        justificacion: "La dotación de aparatos sanitarios no satisface el aforo de secundaria.",
        recomendacion: "Incrementar aparatos sanitarios según la tabla de la RVM 084-2019.",
        especialidad: "memoria_descriptiva",
        articulo: "RVM 084-2019 Num. 5.8",
        pagNorma: 43,
        documento: "Memoria Descriptiva — Inst. Sanitarias",
        pagExp: 13,
        textoNorma: "La dotación sanitaria se calcula según matrícula por nivel.",
        textoExp: "SS.HH. secundaria: dotación 70% de la requerida.",
      },
      {
        titulo: "Patio de usos múltiples sin techo de protección solar",
        justificacion: "El patio principal no cuenta con cobertura para clima costa.",
        recomendacion: "Evaluar cobertura ligera del patio de usos múltiples.",
        especialidad: "planos",
        articulo: "RVM 084-2019 Num. 5.10",
        pagNorma: 47,
        documento: "Planos Arquitectónicos",
        pagExp: 36,
        textoNorma: "Se recomienda protección solar en patios de uso intensivo.",
        textoExp: "Plano de patios: sin cobertura.",
      },
      {
        titulo: "Pasaje de circulación de aulas por debajo del ancho",
        justificacion: "Las galerías de aulas no alcanzan el ancho mínimo para primaria/secundaria.",
        recomendacion: "Ampliar las galerías al ancho mínimo normativo.",
        especialidad: "planos",
        articulo: "RVM 084-2019 Num. 5.9",
        pagNorma: 45,
        documento: "Planos Arquitectónicos",
        pagExp: 24,
        textoNorma: "Las galerías de aulas tendrán el ancho mínimo según evacuación.",
        textoExp: "Galería bloque B: 1.80 m de ancho.",
      },
      {
        titulo: "Cocina/comedor de QaliWarma no contemplado",
        justificacion: "No se prevé ambiente para el programa de alimentación escolar.",
        recomendacion: "Incorporar cocina/almacén conforme a lineamientos.",
        especialidad: "memoria_descriptiva",
        articulo: "RVM 084-2019 Num. 5.11",
        pagNorma: 49,
        documento: "Memoria Descriptiva — Arquitectura",
        pagExp: 31,
        textoNorma: "Se preverá ambiente para el servicio de alimentación escolar.",
        textoExp: "Programa: sin cocina/comedor.",
      },
      {
        titulo: "Dirección y sala de profesores subdimensionadas",
        justificacion: "Las áreas administrativas no cumplen el área mínima por personal.",
        recomendacion: "Ajustar áreas administrativas al estándar.",
        especialidad: "planos",
        articulo: "RVM 084-2019 Num. 5.4",
        pagNorma: 35,
        documento: "Planos Arquitectónicos",
        pagExp: 32,
        textoNorma: "Las áreas administrativas cumplen el área mínima por personal.",
        textoExp: "Sala de profesores: 24 m² para 30 docentes.",
      },
    ],
    menor: [
      {
        titulo: "Tópico de primeros auxilios sin equipamiento detallado",
        justificacion: "No se detalla el equipamiento del tópico.",
        recomendacion: "Detallar el equipamiento del tópico.",
        especialidad: "memoria_descriptiva",
        articulo: "RVM 084-2019 Num. 5.12",
        pagNorma: 51,
        documento: "Memoria Descriptiva — Arquitectura",
        pagExp: 33,
        textoNorma: "El tópico contará con el equipamiento básico de primeros auxilios.",
        textoExp: "Memoria: tópico sin lista de equipamiento.",
      },
      {
        titulo: "Iluminación natural de aulas no cuantificada",
        justificacion: "No se cuantifica el factor de luz día por aula.",
        recomendacion: "Cuantificar la iluminación natural por aula.",
        especialidad: "memoria_descriptiva",
        articulo: "RVM 084-2019 Num. 5.3",
        pagNorma: 33,
        documento: "Memoria Descriptiva — Arquitectura",
        pagExp: 24,
        textoNorma: "Las aulas garantizarán iluminación natural adecuada.",
        textoExp: "Memoria: descripción cualitativa de iluminación.",
      },
      {
        titulo: "Señalización de aforo por ambiente ausente",
        justificacion: "Falta indicar el aforo máximo por ambiente.",
        recomendacion: "Indicar el aforo por ambiente en planos.",
        especialidad: "planos",
        articulo: "RVM 084-2019 Num. 5.9",
        pagNorma: 45,
        documento: "Planos Arquitectónicos",
        pagExp: 37,
        textoNorma: "Se señalizará el aforo máximo por ambiente.",
        textoExp: "Planos: sin rótulo de aforo.",
      },
      {
        titulo: "Depósito de material educativo no previsto",
        justificacion: "No se prevé un depósito para material educativo.",
        recomendacion: "Prever un depósito de material educativo.",
        especialidad: "memoria_descriptiva",
        articulo: "RVM 084-2019 Num. 5.6",
        pagNorma: 39,
        documento: "Memoria Descriptiva — Arquitectura",
        pagExp: 34,
        textoNorma: "Se recomienda un depósito para material educativo.",
        textoExp: "Programa: sin depósito.",
      },
    ],
  },
  "RVM 010-2022": {
    critica: [
      {
        titulo: "Criterio de confort térmico no aplicado a clima costa",
        justificacion:
          "No se aplica el criterio bioclimático de la RVM 010-2022 para la zona climática del proyecto.",
        recomendacion: "Aplicar los criterios bioclimáticos por zona y documentarlos.",
        especialidad: "memoria_descriptiva",
        articulo: "RVM 010-2022 Num. 4.2",
        pagNorma: 19,
        documento: "Memoria Descriptiva",
        pagExp: 41,
        textoNorma: "El diseño aplicará criterios bioclimáticos según la zona climática.",
        textoExp: "Memoria: sin análisis bioclimático.",
      },
    ],
    mayor: [
      {
        titulo: "Gestión de riesgo de desastres no integrada al diseño",
        justificacion: "Falta el componente de gestión del riesgo de desastres en la memoria.",
        recomendacion: "Integrar el análisis de riesgo y medidas de mitigación.",
        especialidad: "memoria_descriptiva",
        articulo: "RVM 010-2022 Num. 5.1",
        pagNorma: 23,
        documento: "Memoria Descriptiva",
        pagExp: 44,
        textoNorma: "El proyecto integrará la gestión del riesgo de desastres.",
        textoExp: "Memoria: sin sección de GRD.",
      },
      {
        titulo: "Criterios de sostenibilidad/eficiencia no documentados",
        justificacion: "No se documentan medidas de eficiencia energética o hídrica.",
        recomendacion: "Documentar medidas de sostenibilidad conforme a la RVM 010-2022.",
        especialidad: "memoria_descriptiva",
        articulo: "RVM 010-2022 Num. 4.5",
        pagNorma: 21,
        documento: "Memoria Descriptiva",
        pagExp: 46,
        textoNorma: "Se incorporarán criterios de eficiencia energética e hídrica.",
        textoExp: "Memoria: sin medidas de eficiencia.",
      },
      {
        titulo: "Accesibilidad universal parcialmente resuelta",
        justificacion: "Algunos recorridos no garantizan la cadena de accesibilidad completa.",
        recomendacion: "Completar la cadena de accesibilidad en todos los recorridos.",
        especialidad: "planos",
        articulo: "RVM 010-2022 Num. 4.4",
        pagNorma: 20,
        documento: "Planos Arquitectónicos",
        pagExp: 38,
        textoNorma: "Se garantizará una cadena de accesibilidad continua.",
        textoExp: "Planos: rampa sin conexión accesible al 2.º piso.",
      },
    ],
    menor: [
      {
        titulo: "Memoria no referencia la versión vigente de la RVM 010-2022",
        justificacion: "Se cita una versión anterior de la norma de criterios generales.",
        recomendacion: "Actualizar las referencias a la versión vigente.",
        especialidad: "memoria_descriptiva",
        articulo: "RVM 010-2022",
        pagNorma: 2,
        documento: "Memoria Descriptiva",
        pagExp: 3,
        textoNorma: "Aplica la versión vigente de los criterios generales de diseño.",
        textoExp: "Memoria: cita norma derogada.",
      },
      {
        titulo: "Cuadro de áreas no consolidado por nivel",
        justificacion: "El cuadro de áreas no está consolidado por nivel educativo.",
        recomendacion: "Consolidar el cuadro de áreas por nivel.",
        especialidad: "otros",
        articulo: "RVM 010-2022 Num. 4.1",
        pagNorma: 18,
        documento: "Planilla de Áreas",
        pagExp: 5,
        textoNorma: "El cuadro de áreas se consolidará por nivel y ambiente.",
        textoExp: "Planilla: áreas sin consolidar por nivel.",
      },
      {
        titulo: "Coherencia de simbología entre planos y memoria",
        justificacion: "Existen diferencias menores de simbología entre planos y memoria.",
        recomendacion: "Unificar la simbología y leyendas.",
        especialidad: "planos",
        articulo: "RVM 010-2022 Num. 6",
        pagNorma: 28,
        documento: "Planos Arquitectónicos",
        pagExp: 43,
        textoNorma: "La documentación mantendrá coherencia gráfica y de simbología.",
        textoExp: "Planos: leyenda difiere de la memoria.",
      },
    ],
  },
  "PMBOK 6": {
    mayor: [
      {
        titulo: "Cronograma sin ruta crítica ni hitos de control",
        justificacion:
          "El cronograma del expediente no identifica la ruta crítica ni hitos de control del proyecto.",
        recomendacion: "Elaborar el cronograma con ruta crítica e hitos según PMBOK.",
        especialidad: "otros",
        articulo: "PMBOK 6 — Cronograma",
        pagNorma: 173,
        documento: "Metrados y Presupuesto",
        pagExp: 72,
        textoNorma: "La gestión del cronograma define la ruta crítica y los hitos.",
        textoExp: "Cronograma: barras sin ruta crítica ni hitos.",
      },
    ],
    menor: [
      {
        titulo: "Matriz de riesgos del proyecto no incluida",
        justificacion: "No se adjunta una matriz de riesgos del proyecto.",
        recomendacion: "Incluir una matriz de riesgos con respuestas planificadas.",
        especialidad: "otros",
        articulo: "PMBOK 6 — Riesgos",
        pagNorma: 395,
        documento: "Metrados y Presupuesto",
        pagExp: 80,
        textoNorma: "La gestión de riesgos documenta riesgos y respuestas.",
        textoExp: "Expediente: sin matriz de riesgos.",
      },
    ],
  },
};

const dictamenPorSeveridad = (sev: Severidad): "No Cumple" | "Observado" =>
  sev === "menor" ? "Observado" : "No Cumple";

function slugRequisito(articulo: string, n: number): string {
  const base = articulo
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
  return `${base}_R${String(n).padStart(2, "0")}`;
}

/**
 * Genera los 69 objetos Hallazgo a partir de los conteos de severidad de §5.4.
 * Determinista (sin aleatoriedad) para reproducibilidad y persistencia estable.
 */
export function generarHallazgos(normas: NormaResumen[]): Hallazgo[] {
  const out: Hallazgo[] = [];
  let counter = 0;
  const severidades: Array<"critica" | "mayor" | "menor"> = ["critica", "mayor", "menor"];

  for (const norma of normas) {
    for (const sev of severidades) {
      const cantidad = norma[sev];
      const pool = POOLS[norma.codigo]?.[sev] ?? [];
      for (let i = 0; i < cantidad; i++) {
        counter += 1;
        const id = `H-${String(counter).padStart(3, "0")}`;
        const tpl = pool[i % Math.max(pool.length, 1)];
        const variante = pool.length > 0 && i >= pool.length ? ` (caso ${i + 1})` : "";

        if (!tpl) {
          // Respaldo defensivo: nunca debería ocurrir con los pools completos.
          out.push({
            id,
            idRequisito: slugRequisito(norma.codigo, counter),
            norma: norma.codigo,
            especialidad: "otros",
            dictamen: dictamenPorSeveridad(sev),
            severidad: sev,
            titulo: `No conformidad ${sev} en ${norma.codigo} — ${norma.nombre}`,
            justificacion: `Hallazgo ${sev} detectado para la norma ${norma.codigo} (${norma.nombre}).`,
            recomendacion: "Revisar y subsanar conforme a la norma aplicable.",
            citaNorma: { id: norma.codigo, pagina: 1, texto: "Referencia normativa pendiente." },
            citaExpediente: {
              documento: "Memoria Descriptiva",
              pagina: 1,
              texto: "Referencia del expediente pendiente.",
            },
            estado: "por_revisar",
            placeholder: true,
          });
          continue;
        }

        out.push({
          id,
          idRequisito: slugRequisito(tpl.articulo, counter),
          norma: norma.codigo,
          especialidad: tpl.especialidad,
          dictamen: dictamenPorSeveridad(sev),
          severidad: sev,
          titulo: tpl.titulo + variante,
          justificacion: tpl.justificacion,
          recomendacion: tpl.recomendacion,
          citaNorma: { id: tpl.articulo, pagina: tpl.pagNorma, texto: tpl.textoNorma },
          citaExpediente: {
            documento: tpl.documento,
            pagina: tpl.pagExp,
            texto: tpl.textoExp,
          },
          estado: "por_revisar",
          placeholder: true, // contenido ilustrativo (§5.6 / §14)
        });
      }
    }
  }

  return out;
}

export const hallazgosSeed: Hallazgo[] = generarHallazgos(normasSeed);

export const datasetSeed = {
  proyecto: proyectoSeed,
  kpis: kpisSeed,
  normas: normasSeed,
  hallazgos: hallazgosSeed,
  documentos: documentosSeed,
};
