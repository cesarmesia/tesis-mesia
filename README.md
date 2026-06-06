# Plataforma Web de Resultados de Tesis — Verificación de Expedientes Técnicos

Aplicación web que presenta, de forma **dinámica y editable**, los resultados de la tesis
**"Verificación automatizada de expedientes técnicos"** (César Yair Mesía Gómez — UPC,
Ingeniería Civil). Caso piloto: **I.E. N° 7074 «La Inmaculada»** (San Juan de Miraflores, Lima).

Demuestra *en vivo* el entregable que la tesis mostraba como mockups: dashboard interactivo,
tablero Kanban de omisiones, chatbot con citas y el **Índice de Riesgo de Paralización (IRP)**.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · Recharts ·
Zustand (persist a `localStorage`) · @dnd-kit · @tanstack/react-table · zod · @anthropic-ai/sdk.

## Requisitos

- **Node 20+**
- npm (o pnpm/yarn)

## Puesta en marcha

```bash
npm install
cp .env.local.example .env.local   # opcional: agrega tu ANTHROPIC_API_KEY
npm run dev                         # http://localhost:3000
```

> El chatbot funciona **sin** API key en modo local (fallback). Para respuestas generativas
> con LLM, coloca `ANTHROPIC_API_KEY` en `.env.local`. La key **solo** se usa en el servidor
> (`src/app/api/chat/route.ts`); nunca se expone al cliente.

### Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servir el build |
| `npm run lint` | ESLint |

## Páginas

| Ruta | Contenido |
|---|---|
| `/` | Dashboard ejecutivo: IRP, KPIs, barras por norma, dona de severidad, top 5 críticas |
| `/normas` | Cumplimiento por norma con drill-down |
| `/severidad` | Crítica/Mayor/Menor, dona y barras (por norma / por especialidad) |
| `/especialidades` | Desempeño y tiempos por tipo de documento (radar + barras) |
| `/trazabilidad` | Tabla navegable (requisito ↔ página ↔ norma), filtros, export CSV/JSON |
| `/omisiones` | **Tablero Kanban** con DnD y recálculo de IRP en vivo |
| `/riesgo` | **IRP**: gauge, monto en riesgo, simulador "¿qué pasa si…?" |
| `/chat` | Asistente conversacional (modo proyecto / por archivo) con citas |
| `/control` | Edición de todo el dataset, import/export JSON, alerta de auditoría |
| `/expediente` | Inventario de los 12 documentos |

## Cómo "todo es dinámico"

El estado vive en un único store de Zustand (`src/store/use-project-store.ts`) persistido en
`localStorage` (key `tesis-mesia-v1`). Los conteos por severidad, KPIs globales e IRP son
**selectores derivados** (`src/lib/kpis.ts`, `src/lib/irp.ts`): cualquier edición en `/control`
o movimiento en el Kanban recalcula gráficos e IRP al instante.

## El Índice de Riesgo de Paralización (IRP)

Heurística en `src/lib/irp.ts` (solo cuentan hallazgos *abiertos*):

```
pesoSeveridad = críticas*5 + mayores*3 + menores*1
base          = min(100, pesoSeveridad / (totalRequisitos*0.05*5) * 100)
IRP           = round(min(100, base + 6·(críticas E.030) + 5·(críticas A.040)))
```

Semáforo: <25 Verde · 25–55 Ámbar · >55 Rojo.
Monto en riesgo = `presupuesto × (IRP/100) × factorExposición` (editable en `/control`).

## Notas para el tesista

- Las **citas de los hallazgos son ilustrativas** (`placeholder: true`). Reemplázalas por las
  reales de tu informe del piloto antes de exponer ante el jurado.
- **Discrepancia 50 vs 69 NC**: el texto de la tesis reporta 50; la tabla por norma suma 69. El
  sistema usa la **tabla por norma como fuente de verdad** y muestra una alerta de auditoría en
  `/control`. Concilia el texto o la tabla.

## Despliegue (Vercel)

1. Sube el repo a GitHub.
2. Importa el proyecto en Vercel (detecta Next.js automáticamente).
3. Configura la variable de entorno `ANTHROPIC_API_KEY` (y opcional `ANTHROPIC_MODEL`).
4. Deploy.

## Estructura

```
src/
  app/            páginas (App Router) + api/chat/route.ts + globals.css (tokens §3)
  components/     layout, kpi, charts, kanban, chat, irp, trace, shared, ui (shadcn)
  data/seed.ts    datos reales + generador de los 69 hallazgos
  lib/            irp, kpis, format, prompt, llm, schema (zod), export, nav, utils
  store/          useProjectStore (Zustand + persist)
  hooks/          use-derived, use-count-up
  types/          modelo de datos
```
