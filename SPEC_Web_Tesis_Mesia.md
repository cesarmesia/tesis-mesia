# SPEC — Plataforma Web de Resultados de Tesis
### "Verificación automatizada de expedientes técnicos" — César Yair Mesia Gómez (UPC, Ingeniería Civil)

> **Para:** Claude Code.
> **Objetivo:** construir una aplicación web en Next.js que presente los resultados de la tesis de forma **dinámica y editable**, con **dashboard interactivo**, **tablero Kanban de omisiones**, **chatbot de consulta (por archivo y del proyecto)** y una funcionalidad extra: el **Índice de Riesgo de Paralización (IRP)**.
> **Caso piloto (datos semilla):** I.E. N° 7074 "La Inmaculada" — San Juan de Miraflores, Lima. Área 3,546.50 m², presupuesto S/ 10,289,658.68, 484 páginas, 12 documentos, 1,266 requisitos.

---

## 0. Cómo usar este documento
Construye en el orden de la sección **§12 Build order**. No improvises el diseño visual: respeta los tokens de **§3**. Todos los números de la **§5 (datos semilla)** salen de la tesis real; cárgalos tal cual. Donde la tesis tiene inconsistencias internas, ya están resueltas y anotadas (ver **§5.4**).

---

## 1. Resumen del producto

**Qué resuelve (1 frase):** dar a un revisor técnico / jurado / institución (PRONIED) una vista viva, auditable y conversable del estado de cumplimiento normativo de un expediente técnico verificado por IA, y permitirle *controlar* y dar seguimiento a las no conformidades hasta su subsanación.

**Usuario principal:** revisor técnico de infraestructura educativa pública (o el jurado de tesis evaluando la solución). No necesariamente programador; español; aprende el sistema en < 2 h (restricción R6 de la tesis).

**Momento "aha":** ver un expediente de 484 páginas convertido en un panel donde cada hallazgo es navegable, conversable y movible — y donde el riesgo de paralización baja en vivo a medida que se subsanan omisiones.

**Acción más importante:** entender y gestionar las **50 no conformidades** (priorizar críticas → subsanar → reducir riesgo).

**Diferenciador:** no es un dashboard estático. Todo dato es editable y todo cambio recalcula KPIs, gráficos y el IRP en tiempo real.

---

## 2. Stack técnico (fijo)

| Capa | Tecnología | Notas |
|---|---|---|
| Framework | **Next.js 14+ (App Router)** + TypeScript | RSC + route handlers |
| Estilos | **Tailwind CSS** | tokens de §3 vía CSS variables |
| Componentes | **shadcn/ui** | instalar set de §8 |
| Animación | **Framer Motion** | look "Framer" (springs, layout animations) |
| Gráficos | **Recharts** | KPIs, barras apiladas, dona, heatmap |
| Estado | **Zustand** (+ `persist` a localStorage) | store global editable |
| Kanban DnD | **@dnd-kit/core** + `@dnd-kit/sortable` | NO usar react-beautiful-dnd (deprecado) |
| Iconos | **lucide-react** | |
| Tablas | **@tanstack/react-table** | vista de trazabilidad |
| LLM | **@anthropic-ai/sdk** | en route handler; provider-agnostic |
| Validación | **zod** | esquemas de datos e import JSON |
| Deploy | **Vercel** | |

Gestor de paquetes: `pnpm`. Node 20+.

---

## 3. Sistema de diseño ("estilo Framer")

Look objetivo: minimalista, mucho aire, tipografía grande, neutros fríos + UN acento, esquinas redondeadas (squircle), sombras suaves en lugar de bordes, toques de *glass*, movimiento por springs. Soporta **modo claro y oscuro** (oscuro por defecto, muy Framer).

