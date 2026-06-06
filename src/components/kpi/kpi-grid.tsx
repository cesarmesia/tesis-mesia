"use client";

import { useProjectStore } from "@/store/use-project-store";
import { KpiCard } from "@/components/kpi/kpi-card";

export function KpiGrid() {
  const kpis = useProjectStore((s) => s.kpis);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {kpis.map((k, i) => (
        <KpiCard key={k.id} kpi={k} index={i} />
      ))}
    </div>
  );
}
