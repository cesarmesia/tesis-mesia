"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  Download,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Hydrated } from "@/components/shared/hydrated";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useProjectStore } from "@/store/use-project-store";
import { useIRP, useKPIsGlobales } from "@/hooks/use-derived";
import { datasetSchema } from "@/lib/schema";
import { exportDatasetJSON } from "@/lib/export";
import { auditoriaDiscrepancia } from "@/data/seed";
import { severidadDesdeNormas } from "@/lib/kpis";
import { formatSoles, especialidadLabel } from "@/lib/format";
import type { Dictamen, EstadoKanban, Especialidad, Hallazgo, Severidad } from "@/types";

function NumberField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <div>
      <Label className="text-xs text-text-muted">{label}</Label>
      <Input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="mt-1"
      />
    </div>
  );
}

// Banner que prueba que "todo es dinámico": refleja KPIs/IRP recomputados.
function LiveBanner() {
  const g = useKPIsGlobales();
  const irp = useIRP();
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-accent/30 bg-accent/5 p-3 text-sm">
      <span className="font-medium text-accent">En vivo:</span>
      <span>NC totales: <b className="tabular-nums">{g.totalNoConformidades}</b></span>
      <span>Severidad: <b className="tabular-nums">{g.severidad.critica}/{g.severidad.mayor}/{g.severidad.menor}</b></span>
      <span>Cumplimiento: <b className="tabular-nums">{g.porcentajeCumplimiento.toFixed(1)}%</b></span>
      <span>IRP: <b className="tabular-nums">{irp.irp}</b></span>
      <span>Riesgo: <b className="tabular-nums">{formatSoles(irp.monto, { decimals: 0 })}</b></span>
    </div>
  );
}

function AuditAlert() {
  const normas = useProjectStore((s) => s.normas);
  const sevTabla = severidadDesdeNormas(normas);
  const a = auditoriaDiscrepancia;

  return (
    <Card className="border-observed/40 bg-observed/5">
      <CardHeader className="flex-row items-center gap-2">
        <AlertTriangle className="size-5 text-observed" />
        <CardTitle className="text-observed">Alerta de auditoría — discrepancia 50 vs 69</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        <p className="text-text-muted">{a.nota}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border/50 bg-surface p-3">
            <p className="mb-1 text-xs font-semibold uppercase text-text-muted">
              Texto de la tesis
            </p>
            <p className="text-lg font-semibold tabular-nums">{a.totalTexto} NC</p>
            <p className="text-xs text-text-muted">
              {a.severidadTexto.critica} críticas / {a.severidadTexto.mayor} mayores /{" "}
              {a.severidadTexto.menor} menores
            </p>
          </div>
          <div className="rounded-lg border border-accent/40 bg-accent/5 p-3">
            <p className="mb-1 text-xs font-semibold uppercase text-accent">
              Tabla por norma (fuente de verdad · en vivo)
            </p>
            <p className="text-lg font-semibold tabular-nums">{sevTabla.total} NC</p>
            <p className="text-xs text-text-muted">
              {sevTabla.critica} críticas / {sevTabla.mayor} mayores / {sevTabla.menor}{" "}
              menores
            </p>
          </div>
        </div>
        <p className="text-xs text-text-muted">
          Concilia el texto o la tabla antes de la sustentación. El sistema deriva todos los
          conteos de severidad SUMANDO la tabla por norma.
        </p>
      </CardContent>
    </Card>
  );
}

const NUEVO_HALLAZGO: Omit<Hallazgo, "id"> = {
  idRequisito: "",
  norma: "A.040",
  especialidad: "otros",
  dictamen: "No Cumple",
  severidad: "mayor",
  titulo: "",
  justificacion: "",
  recomendacion: "",
  citaNorma: { id: "", pagina: 1, texto: "" },
  citaExpediente: { documento: "", pagina: 1, texto: "" },
  estado: "por_revisar",
  placeholder: false,
};

