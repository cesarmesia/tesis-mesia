"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SeveridadPill } from "@/components/shared/pills";
import { CardDrawer } from "@/components/kanban/card-drawer";
import { useProjectStore } from "@/store/use-project-store";
import { esAbierto } from "@/lib/irp";
import { estadoLabel, especialidadLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Hallazgo } from "@/types";

type Filtro = "abiertas" | "criticas" | "todas";

const pesoSev = (h: Hallazgo) =>
  h.severidad === "critica" ? 5 : h.severidad === "mayor" ? 3 : 1;

export function PrincipalesOmisiones() {
  const hallazgos = useProjectStore((s) => s.hallazgos);
  const [filtro, setFiltro] = React.useState<Filtro>("abiertas");
  const [open, setOpen] = React.useState<Hallazgo | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const lista = React.useMemo(() => {
    let l = [...hallazgos];
    if (filtro === "abiertas") l = l.filter(esAbierto);
    if (filtro === "criticas") l = l.filter((h) => h.severidad === "critica");
    return l.sort((a, b) => pesoSev(b) - pesoSev(a)).slice(0, 8);
  }, [hallazgos, filtro]);

  const filtros: { key: Filtro; label: string }[] = [
    { key: "abiertas", label: "Abiertas" },
    { key: "criticas", label: "Críticas" },
    { key: "todas", label: "Todas" },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center justify-between gap-3 pb-3">
        <CardTitle>Principales omisiones</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/omisiones">
            Ver Kanban <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardHeader>

      <div className="flex gap-1.5 px-6 pb-3">
        {filtros.map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              filtro === f.key
                ? "bg-accent/15 text-accent"
                : "bg-surface-2/50 text-text-muted hover:text-text",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <CardContent className="flex flex-col gap-2">
        {lista.length === 0 && (
          <p className="py-8 text-center text-sm text-text-muted">
            No hay omisiones para este filtro. 🎉
          </p>
        )}
        {lista.map((h, i) => (
          <motion.button
            key={h.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => {
              setOpen(h);
              setDrawerOpen(true);
            }}
            className="group flex items-center gap-3 rounded-[12px] border border-border/40 bg-surface-2/30 p-3 text-left transition-colors hover:border-accent/30 hover:bg-surface-2"
            style={{ borderLeft: "3px solid transparent" }}
          >
            <span className="font-mono text-[11px] text-text-muted">{h.id}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{h.titulo}</p>
              <p className="truncate text-[11px] text-text-muted">
                {h.norma} · {especialidadLabel[h.especialidad]} · {estadoLabel[h.estado]}
              </p>
            </div>
            <SeveridadPill severidad={h.severidad} />
            <ChevronRight className="size-4 shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5" />
          </motion.button>
        ))}
      </CardContent>

      <CardDrawer hallazgo={open} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </Card>
  );
}