### 3.1 Tokens de color (CSS variables en `globals.css`)
```css
:root {
  /* Neutros (fríos, tipo slate) */
  --bg: 0 0% 100%;
  --surface: 240 20% 99%;
  --surface-2: 240 14% 96%;
  --border: 240 10% 90%;
  --text: 240 10% 10%;
  --text-muted: 240 5% 45%;

  /* Acento (índigo eléctrico, "Framer-ish") */
  --accent: 245 80% 60%;
  --accent-fg: 0 0% 100%;

  /* Semánticos para dictámenes / severidad */
  --ok: 152 60% 42%;        /* Cumple */
  --observed: 38 92% 50%;   /* Observado */
  --fail: 0 75% 58%;        /* No cumple */

  --sev-critica: 0 75% 55%;
  --sev-mayor: 25 90% 55%;
  --sev-menor: 45 90% 55%;

  --radius: 14px;           /* squircle */
}
.dark {
  --bg: 240 10% 6%;
  --surface: 240 9% 9%;
  --surface-2: 240 8% 13%;
  --border: 240 6% 18%;
  --text: 0 0% 98%;
  --text-muted: 240 5% 60%;
  --accent: 245 90% 66%;
}
```
Usa `hsl(var(--token))` en Tailwind config. Define los semánticos como utilidades.

### 3.2 Tipografía
- **Display/Headings:** `Geist` o `Inter` (variable). H1 grande (text-4xl/5xl, tracking-tight, font-semibold).
- **Body:** `Inter`. base 15–16px, line-height holgado (1.6).
- **Mono:** `Geist Mono` para citas normativas / IDs / JSON.
- Máximo 3 tamaños tipográficos por pantalla. Tipografía = 80% del diseño: cuídala.

### 3.3 Espaciado, radios, sombras, motion
- Escala 4px: `4, 8, 12, 16, 24, 32, 48, 64`. Padding lateral ≥ 16–20px (mobile-first).
- Radios: cards `--radius` (14px), botones 10px, pills full.
- Sombras suaves (`shadow-sm`/`shadow-md` custom de baja opacidad). **Evitar bordes duros** salvo separadores sutiles.
- Glass: superficies elevadas con `backdrop-blur` + fondo translúcido (`bg-surface/70`).
- **Motion (Framer Motion):** entradas con `spring` (stiffness ~260, damping ~30); `layout` animations en cards del Kanban y al cambiar de vista; `AnimatePresence` en modales y números que cambian (count-up en KPIs). Nada de animaciones largas (>350ms).

### 3.4 Reglas de craft (checklist por pantalla)
- [ ] El usuario sabe dónde está (breadcrumb / título grande).
- [ ] La CTA más importante es la más visible.
- [ ] Funciona en oscuro y en pantalla pequeña.
- [ ] Hay **empty state** definido (sin datos).
- [ ] Alineación a grid, espaciado en múltiplos de 4.

---

## 4. Arquitectura de información

Navegación lateral (sidebar colapsable, máx. items visibles ~7). Selector de **proyecto** arriba (preparado para multi-expediente; semilla = 1).

```
/                      → Dashboard ejecutivo (KPIs + IRP resumido)
/normas                → Cumplimiento por norma
/severidad             → Severidad de no conformidades
/especialidades        → Desempeño por especialidad/documento
/trazabilidad          → Tabla navegable de hallazgos (requisito ↔ página ↔ norma)
/omisiones             → Tablero KANBAN de no conformidades (control)
/riesgo                → Índice de Riesgo de Paralización (FEATURE EXTRA)
/chat                  → Asistente conversacional (proyecto + por archivo)
/control               → Panel de control / edición de datos (lo "dinámico")
/expediente            → Inventario de los 12 documentos del expediente
```

**Core loop del usuario:** abrir → ver IRP y KPIs → entrar a /omisiones → priorizar críticas → mover a subsanado → ver IRP bajar → preguntar al chatbot el "por qué" de un hallazgo.

---

## 5. Modelo de datos + datos semilla (REALES de la tesis)

Crea `src/data/seed.ts` con estos tipos y datos. Todo se carga al store de Zustand; el usuario puede editarlo desde `/control`.

