"use client";

import * as React from "react";
import { animate } from "framer-motion";

// Count-up animado para KPIs (§6.1). Respeta prefers-reduced-motion.
export function useCountUp(value: number, opts?: { duration?: number; decimals?: number }) {
  const duration = opts?.duration ?? 0.9;
  const decimals = opts?.decimals ?? 0;
  const [display, setDisplay] = React.useState(value);
  const prev = React.useRef(value);

  React.useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, duration]);

  const factor = Math.pow(10, decimals);
  return Math.round(display * factor) / factor;
}
