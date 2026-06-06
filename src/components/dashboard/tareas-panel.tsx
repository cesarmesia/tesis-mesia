"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Plus, Trash2, Sparkles, ListTodo, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjectStore } from "@/store/use-project-store";
import { esAbierto } from "@/lib/irp";
import { cn } from "@/lib/utils";
import type { Actividad, PrioridadActividad } from "@/types";

const prioridadMeta: Record<PrioridadActividad, { label: string; variant: any }> = {
  alta: { label: "Alta", variant: "fail" },
  media: { label: "Media", variant: "observed" },
  baja: { label: "Baja", variant: "secondary" },
};

function newId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `act-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  }
}

function CrearActividadDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const addActividad = useProjectStore((s) => s.addActividad);
  const hallazgos = useProjectStore((s) => s.hallazgos);

  const [titulo, setTitulo] = React.useState("");
  const [prioridad, setPrioridad] = React.useState<PrioridadActividad>("media");
  const [responsable, setResponsable] = React.useState("");
  const [hallazgoId, setHallazgoId] = React.useState<string>("ninguno");

  React.useEffect(() => {
    if (open) {
      setTitulo("");
      setPrioridad("media");
      setResponsable("");
      setHallazgoId("ninguno");
    }
  }, [open]);

  const abiertos = hallazgos.filter(esAbierto);

  function crear() {
    if (!titulo.trim()) {
      toast.error("Describe la actividad");
      return;
    }
    addActividad({
      id: newId(),
      titulo: titulo.trim(),
      prioridad,
      responsable: responsable.trim() || undefined,
      hallazgoId: hallazgoId === "ninguno" ? undefined : hallazgoId,
      hecha: false,
      createdAt: new Date().toISOString(),
    });
    toast.success("Actividad creada");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva actividad</DialogTitle>
          <DialogDescription>
            Crea una tarea de subsanación. Puedes vincularla a una omisión.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div>
            <Label className="text-xs text-text-muted">Actividad</Label>
            <Input
              className="mt-1"
              autoFocus
              placeholder="Ej. Rediseñar circulación a 1.50 m"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && crear()}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-text-muted">Prioridad</Label>
              <Select value={prioridad} onValueChange={(v) => setPrioridad(v as PrioridadActividad)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-text-muted">Responsable</Label>
              <Input
                className="mt-1"
                placeholder="Opcional"
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label className="text-xs text-text-muted">Omisión vinculada (opcional)</Label>
            <Select value={hallazgoId} onValueChange={setHallazgoId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Ninguna" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ninguno">Ninguna</SelectItem>
                {abiertos.map((h) => (
                  <SelectItem key={h.id} value={h.id}>
                    {h.id} · {h.titulo.slice(0, 48)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={crear}>Crear actividad</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TareasPanel() {
  const actividades = useProjectStore((s) => s.actividades);
  const hallazgos = useProjectStore((s) => s.hallazgos);
  const addActividad = useProjectStore((s) => s.addActividad);
  const toggleActividad = useProjectStore((s) => s.toggleActividad);
  const removeActividad = useProjectStore((s) => s.removeActividad);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const hechas = actividades.filter((a) => a.hecha).length;
  const pct = actividades.length ? (hechas / actividades.length) * 100 : 0;

  const ordenadas = [...actividades].sort((a, b) => {
    if (a.hecha !== b.hecha) return a.hecha ? 1 : -1;
    const peso = { alta: 0, media: 1, baja: 2 };
    return peso[a.prioridad] - peso[b.prioridad];
  });

  function generarDeCriticas() {
    const criticasAbiertas = hallazgos.filter(
      (h) => h.severidad === "critica" && (h.estado === "por_revisar" || h.estado === "en_correccion"),
    );
    const yaVinculadas = new Set(actividades.map((a) => a.hallazgoId));
    const nuevas = criticasAbiertas.filter((h) => !yaVinculadas.has(h.id));
    if (nuevas.length === 0) {
      toast("No hay nuevas críticas abiertas para generar tareas");
      return;
    }
    nuevas.forEach((h) =>
      addActividad({
        id: newId(),
        titulo: h.recomendacion || `Subsanar: ${h.titulo}`,
        prioridad: "alta",
        hallazgoId: h.id,
        hecha: false,
        createdAt: new Date().toISOString(),
      }),
    );
    toast.success(`${nuevas.length} actividad(es) generadas de las críticas`);
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center justify-between gap-3 pb-3">
        <CardTitle className="flex items-center gap-2">
          <ListTodo className="size-4 text-accent" /> Tareas por hacer
        </CardTitle>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="size-4" /> Crear
        </Button>
      </CardHeader>

      <div className="px-6 pb-3">
        <div className="mb-1 flex items-center justify-between text-xs text-text-muted">
          <span>
            {hechas} de {actividades.length} completadas
          </span>
          <span className="tabular-nums">{Math.round(pct)}%</span>
        </div>
        <Progress value={pct} indicatorClassName="bg-ok" />
      </div>

      <CardContent className="flex flex-1 flex-col gap-2">
        {actividades.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-surface-2 text-text-muted">
              <ListTodo className="size-5" />
            </span>
            <p className="text-sm text-text-muted">
              Sin tareas aún. Crea una o generálas desde las omisiones críticas.
            </p>
            <Button variant="outline" size="sm" onClick={generarDeCriticas}>
              <Sparkles className="size-4" /> Generar de críticas
            </Button>
          </div>
        ) : (
          <>
            <AnimatePresence initial={false}>
              {ordenadas.map((a) => (
                <ActividadRow
                  key={a.id}
                  a={a}
                  hallazgoNorma={
                    a.hallazgoId
                      ? hallazgos.find((h) => h.id === a.hallazgoId)?.norma
                      : undefined
                  }
                  onToggle={() => toggleActividad(a.id)}
                  onRemove={() => removeActividad(a.id)}
                />
              ))}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 self-start text-text-muted"
              onClick={generarDeCriticas}
            >
              <Sparkles className="size-3.5" /> Generar de críticas abiertas
            </Button>
          </>
        )}
      </CardContent>

      <CrearActividadDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </Card>
  );
}

function ActividadRow({
  a,
  hallazgoNorma,
  onToggle,
  onRemove,
}: {
  a: Actividad;
  hallazgoNorma?: string;
  onToggle: () => void;
  onRemove: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="group flex items-center gap-3 rounded-[12px] border border-border/40 bg-surface-2/30 p-3"
    >
      <button
        onClick={onToggle}
        aria-label={a.hecha ? "Marcar pendiente" : "Marcar hecha"}
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
          a.hecha
            ? "border-ok bg-ok text-white"
            : "border-border hover:border-accent",
        )}
      >
        {a.hecha && <Check className="size-3.5" />}
      </button>
      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm", a.hecha && "text-text-muted line-through")}>
          {a.titulo}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
          <Badge variant={prioridadMeta[a.prioridad].variant} className="px-1.5 py-0 text-[10px]">
            {prioridadMeta[a.prioridad].label}
          </Badge>
          {hallazgoNorma && (
            <span className="text-[10px] text-text-muted">
              {a.hallazgoId} · {hallazgoNorma}
            </span>
          )}
          {a.responsable && (
            <span className="text-[10px] text-text-muted">· {a.responsable}</span>
          )}
        </div>
      </div>
      <button
        onClick={onRemove}
        aria-label="Eliminar"
        className="shrink-0 text-text-muted/50 opacity-0 transition-opacity hover:text-fail group-hover:opacity-100"
      >
        <Trash2 className="size-4" />
      </button>
    </motion.div>
  );
}