### 5.1 Tipos (TypeScript)
```ts
export type Dictamen = "Cumple" | "No Cumple" | "Observado";
export type Severidad = "critica" | "mayor" | "menor" | "ninguna";
export type Especialidad =
  | "memoria_descriptiva" | "memoria_calculo"
  | "especificaciones" | "metrados" | "planos" | "otros";
export type EstadoKanban = "por_revisar" | "en_correccion" | "subsanado" | "verificado";

export interface NormaResumen {
  codigo: string;            // "A.040"
  nombre: string;            // "Educación"
  requisitos: number;
  cumplimientos: number;
  noConformidades: number;
  precision: number;         // %
  critica: number; mayor: number; menor: number;
}

export interface Hallazgo {          // = una no conformidad / omisión
  id: string;                        // "H-001"
  idRequisito: string;               // "RVM_084_Art..."
  norma: string;                     // "RVM 084-2019"
  especialidad: Especialidad;
  dictamen: Dictamen;                // "No Cumple" | "Observado"
  severidad: Severidad;
  titulo: string;                    // resumen corto del hallazgo
  justificacion: string;
  recomendacion: string;
  citaNorma: { id: string; pagina: number; texto: string };
  citaExpediente: { documento: string; pagina: number; texto: string };
  estado: EstadoKanban;              // para el Kanban
  responsable?: string;
}

export interface Documento {
  id: string; nombre: string; tipo: Especialidad;
  paginas: number; requiereOCR: boolean;
  segundosProceso: number;
}

export interface KPI {
  id: string; etiqueta: string; unidad: string;
  meta: number; tradicional: number; propuesto: number;
  cumple: boolean; mejorEsAlto: boolean;
}

export interface Proyecto {
  id: string; nombre: string; ubicacion: string;
  areaM2: number; presupuestoSoles: number;
  totalPaginas: number; totalDocumentos: number;
  totalRequisitos: number;
  tiempoProcesoMin: number;          // 4.35
  costoUSD: number;                  // 0.10
  corpusFragmentos: number;          // 1586
  recallAt10: number; mapAt5: number; latenciaMs: number;
}
```

### 5.2 Proyecto (semilla)
```ts
proyecto = {
  id: "IE_7074", nombre: "I.E. N° 7074 «La Inmaculada»",
  ubicacion: "San Juan de Miraflores, Lima Metropolitana",
  areaM2: 3546.50, presupuestoSoles: 10289658.68,
  totalPaginas: 484, totalDocumentos: 12, totalRequisitos: 1266,
  tiempoProcesoMin: 4.35, costoUSD: 0.10, corpusFragmentos: 1586,
  recallAt10: 0.91, mapAt5: 0.87, latenciaMs: 78,
}
```

### 5.3 KPIs (Tabla 4/5 de la tesis — los 6 indicadores)
```ts
kpis = [
  { id:"precision",   etiqueta:"Precisión detección de errores", unidad:"%",      meta:85,  tradicional:34, propuesto:94.8, cumple:true, mejorEsAlto:true },
  { id:"omisiones",   etiqueta:"Omisiones",                      unidad:"%",      meta:5,   tradicional:48, propuesto:2.3,  cumple:true, mejorEsAlto:false },
  { id:"tiempo",      etiqueta:"Reducción de tiempo",            unidad:"%",      meta:80,  tradicional:0,  propuesto:96.2, cumple:true, mejorEsAlto:true },
  { id:"f1",          etiqueta:"F1-score",                       unidad:"score",  meta:0.80,tradicional:0.48,propuesto:0.89, cumple:true, mejorEsAlto:true },
  { id:"clasif",      etiqueta:"Clasificación jerárquica",       unidad:"%",      meta:90,  tradicional:72, propuesto:93.7, cumple:true, mejorEsAlto:true },
  { id:"satisfaccion",etiqueta:"Satisfacción de usuario",        unidad:"/5",     meta:4.5, tradicional:3.4,propuesto:4.67, cumple:true, mejorEsAlto:true },
]
```
KPIs globales adicionales para tarjetas: `cumplimientos: 1216 (96.1%)`, `noConformidades: 50 (3.9%)`, `tiempo: 4.35 min`, `costo: USD 0.10 ≈ S/ 0.38`, `ahorro vs manual: 99.6%`, `satisfacción expertos: 4.67/5 (n=14)`.

### 5.4 Resumen por norma (tabla 5.4 de la tesis) — ⚠ datos canónicos
> **Inconsistencia de la tesis resuelta:** el texto reporta total de 50 no conformidades (13 críticas / 21 mayores / 16 menores), pero la tabla por norma suma 69. **Usa la tabla por norma como fuente de verdad** (es la que da el detalle por severidad) y muestra en `/control` una alerta de auditoría señalando la discrepancia para que el tesista la concilie. El total derivado de la tabla es **69 NC (13 críticas / 30 mayores / 26 menores)**. Deriva todos los conteos de severidad SUMANDO la tabla, no de constantes sueltas.

