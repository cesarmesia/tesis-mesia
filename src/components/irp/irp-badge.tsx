"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Gauge } from "lucide-react";
import { useIRP } from "@/hooks/use-derived";
import { semaforoLabel } from "@/lib/irp";
import { cn } from "@/lib/utils";

const semaforoClasses: Record<string, string> = {
  verde: "bg-ok/15 text-ok ring-ok/30",
  ambar: "bg-observed/15 text-observed ring-observed/30",
  rojo: "bg-fail/15 text-fail ring-fail/30",
};

export function IRPBadge({ asLink = true }: { asLink?: boolean }) {
  const { irp, semaforo } = useIRP();
  const prev = React.useRef(irp);
  const [delta, setDelta] = React.useState<number | null>(null);

  React.useEffect(() => {
    const d = irp - prev.current;
    if (d !== 0) {
      setDelta(d);
      prev.current = irp;
      const t = setTimeout(() => setDelta(null), 1400);
      return () => clearTimeout(t);
    }
  }, [irp]);

  const content = (
    <div
      className={cn(
        "relative flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 transition-colors",
        semaforoClasses[semaforo],
      )}
    >
      <Gauge className="size-4" />
      <span className="hidden sm:inline text-xs font-medium opacity-80">IRP</span>
      <motion.span
        key={irp}
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="tabular-nums"
      >
        {irp}
      </motion.span>
      <span className="hidden md:inline text-[11px] font-medium opacity-70">
        · {semaforoLabel[semaforo]}
      </span>

      <AnimatePresence>
        {delta !== null && (
          <motion.span
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -22, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className={cn(
              "pointer-events-none absolute right-2 top-0 text-xs font-bold",
              delta < 0 ? "text-ok" : "text-fail",
            )}
          >
            {delta < 0 ? `−${Math.abs(delta)} pts` : `+${delta} pts`}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );

  if (!asLink) return content;
  return (
    <Link href="/riesgo" aria-label={`Índice de Riesgo de Paralización: ${irp}`}>
      {content}
    </Link>
  );
}
