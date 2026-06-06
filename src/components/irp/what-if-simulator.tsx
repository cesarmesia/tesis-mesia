"use client";

import * as React from "react";
import { toast } from "sonner";
import { Wand2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { SeveridadPill } from "@/components/shared/pills";
import { IRPGauge } from "@/components/irp/gauge";
import { useProjectStore } from "@/store/use-project-store";
import { calcularIRP, montoEnRiesgo, esAbierto } from "@/lib/irp";
import { formatSoles } from "@/lib/format";
import type { Hallazgo } from "@/types";

// §7.2 Simulador "¿Qué pasa si…?" — sandbox que no toca el Kanban real
// hasta pulsar "Aplicar cambios".
export function WhatIfSimulator() {
  const hallazgos = useProjectStore((s) => s.hallazgos);
  const totalRequisitos = useProjectStore((s) => s.proyecto.totalRequisitos);
  const presupuesto = useProjectStore((s) => s.proyecto.presupuestoSoles);
  const exposicionFactor = useProjectStore((s) => s.exposicionFactor);
  const moveHallazgo = useProjectStore((s) => s.moveHallazgo);

  const abiertos = React.useMemo(() => hallazgos.filter(esAbierto), [hallazgos]);

  // ids marcados como "subsanados" en el sandbox
  const [marcados, setMarcados] = React.useState<Set<string>>(new Set());

  // limpia ids que ya no estén abiertos
  React.useEffect(() => {
    setMarcados((prev) => {
      const next = new Set<string>();
      abiertos.forEach((h) => prev.has(h.id) && next.add(h.id));
      return next;
    });
  }, [abiertos]);

  const simulados: Hallazgo[] = hallazgos.map((h) =>
    marcados.has(h.id) ? { ...h, estado: "subsanado" as const } : h,
  );

  const real = calcularIRP(hallazgos, totalRequisitos, exposicionFactor);
  const sim = calcularIRP(simulados, totalRequisitos, exposicionFactor);
  const montoSim = montoEnRiesgo(presupuesto, sim.irp, exposicionFactor);
  const montoReal = montoEnRiesgo(presupuesto, real.irp, exposicionFactor);

  function toggle(id: string) {
    setMarcados((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function aplicar() {
    if (marcados.size === 0) return;
    marcados.forEach((id) => moveHallazgo(id, "subsanado"));
    toast.success(`${marcados.size} hallazgo(s) marcados como subsanados en el Kanban`, {
      description: `IRP ${real.irp} → ${sim.irp}`,
    });
    setMarcados(new Set());
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      {/* Resultado simulado */}
      <div className="lg:col-span-2 flex flex-col items-center gap-4 rounded-lg border border-border/50 bg-surface p-5">
        <p className="text-sm font-medium text-text-muted">Resultado simulado</p>
        <IRPGauge value={sim.irp} semaforo={sim.semaforo} size={220} />
        <div className="flex w-full items-center justify-around border-t border-border/50 pt-4 text-center">
          <div>
            <p className="text-xs text-text-muted">IRP actual</p>
            <p className="text-xl font-semibold tabular-nums">{real.irp}</p>
          </div>
          <div className="text-2xl text-text-muted">→</div>
          <div>
            <p className="text-xs text-text-muted">IRP simulado</p>
            <p className="text-xl font-semibold tabular-nums text-ok">{sim.irp}</p>
          </div>
        </div>
        <div className="w-full rounded-lg bg-surface-2/50 p-3 text-center">
          <p className="text-xs text-text-muted">Monto en riesgo</p>
          <p className="text-lg font-semibold tabular-nums">
            {formatSoles(montoSim, { decimals: 0 })}
          </p>
          {montoReal !== montoSim && (
            <p className="text-xs text-ok">
              −{formatSoles(montoReal - montoSim, { decimals: 0 })} liberados
            </p>
          )}
        </div>
        <Button onClick={aplicar} disabled={marcados.size === 0} className="w-full">
          <Wand2 className="size-4" /> Aplicar {marcados.size > 0 ? `(${marcados.size})` : ""} al Kanban
        </Button>
        {marcados.size > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setMarcados(new Set())}>
            <RotateCcw className="size-3.5" /> Reiniciar simulación
          </Button>
        )}
      </div>

      {/* Lista de abiertos con toggle */}
      <div className="lg:col-span-3 flex flex-col rounded-lg border border-border/50 bg-surface">
        <div className="flex items-center justify-between border-b border-border/50 p-4">
          <p className="text-sm font-semibold">
            Hallazgos abiertos <span className="text-text-muted">({abiertos.length})</span>
          </p>
          <span className="text-xs text-text-muted">
            Marca los que subsanarías para ver el efecto
          </span>
        </div>
        <ScrollArea className="h-[420px]">
          <div className="flex flex-col divide-y divide-border/40">
            {abiertos.map((h) => (
              <label
                key={h.id}
                className="flex cursor-pointer items-center gap-3 p-3 transition-colors hover:bg-surface-2/40"
              >
                <Switch checked={marcados.has(h.id)} onCheckedChange={() => toggle(h.id)} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{h.titulo}</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <Badge variant="outline" className="text-[10px]">
                      {h.norma}
                    </Badge>
                    <SeveridadPill severidad={h.severidad} />
                  </div>
                </div>
              </label>
            ))}
            {abiertos.length === 0 && (
              <p className="p-8 text-center text-sm text-text-muted">
                No hay hallazgos abiertos. ¡Riesgo controlado!
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