```ts
normas = [
  { codigo:"A.040",     nombre:"Educación",                 requisitos:287, cumplimientos:272, noConformidades:15, precision:94.8, critica:2, mayor:6, menor:7 },
  { codigo:"E.030",     nombre:"Diseño Sismorresistente",   requisitos:198, cumplimientos:189, noConformidades:9,  precision:95.5, critica:3, mayor:4, menor:2 },
  { codigo:"E.060",     nombre:"Concreto Armado",           requisitos:165, cumplimientos:158, noConformidades:7,  precision:95.8, critica:2, mayor:3, menor:2 },
  { codigo:"E.070",     nombre:"Albañilería",               requisitos:134, cumplimientos:129, noConformidades:5,  precision:96.3, critica:1, mayor:2, menor:2 },
  { codigo:"RVM 104-2019", nombre:"Locales Inicial",        requisitos:241, cumplimientos:231, noConformidades:10, precision:95.9, critica:1, mayor:4, menor:5 },
  { codigo:"RVM 084-2019", nombre:"Primaria/Secundaria",    requisitos:319, cumplimientos:305, noConformidades:14, precision:95.6, critica:3, mayor:7, menor:4 },
  { codigo:"RVM 010-2022", nombre:"Criterios Generales",    requisitos:182, cumplimientos:175, noConformidades:7,  precision:96.2, critica:1, mayor:3, menor:3 },
  { codigo:"PMBOK 6",   nombre:"Gestión de proyectos",      requisitos:60,  cumplimientos:58,  noConformidades:2,  precision:96.7, critica:0, mayor:1, menor:1 },
]
```

### 5.5 Documentos del expediente (semilla)
12 documentos, 484 páginas, 33% requirió OCR (4 docs). Modela al menos: Memoria Descriptiva (87 pág, OCR), Memorias por especialidad (arquitectura/estructuras/eléctricas/sanitarias), Memoria de cálculo estructural, Especificaciones técnicas (generales/arquitectura/estructuras), Metrados y presupuesto (89 pág, 34 s), Planos arquitectónicos, Anexos normativos, Planilla de áreas (12 pág, 8 s). Tiempos por doc entre 8 s y 34 s.

### 5.6 Hallazgos (no conformidades) — generación
Genera **69 objetos `Hallazgo`** repartidos por norma según los conteos de severidad de §5.4 (ej. A.040 → 2 críticas + 6 mayores + 7 menores). Para cada uno: `dictamen` = "No Cumple" para críticas/mayores y "Observado" para menores (heurística), `titulo`/`justificacion`/`recomendacion` plausibles y específicos al dominio (sismorresistencia E.030, evacuación A.040, áreas mínimas RVM 084-2019, etc.), `citaNorma` y `citaExpediente` con página coherente, `estado` inicial = `"por_revisar"`. Las críticas deben concentrarse en **E.030, A.040 y RVM 084-2019** (coherente con la tesis). Marca las citas como *contenido ilustrativo* en un campo `placeholder:true` para que el tesista las reemplace por las reales.

---

## 6. Especificación pantalla por pantalla

> Formato Tim Gabe: OBJETIVO · JERARQUÍA VISUAL · CTA · MICRO-INTERACCIONES.

### 6.1 `/` Dashboard ejecutivo
- **Objetivo:** estado global del expediente en 5 segundos.
- **Jerarquía:** (1) **IRP** (gauge grande arriba-izq) + monto en riesgo; (2) fila de 4–6 **tarjetas KPI** con número grande + delta vs meta (badge "Cumple"); (3) gráfico **barras apiladas Cumple/Observado/No cumple por norma**; (4) **dona de severidad** (13/30/26); (5) mini-tabla "Top 5 críticas" con link a /omisiones.
- **CTA:** "Ver omisiones críticas".
- **Micro-interacciones:** KPIs con count-up animado; tarjetas con hover lift (Framer Motion `whileHover`); al cargar, stagger de entrada.
- **Empty state:** "Aún no hay expediente cargado → Importar JSON / Cargar piloto".

