"use client";

import * as React from "react";
import Link from "next/link";
import { MessageSquareText } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DictamenPill, SeveridadPill } from "@/components/shared/pills";
import { Badge } from "@/components/ui/badge";
import { useProjectStore } from "@/store/use-project-store";
import { estadoLabel } from "@/lib/format";
import type { EstadoKanban, Hallazgo } from "@/types";

const ESTADOS: EstadoKanban[] = [
  "por_revisar",
  "en_correccion",
  "subsanado",
  "verificado",
];

export function CardDrawer({
  hallazgo,
  open,
  onOpenChange,
}: {
  hallazgo: Hallazgo | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const updateHallazgo = useProjectStore((s) => s.updateHallazgo);
  const moveHallazgo = useProjectStore((s) => s.moveHallazgo);

  if (!hallazgo) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border/50">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-text-muted">{hallazgo.id}</span>
            <Badge variant="outline">{hallazgo.norma}</Badge>
            <DictamenPill dictamen={hallazgo.dictamen} />
          </div>
          <SheetTitle className="text-left leading-snug">{hallazgo.titulo}</SheetTitle>
          <SheetDescription className="text-left">
            <SeveridadPill severidad={hallazgo.severidad} />
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-5 p-6">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-text-muted">Estado</Label>
                <Select
                  value={hallazgo.estado}
                  onValueChange={(v) => moveHallazgo(hallazgo.id, v as EstadoKanban)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((e) => (
                      <SelectItem key={e} value={e}>
                        {estadoLabel[e]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-text-muted">Responsable</Label>
                <Input
                  className="mt-1"
                  placeholder="Asignar…"
                  value={hallazgo.responsable ?? ""}
                  onChange={(e) =>
                    updateHallazgo(hallazgo.id, { responsable: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Justificación
              </p>
              <p className="text-sm leading-relaxed">{hallazgo.justificacion}</p>
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Recomendación
              </p>
              <p className="text-sm leading-relaxed">{hallazgo.recomendacion}</p>
            </div>

            <div className="rounded-lg border border-border/50 bg-surface-2/30 p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Cita normativa
              </p>
              <p className="font-mono text-xs">
                {hallazgo.citaNorma.id} · p.{hallazgo.citaNorma.pagina}
              </p>
              <p className="mt-1 font-mono text-xs text-text-muted">
                “{hallazgo.citaNorma.texto}”
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-surface-2/30 p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Cita del expediente
              </p>
              <p className="font-mono text-xs">
                {hallazgo.citaExpediente.documento} · p.{hallazgo.citaExpediente.pagina}
              </p>
              <p className="mt-1 font-mono text-xs text-text-muted">
                “{hallazgo.citaExpediente.texto}”
              </p>
            </div>

            <Button asChild variant="outline">
              <Link href={`/chat?hallazgo=${hallazgo.id}`}>
                <MessageSquareText className="size-4" /> Preguntar al asistente
              </Link>
            </Button>

            {hallazgo.placeholder && (
              <p className="text-[11px] text-text-muted">
                * Citas ilustrativas (placeholder) — reemplazar por las reales antes de la
                sustentación.
              </p>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