// ID robusto: max(H-NNN existente) + 1 (no colisiona tras eliminar).
function siguienteId(hallazgos: Hallazgo[]): string {
  const max = hallazgos.reduce((m, h) => {
    const n = parseInt(h.id.replace(/\D/g, ""), 10);
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `H-${String(max + 1).padStart(3, "0")}`;
}

const ESPECIALIDADES = Object.keys(especialidadLabel) as Especialidad[];

function HallazgoDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: Hallazgo | null;
}) {
  const addHallazgo = useProjectStore((s) => s.addHallazgo);
  const updateHallazgo = useProjectStore((s) => s.updateHallazgo);
  const hallazgos = useProjectStore((s) => s.hallazgos);
  const normas = useProjectStore((s) => s.normas);
  const documentos = useProjectStore((s) => s.documentos);
  const [draft, setDraft] = React.useState<Omit<Hallazgo, "id">>({ ...NUEVO_HALLAZGO });

  // Sincroniza el borrador al abrir (crear vs editar).
  React.useEffect(() => {
    if (!open) return;
    if (editing) {
      const { id, ...rest } = editing;
      setDraft({ ...rest });
    } else {
      setDraft({ ...NUEVO_HALLAZGO });
    }
  }, [open, editing]);

  const set = (patch: Partial<Hallazgo>) => setDraft((d) => ({ ...d, ...patch }));

  function guardar() {
    if (!draft.titulo.trim()) {
      toast.error("El título es obligatorio");
      return;
    }
    if (editing) {
      updateHallazgo(editing.id, draft);
      toast.success(`Hallazgo ${editing.id} actualizado`);
    } else {
      const id = siguienteId(hallazgos);
      addHallazgo({ ...draft, id, idRequisito: draft.idRequisito || `REQ_${id}` });
      toast.success(`Hallazgo ${id} creado`);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Editar ${editing.id}` : "Nuevo hallazgo"}</DialogTitle>
          <DialogDescription>
            Recalcula gráficos e IRP al guardar. Cambia dictamen, severidad, estado y citas.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div>
            <Label className="text-xs text-text-muted">Título</Label>
            <Input className="mt-1" value={draft.titulo} onChange={(e) => set({ titulo: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div>
              <Label className="text-xs text-text-muted">Norma</Label>
              <Select value={draft.norma} onValueChange={(v) => set({ norma: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {normas.map((n) => (
                    <SelectItem key={n.codigo} value={n.codigo}>{n.codigo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-text-muted">Especialidad</Label>
              <Select value={draft.especialidad} onValueChange={(v) => set({ especialidad: v as Especialidad })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ESPECIALIDADES.map((e) => (
                    <SelectItem key={e} value={e}>{especialidadLabel[e]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-text-muted">Severidad</Label>
              <Select
                value={draft.severidad}
                onValueChange={(v) =>
                  set({ severidad: v as Severidad, dictamen: v === "menor" ? "Observado" : "No Cumple" })
                }
              >
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="critica">Crítica</SelectItem>
                  <SelectItem value="mayor">Mayor</SelectItem>
                  <SelectItem value="menor">Menor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-text-muted">Dictamen</Label>
              <Select value={draft.dictamen} onValueChange={(v) => set({ dictamen: v as Dictamen })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="No Cumple">No cumple</SelectItem>
                  <SelectItem value="Observado">Observado</SelectItem>
                  <SelectItem value="Cumple">Cumple</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-text-muted">Estado</Label>
              <Select value={draft.estado} onValueChange={(v) => set({ estado: v as EstadoKanban })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="por_revisar">Por revisar</SelectItem>
                  <SelectItem value="en_correccion">En corrección</SelectItem>
                  <SelectItem value="subsanado">Subsanado</SelectItem>
                  <SelectItem value="verificado">Verificado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-text-muted">Responsable</Label>
              <Input
                className="mt-1"
                value={draft.responsable ?? ""}
                onChange={(e) => set({ responsable: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-text-muted">Justificación</Label>
            <Textarea className="mt-1" value={draft.justificacion} onChange={(e) => set({ justificacion: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs text-text-muted">Recomendación</Label>
            <Textarea className="mt-1" value={draft.recomendacion} onChange={(e) => set({ recomendacion: e.target.value })} />
          </div>

          {/* Citas */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border/50 bg-surface-2/30 p-3">
              <p className="mb-2 text-xs font-semibold uppercase text-text-muted">Cita normativa</p>
              <Label className="text-xs text-text-muted">ID / artículo</Label>
              <Input
                className="mb-2 mt-1"
                value={draft.citaNorma.id}
                onChange={(e) => set({ citaNorma: { ...draft.citaNorma, id: e.target.value } })}
              />
              <Label className="text-xs text-text-muted">Página</Label>
              <Input
                type="number"
                className="mb-2 mt-1"
                value={draft.citaNorma.pagina}
                onChange={(e) =>
                  set({ citaNorma: { ...draft.citaNorma, pagina: parseInt(e.target.value) || 1 } })
                }
              />
              <Label className="text-xs text-text-muted">Texto</Label>
              <Textarea
                className="mt-1"
                value={draft.citaNorma.texto}
                onChange={(e) => set({ citaNorma: { ...draft.citaNorma, texto: e.target.value } })}
              />
            </div>
            <div className="rounded-lg border border-border/50 bg-surface-2/30 p-3">
              <p className="mb-2 text-xs font-semibold uppercase text-text-muted">Cita del expediente</p>
              <Label className="text-xs text-text-muted">Documento</Label>
              <Select
                value={draft.citaExpediente.documento || undefined}
                onValueChange={(v) => set({ citaExpediente: { ...draft.citaExpediente, documento: v } })}
              >
                <SelectTrigger className="mb-2 mt-1"><SelectValue placeholder="Documento…" /></SelectTrigger>
                <SelectContent>
                  {documentos.map((d) => (
                    <SelectItem key={d.id} value={d.nombre}>{d.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label className="text-xs text-text-muted">Página</Label>
              <Input
                type="number"
                className="mb-2 mt-1"
                value={draft.citaExpediente.pagina}
                onChange={(e) =>
                  set({ citaExpediente: { ...draft.citaExpediente, pagina: parseInt(e.target.value) || 1 } })
                }
              />
              <Label className="text-xs text-text-muted">Texto</Label>
              <Textarea
                className="mt-1"
                value={draft.citaExpediente.texto}
                onChange={(e) => set({ citaExpediente: { ...draft.citaExpediente, texto: e.target.value } })}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={guardar}>{editing ? "Guardar cambios" : "Crear hallazgo"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ControlContent() {
  const store = useProjectStore();
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Hallazgo | null>(null);

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (h: Hallazgo) => {
    setEditing(h);
    setDialogOpen(true);
  };

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(String(reader.result));
        const parsed = datasetSchema.safeParse(json);
        if (!parsed.success) {
          toast.error("JSON inválido", {
            description: "No cumple el esquema del dataset.",
          });
          return;
        }
        store.importDataset(parsed.data);
        toast.success("Dataset importado y validado");
      } catch {
        toast.error("No se pudo leer el archivo JSON");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-4">
      <LiveBanner />

      <Tabs defaultValue="proyecto">
        <TabsList className="flex-wrap">
          <TabsTrigger value="proyecto">Proyecto</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
          <TabsTrigger value="normas">Normas</TabsTrigger>
          <TabsTrigger value="hallazgos">Hallazgos</TabsTrigger>
          <TabsTrigger value="datos">Datos &amp; Auditoría</TabsTrigger>
        </TabsList>

        {/* PROYECTO */}
        <TabsContent value="proyecto">
          <Card>
            <CardHeader>
              <CardTitle>Datos del proyecto</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="sm:col-span-2 lg:col-span-3">
                <Label className="text-xs text-text-muted">Nombre</Label>
                <Input
                  className="mt-1"
                  value={store.proyecto.nombre}
                  onChange={(e) => store.updateProyecto({ nombre: e.target.value })}
                />
              </div>
              <NumberField
                label="Área (m²)"
                value={store.proyecto.areaM2}
                step={0.01}
                onChange={(v) => store.updateProyecto({ areaM2: v })}
              />
              <NumberField
                label="Presupuesto (S/)"
                value={store.proyecto.presupuestoSoles}
                step={0.01}
                onChange={(v) => store.updateProyecto({ presupuestoSoles: v })}
              />
              <NumberField
                label="Total requisitos"
                value={store.proyecto.totalRequisitos}
                onChange={(v) => store.updateProyecto({ totalRequisitos: v })}
              />
              <NumberField
                label="Total páginas"
                value={store.proyecto.totalPaginas}
                onChange={(v) => store.updateProyecto({ totalPaginas: v })}
              />
              <NumberField
                label="Tiempo proceso (min)"
                value={store.proyecto.tiempoProcesoMin}
                step={0.01}
                onChange={(v) => store.updateProyecto({ tiempoProcesoMin: v })}
              />
              <NumberField
                label="Costo (USD)"
                value={store.proyecto.costoUSD}
                step={0.01}
                onChange={(v) => store.updateProyecto({ costoUSD: v })}
              />
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Factor de exposición del IRP (heurístico)</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-text-muted">
                Monto en riesgo = presupuesto × (IRP/100) ×{" "}
                <b className="text-text tabular-nums">{store.exposicionFactor.toFixed(2)}</b>
              </p>
              <Slider
                value={[store.exposicionFactor]}
                min={0}
                max={1}
                step={0.05}
                onValueChange={([v]) => store.setExposicionFactor(v)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* KPIs */}
        <TabsContent value="kpis">
          <Card>
            <CardHeader>
              <CardTitle>Indicadores (meta / tradicional / propuesto)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {store.kpis.map((k) => (
                  <div
                    key={k.id}
                    className="grid grid-cols-2 items-end gap-3 rounded-lg border border-border/40 bg-surface-2/30 p-3 sm:grid-cols-4"
                  >
                    <p className="col-span-2 text-sm font-medium sm:col-span-1">
                      {k.etiqueta}
                    </p>
                    <NumberField
                      label="Meta"
                      value={k.meta}
                      step={0.01}
                      onChange={(v) => store.setKpi(k.id, { meta: v })}
                    />
                    <NumberField
                      label="Tradicional"
                      value={k.tradicional}
                      step={0.01}
                      onChange={(v) => store.setKpi(k.id, { tradicional: v })}
                    />
                    <NumberField
                      label="Propuesto"
                      value={k.propuesto}
                      step={0.01}
                      onChange={(v) => store.setKpi(k.id, { propuesto: v })}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NORMAS */}
        <TabsContent value="normas">
          <Card>
            <CardHeader>
              <CardTitle>Resumen por norma (severidad)</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Norma</TableHead>
                    <TableHead>Requisitos</TableHead>
                    <TableHead>Cumpl.</TableHead>
                    <TableHead>Crítica</TableHead>
                    <TableHead>Mayor</TableHead>
                    <TableHead>Menor</TableHead>
                    <TableHead>Precisión</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {store.normas.map((n) => (
                    <TableRow key={n.codigo}>
                      <TableCell className="font-medium">{n.codigo}</TableCell>
                      <CellNum
                        value={n.requisitos}
                        onChange={(v) => store.updateNorma(n.codigo, { requisitos: v })}
                      />
                      <CellNum
                        value={n.cumplimientos}
                        onChange={(v) => store.updateNorma(n.codigo, { cumplimientos: v })}
                      />
                      <CellNum
                        value={n.critica}
                        onChange={(v) =>
                          store.updateNorma(n.codigo, {
                            critica: v,
                            noConformidades: v + n.mayor + n.menor,
                          })
                        }
                      />
                      <CellNum
                        value={n.mayor}
                        onChange={(v) =>
                          store.updateNorma(n.codigo, {
                            mayor: v,
                            noConformidades: n.critica + v + n.menor,
                          })
                        }
                      />
                      <CellNum
                        value={n.menor}
                        onChange={(v) =>
                          store.updateNorma(n.codigo, {
                            menor: v,
                            noConformidades: n.critica + n.mayor + v,
                          })
                        }
                      />
                      <CellNum
                        value={n.precision}
                        step={0.1}
                        onChange={(v) => store.updateNorma(n.codigo, { precision: v })}
                      />
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HALLAZGOS */}
        <TabsContent value="hallazgos">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Hallazgos ({store.hallazgos.length})</CardTitle>
              <Button size="sm" onClick={openNew}>
                <Plus className="size-4" /> Nuevo
              </Button>
            </CardHeader>
            <CardContent className="max-h-[520px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Severidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {store.hallazgos.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell className="font-mono text-xs">{h.id}</TableCell>
                      <TableCell className="max-w-[280px] truncate text-sm">
                        {h.titulo}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={h.severidad}
                          onValueChange={(v) =>
                            store.updateHallazgo(h.id, {
                              severidad: v as Severidad,
                              dictamen: v === "menor" ? "Observado" : "No Cumple",
                            })
                          }
                        >
                          <SelectTrigger className="h-8 w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="critica">Crítica</SelectItem>
                            <SelectItem value="mayor">Mayor</SelectItem>
                            <SelectItem value="menor">Menor</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={h.estado}
                          onValueChange={(v) =>
                            store.updateHallazgo(h.id, { estado: v as EstadoKanban })
                          }
                        >
                          <SelectTrigger className="h-8 w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="por_revisar">Por revisar</SelectItem>
                            <SelectItem value="en_correccion">En corrección</SelectItem>
                            <SelectItem value="subsanado">Subsanado</SelectItem>
                            <SelectItem value="verificado">Verificado</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => openEdit(h)}
                            aria-label={`Editar ${h.id}`}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-fail"
                            onClick={() => {
                              store.removeHallazgo(h.id);
                              toast(`Hallazgo ${h.id} eliminado`);
                            }}
                            aria-label={`Eliminar ${h.id}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <HallazgoDialog open={dialogOpen} onOpenChange={setDialogOpen} editing={editing} />
        </TabsContent>

        {/* DATOS & AUDITORÍA */}
        <TabsContent value="datos" className="flex flex-col gap-4">
          <AuditAlert />
          <Card>
            <CardHeader>
              <CardTitle>Dataset completo</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button onClick={() => exportDatasetJSON(store.exportDataset())}>
                <Download className="size-4" /> Exportar JSON
              </Button>
              <Button variant="outline" onClick={() => fileRef.current?.click()}>
                <Upload className="size-4" /> Importar JSON
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={handleImport}
              />
              <Button
                variant="ghost"
                onClick={() => {
                  store.resetToPilot();
                  toast.success("Caso piloto restaurado");
                }}
              >
                <RotateCcw className="size-4" /> Restaurar piloto
              </Button>
              <Badge variant="secondary" className="ml-auto self-center">
                Validación con zod al importar
              </Badge>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CellNum({
  value,
  onChange,
  step = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <TableCell>
      <Input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="h-8 w-20"
      />
    </TableCell>
  );
}

export default function ControlPage() {
  return (
    <div>
      <PageHeader
        title="Panel de control"
        description="Todo es editable sin tocar código. Cada cambio recalcula KPIs, gráficos e IRP en vivo."
      />
      <Hydrated fallback={<div className="h-96 animate-pulse rounded-lg bg-surface-2" />}>
        <ControlContent />
      </Hydrated>
    </div>
  );
}