### 6.2 `/normas` Cumplimiento por norma
- **Objetivo:** ver qué norma concentra incumplimientos.
- Barras apiladas horizontales por las 8 categorías; filtro por severidad; al hacer clic en una barra → drill-down a lista de hallazgos de esa norma. Tarjeta lateral con % precisión por norma.

### 6.3 `/severidad`
- Dona + barras; tres columnas (Crítica/Mayor/Menor) con conteo grande y color semántico; toggle "agrupar por norma / por especialidad".

### 6.4 `/especialidades`
- Desempeño por tipo de documento (memoria descriptiva, cálculo, especificaciones, metrados, planos). Radar o barras. Tiempos de proceso por documento (de §5.5).

### 6.5 `/trazabilidad`
- **Objetivo:** auditar cada hallazgo (requisito ↔ página expediente ↔ fragmento normativo). Es el corazón de la trazabilidad (R3).
- `@tanstack/react-table`: columnas ID, norma, especialidad, dictamen (pill color), severidad (pill), pág. expediente, pág. norma. Búsqueda, filtros por norma/severidad/dictamen, orden, paginación.
- Fila expandible → muestra `citaNorma` y `citaExpediente` en bloques mono, con botón "Preguntar al asistente sobre este hallazgo" (lleva a /chat con contexto precargado) y "Abrir en Kanban".
- Export CSV/JSON (cumple R5 interoperabilidad).

### 6.6 `/omisiones` — TABLERO KANBAN (requisito central)
- **Objetivo:** controlar el ciclo de vida de cada no conformidad hasta subsanarla.
- **Columnas:** `Por revisar` → `En corrección` → `Subsanado` → `Verificado`. Header de columna con contador y suma de "peso de severidad".
- **Card:** título, pills de norma + severidad (color), especialidad, página, responsable (avatar/inicial), y un borde-izquierdo de color según severidad. Click abre **drawer** con justificación, recomendación y ambas citas.
- **DnD:** `@dnd-kit` con `SortableContext` por columna; `layout` animation de Framer Motion al mover. Persistir `estado` en el store.
- **Filtros:** por norma, severidad, especialidad, responsable. Buscador.
- **Conexión clave con el IRP:** mover un card a `Subsanado`/`Verificado` lo excluye del cálculo de riesgo → el badge de IRP en el header se actualiza en vivo con un pequeño "−X pts" animado. **Este es el bucle adictivo del producto.**
- **Empty state por columna** y vista "WIP" (límite opcional por columna).

### 6.7 `/chat` — Asistente conversacional
- **Objetivo:** preguntar en lenguaje natural sobre el proyecto o sobre un archivo específico, con respuestas **con citas**.
- **Dos modos (selector arriba):**
  1. **Proyecto:** contexto = KPIs + resumen por norma + lista de hallazgos.
  2. **Por archivo:** dropdown de los 12 documentos; contexto = solo hallazgos/metadata de ese documento.
- UI tipo chat: burbujas, streaming token a token, estado "pensando" con shimmer. Cada respuesta del asistente muestra **chips de cita** (norma + página / documento + página) que, al clicar, abren la fila en /trazabilidad.
- **Rechazo controlado:** si la pregunta sale del alcance del contexto, el asistente lo dice y NO inventa (instrucción de sistema; ver §10).
- Preguntas sugeridas de arranque: "¿Cuáles son las observaciones críticas?", "¿Por qué falla la RVM 084-2019 en áreas mínimas?", "¿Qué documento tiene más no conformidades?".
- Historial de sesión en el store (auditoría, alineado a la tesis).

### 6.8 `/control` — Panel de control (lo "dinámico y editable")
- **Objetivo:** que TODO sea controlable sin tocar código.
- Editar: datos del proyecto, KPIs (meta/tradicional/propuesto), tabla por norma, y CRUD de hallazgos (crear/editar/eliminar, cambiar severidad/dictamen/estado/citas).
- **Importar/Exportar** el dataset completo como JSON (validado con `zod`). Botón "Restaurar piloto".
- **Panel de auditoría:** muestra la alerta de discrepancia 50 vs 69 (§5.4) y deja conciliar.
- Todo cambio recalcula KPIs/gráficos/IRP en vivo (es la prueba de que "todo es dinámico").

