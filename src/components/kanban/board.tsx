"use client";

import * as React from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { KanbanColumn } from "@/components/kanban/column";
import { KanbanCardView } from "@/components/kanban/card";
import { CardDrawer } from "@/components/kanban/card-drawer";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjectStore } from "@/store/use-project-store";
import { useIRP } from "@/hooks/use-derived";
import { especialidadLabel, estadoLabel } from "@/lib/format";
import type { EstadoKanban, Hallazgo } from "@/types";

const COLUMNS: EstadoKanban[] = [
  "por_revisar",
  "en_correccion",
  "subsanado",
  "verificado",
];

export function KanbanBoard({ focusId }: { focusId?: string | null }) {
  const hallazgos = useProjectStore((s) => s.hallazgos);
  const moveHallazgo = useProjectStore((s) => s.moveHallazgo);
  const normas = useProjectStore((s) => s.normas);
  const irp = useIRP();

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [openCard, setOpenCard] = React.useState<Hallazgo | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // filtros
  const [q, setQ] = React.useState("");
  const [fNorma, setFNorma] = React.useState("todas");
  const [fSev, setFSev] = React.useState("todas");
  const [fEsp, setFEsp] = React.useState("todas");
  const [wip, setWip] = React.useState(false);

  // abrir desde ?focus=
  React.useEffect(() => {
    if (focusId) {
      const h = hallazgos.find((x) => x.id === focusId);
      if (h) {
        setOpenCard(h);
        setDrawerOpen(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusId]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
  );

  const especialidades = React.useMemo(
    () => Array.from(new Set(hallazgos.map((h) => h.especialidad))),
    [hallazgos],
  );

  const filtrados = React.useMemo(() => {
    const ql = q.toLowerCase();
    return hallazgos.filter(
      (h) =>
        (fNorma === "todas" || h.norma === fNorma) &&
        (fSev === "todas" || h.severidad === fSev) &&
        (fEsp === "todas" || h.especialidad === fEsp) &&
        (ql === "" ||
          h.titulo.toLowerCase().includes(ql) ||
          h.id.toLowerCase().includes(ql) ||
          (h.responsable ?? "").toLowerCase().includes(ql)),
    );
  }, [hallazgos, q, fNorma, fSev, fEsp]);

  const byColumn = (estado: EstadoKanban) => filtrados.filter((h) => h.estado === estado);

  const activeHallazgo = activeId ? hallazgos.find((h) => h.id === activeId) : null;

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const activeCard = hallazgos.find((h) => h.id === active.id);
    if (!activeCard) return;

    // target column: over puede ser una columna (estado) o una card
    let targetEstado: EstadoKanban | null = null;
    if (COLUMNS.includes(over.id as EstadoKanban)) {
      targetEstado = over.id as EstadoKanban;
    } else {
      const overCard = hallazgos.find((h) => h.id === over.id);
      if (overCard) targetEstado = overCard.estado;
    }
    if (!targetEstado || targetEstado === activeCard.estado) return;

    moveHallazgo(activeCard.id, targetEstado);

    const cerrado = targetEstado === "subsanado" || targetEstado === "verificado";
    const abierto = activeCard.estado === "subsanado" || activeCard.estado === "verificado";
    if (cerrado && !abierto) {
      toast.success(`«${activeCard.titulo.slice(0, 40)}…» → ${estadoLabel[targetEstado]}`, {
        description: "Excluido del cálculo de riesgo — el IRP baja.",
      });
    } else {
      toast(`Movido a ${estadoLabel[targetEstado]}`);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-lg border border-border/50 bg-surface p-3 lg:flex-row lg:items-center">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Buscar…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={fNorma} onValueChange={setFNorma}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Toda norma</SelectItem>
              {normas.map((n) => (
                <SelectItem key={n.codigo} value={n.codigo}>
                  {n.codigo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={fSev} onValueChange={setFSev}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Toda severidad</SelectItem>
              <SelectItem value="critica">Crítica</SelectItem>
              <SelectItem value="mayor">Mayor</SelectItem>
              <SelectItem value="menor">Menor</SelectItem>
            </SelectContent>
          </Select>
          <Select value={fEsp} onValueChange={setFEsp}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Toda especialidad</SelectItem>
              {especialidades.map((e) => (
                <SelectItem key={e} value={e}>
                  {especialidadLabel[e]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Switch id="wip" checked={wip} onCheckedChange={setWip} />
            <Label htmlFor="wip" className="text-xs text-text-muted">
              Límite WIP
            </Label>
          </div>
        </div>
        <div className="ml-auto rounded-full bg-surface-2 px-3 py-1 text-xs text-text-muted">
          IRP actual:{" "}
          <span className="font-semibold tabular-nums text-text">{irp.irp}</span> ·{" "}
          {irp.abiertos} abiertos
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
          {COLUMNS.map((estado) => (
            <KanbanColumn
              key={estado}
              estado={estado}
              hallazgos={byColumn(estado)}
              onOpenCard={(h) => {
                setOpenCard(h);
                setDrawerOpen(true);
              }}
              wipLimit={wip && (estado === "por_revisar" || estado === "en_correccion") ? 8 : undefined}
            />
          ))}
        </div>

        <DragOverlay>
          {activeHallazgo ? (
            <motion.div initial={{ scale: 1 }} animate={{ scale: 1.03 }}>
              <KanbanCardView h={activeHallazgo} />
            </motion.div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <CardDrawer hallazgo={openCard} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}
