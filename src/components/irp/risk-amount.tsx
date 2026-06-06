"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";
import { formatSoles } from "@/lib/format";

export function RiskAmount({
  monto,
  compact = false,
}: {
  monto: number;
  compact?: boolean;
}) {
  const animated = useCountUp(monto, { duration: 1 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="flex items-center gap-3"
    >
      <span className="flex size-10 items-center justify-center rounded-[10px] bg-fail/12 text-fail">
        <Wallet className="size-5" />
      </span>
      <div>
        <p className="text-xs font-medium text-text-muted">Monto en riesgo</p>
        <p className={compact ? "text-lg font-semibold tabular-nums" : "text-2xl font-semibold tabular-nums"}>
          {formatSoles(animated, { decimals: 0 })}
        </p>
      </div>
    </motion.div>
  );
}