### 6.9 `/expediente`
- Inventario visual de los 12 documentos: tipo, páginas, OCR sí/no (badge), tiempo de proceso. Tarjetas con barra de progreso de proceso.

---

## 7. FEATURE EXTRA — Índice de Riesgo de Paralización (IRP)

> **Por qué un ingeniero civil la quiere:** conecta el cumplimiento normativo con lo que de verdad le quita el sueño — *¿esta obra se va a paralizar y cuánta plata está en riesgo?* Está **anclada a tu tesis**: en "Investigaciones futuras" propones "un módulo predictivo que estime la probabilidad de paralización a partir del nivel de cumplimiento". Esto es ese módulo, en versión heurística y visual.

### 7.1 Cálculo (`src/lib/irp.ts`)
Solo cuentan los hallazgos **abiertos** (estado `por_revisar` o `en_correccion`).
```
pesoSeveridad = críticas*5 + mayores*3 + menores*1   // solo abiertos
pesoMax       = totalRequisitos * 0.05 * 5            // tope normalizador
base          = min(100, (pesoSeveridad / pesoMax) * 100)

// penalizaciones de seguridad (lo que importa en obra)
penalE030 = (críticas abiertas en E.030) * 6   // sismorresistencia
penalA040 = (críticas abiertas en A.040) * 5   // evacuación/seguridad

IRP = round( min(100, base + penalE030 + penalA040) )
```
**Semáforo:** `IRP < 25` Verde · `25–55` Ámbar · `> 55` Rojo.

**Monto en riesgo (S/):** `presupuesto * (IRP/100) * 0.35` (factor de exposición; documéntalo como heurístico y editable en /control). Muestra en formato peruano `S/ 1,234,567`.

### 7.2 UI `/riesgo`
- **Gauge grande** (semicircular, Recharts o SVG) con el número IRP, color por semáforo, animado por spring.
- Tarjeta "Monto en riesgo" con count-up.
- **Simulador "¿Qué pasa si…?":** lista de hallazgos abiertos con toggle "marcar como subsanado"; al togglear, el gauge y el monto se recalculan en vivo (sin tocar el Kanban real — modo sandbox), con botón "Aplicar cambios al Kanban".
- Desglose: contribución al riesgo por norma (barras), top 3 hallazgos que más bajan el riesgo si se subsanan ("mayor apalancamiento", guiño a tu marco Lean/PMBOK).
- Badge compacto del IRP reutilizable en el header global y en /omisiones.

---

## 8. Componentes shadcn/ui a instalar
```
button card badge tabs table dialog sheet drawer dropdown-menu
select input textarea label switch tooltip separator scroll-area
avatar progress sonner (toast) skeleton command popover slider
```

---

## 9. Estado y persistencia
- Un store Zustand `useProjectStore` con: `proyecto`, `kpis`, `normas`, `hallazgos`, `documentos`, `chatSessions`, y acciones (`updateHallazgo`, `moveHallazgo`, `setKpi`, `importDataset`, `resetToPilot`, …).
- `persist` middleware → `localStorage` (key `tesis-mesia-v1`).
- **Selectores derivados** (no guardar duplicado): conteos por severidad, KPIs globales, IRP — todos computados desde `hallazgos`/`normas` para que "todo sea dinámico" por construcción.

---

## 10. API y chatbot (`/app/api/chat/route.ts`)
- Route handler (Edge o Node) que recibe `{ mode, documentoId?, messages }`.
- Construye el **contexto** desde el dataset (proyecto + KPIs + hallazgos filtrados por modo/archivo) y lo inyecta en un *system prompt* de verificador, reusando la disciplina de tu tesis:
  - Rol: "Asistente de verificación del expediente {proyecto}. Ayudas a revisores técnicos."
  - Reglas: responder **solo** con base en el contexto entregado; si está fuera de alcance, decirlo y **no inventar** (rechazo controlado); **toda** afirmación con cita verificable (norma: id+página; expediente: documento+página); breve y concreto, con acción sugerida.
