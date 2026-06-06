import { Badge } from "@/components/ui/badge";
import type { Dictamen, Severidad } from "@/types";
import { dictamenLabel, severidadLabel } from "@/lib/format";

export function DictamenPill({ dictamen }: { dictamen: Dictamen }) {
  const variant =
    dictamen === "Cumple" ? "ok" : dictamen === "Observado" ? "observed" : "fail";
  return (
    <Badge variant={variant}>
      <span className="size-1.5 rounded-full bg-current" />
      {dictamenLabel[dictamen]}
    </Badge>
  );
}

export function SeveridadPill({ severidad }: { severidad: Severidad }) {
  if (severidad === "ninguna") {
    return <Badge variant="secondary">Ninguna</Badge>;
  }
  return <Badge variant={severidad}>{severidadLabel[severidad]}</Badge>;
}
