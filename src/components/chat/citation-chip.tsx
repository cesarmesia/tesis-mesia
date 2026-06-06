"use client";

import { useRouter } from "next/navigation";
import { BookText, FileText } from "lucide-react";
import type { ChatCitation } from "@/types";
import { cn } from "@/lib/utils";

export function CitationChip({ cita }: { cita: ChatCitation }) {
  const router = useRouter();
  const Icon = cita.tipo === "norma" ? BookText : FileText;

  return (
    <button
      onClick={() =>
        cita.hallazgoId && router.push(`/trazabilidad?focus=${cita.hallazgoId}`)
      }
      disabled={!cita.hallazgoId}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-surface-2/50 px-2.5 py-1 text-[11px] font-medium transition-colors",
        cita.hallazgoId
          ? "cursor-pointer hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
          : "cursor-default opacity-80",
      )}
      title={cita.hallazgoId ? "Abrir en trazabilidad" : undefined}
    >
      <Icon className="size-3" />
      {cita.etiqueta}
    </button>
  );
}