- Llama a Anthropic con `@anthropic-ai/sdk` (modelo configurable por env), **streaming**. Mantén la respuesta provider-agnostic detrás de una función `getCompletion()` para poder cambiar de proveedor.
- Devuelve también las citas estructuradas para renderizar los chips.
- `.env.local`: `ANTHROPIC_API_KEY`. Nunca exponer la key al cliente.
- *Backend-ready:* deja comentado un `TODO` donde, en producción, este endpoint consultaría Qdrant (recuperación híbrida) y Airtable, tal como describe la tesis.

---

## 11. Estructura de carpetas
```
src/
  app/
    (dashboard)/page.tsx          # /
    normas/page.tsx
    severidad/page.tsx
    especialidades/page.tsx
    trazabilidad/page.tsx
    omisiones/page.tsx            # Kanban
    riesgo/page.tsx               # IRP
    chat/page.tsx
    control/page.tsx
    expediente/page.tsx
    api/chat/route.ts
    layout.tsx                    # sidebar + theme provider
    globals.css                   # tokens §3
  components/
    layout/{sidebar,header,theme-toggle}.tsx
    kpi/{kpi-card,kpi-grid}.tsx
    charts/{stacked-by-norma,severity-donut,specialty-radar}.tsx
    kanban/{board,column,card,card-drawer}.tsx
    chat/{chat-window,message,citation-chip,mode-switch}.tsx
    irp/{gauge,risk-amount,what-if-simulator,irp-badge}.tsx
    trace/{trace-table,trace-row}.tsx
    ui/                           # shadcn
  data/seed.ts
  lib/{irp.ts,kpis.ts,format.ts,prompt.ts}
  store/use-project-store.ts
  types/index.ts
```

---

## 12. Build order (haz en este orden)
1. Scaffold Next.js + Tailwind + shadcn + tokens §3 + theme oscuro/claro + sidebar/layout.
2. Tipos §5.1 + `seed.ts` con TODOS los datos reales + generador de los 69 hallazgos (§5.6) + store Zustand con persist.
3. `lib/kpis.ts` (derivados) y `lib/irp.ts`.
4. Dashboard ejecutivo (`/`) con KPI cards + charts + badge IRP.
5. `/normas`, `/severidad`, `/especialidades` (gráficos Recharts).
6. `/trazabilidad` (tanstack table, filtros, export, fila expandible).
7. `/omisiones` Kanban con dnd-kit + drawer + recálculo de IRP en vivo.
8. `/riesgo` gauge + monto en riesgo + simulador what-if.
9. `/chat` UI + `api/chat/route.ts` con Anthropic streaming + citas + modo por archivo.
10. `/control` (CRUD + import/export JSON + alerta de auditoría) y `/expediente`.
11. Animaciones Framer Motion (entradas, hover, layout) y empty states.
12. Pulido responsive + accesibilidad (focus, contraste AA) + README.

---

## 13. Checklist de aceptación
- [ ] Los 6 KPIs muestran tradicional vs propuesto vs meta con badge "Cumple".
- [ ] Cambiar un dato en `/control` actualiza KPIs, gráficos e IRP en vivo.
- [ ] Kanban con 4 columnas, DnD fluido, persistencia y recálculo de IRP al mover.
- [ ] Trazabilidad lista cada hallazgo con sus 2 citas y exporta CSV/JSON.
- [ ] Chatbot responde en modo proyecto y por archivo, con citas y rechazo controlado.
- [ ] IRP con semáforo, monto en riesgo en S/ y simulador what-if funcional.
- [ ] Modo claro/oscuro, mobile-first, estética "Framer" (springs, glass, squircles).
- [ ] Alerta de auditoría de la discrepancia 50 vs 69 visible en `/control`.
- [ ] `npm run build` sin errores; deploy en Vercel; API key solo en servidor.

---

## 14. Notas para el tesista (no para Claude Code)
- Las **citas de los hallazgos son ilustrativas** (`placeholder:true`): reemplázalas por las reales de tu informe del piloto antes de exponer ante el jurado.
- Concilia la discrepancia **50 vs 69** no conformidades: ajusta el texto de la tesis o la tabla por norma para que cuadren (el spec usa 69 por ser la fuente con detalle por severidad).
- Esta web demuestra *en vivo* el entregable que tu tesis solo mostraba como mockups (Figuras 6 y 7): es un argumento fuerte para la sustentación.
