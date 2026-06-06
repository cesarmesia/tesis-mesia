"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { semaforoColor, semaforoLabel } from "@/lib/irp";
import { useCountUp } from "@/hooks/use-count-up";

interface GaugeProps {
  value: number; // 0..100
  semaforo: "verde" | "ambar" | "rojo";
  size?: number;
}

// Gauge tipo velocímetro: semicírculo superior (base plana abajo) animado por spring.
export function IRPGauge({ value, semaforo, size = 220 }: GaugeProps) {
  const reduce = useReducedMotion();
  const displayValue = useCountUp(value, { duration: reduce ? 0 : 1 });

  const stroke = Math.max(12, size * 0.09);
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2; // línea base del semicírculo
  const arcLen = Math.PI * r; // longitud del semicírculo
  const progress = Math.min(100, Math.max(0, value)) / 100;
  const color = semaforoColor[semaforo];

  // Semicírculo superior: de (cx-r, cy) por arriba hasta (cx+r, cy).
  const trackPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const height = cy + stroke / 2 + 2; // incluye los extremos redondeados

  return (
    <svg
      width={size}
      height={height}
      viewBox={`0 0 ${size} ${height}`}
      style={{ fontFamily: "inherit" }}
      role="img"
      aria-label={`IRP ${Math.round(value)} de 100, riesgo ${semaforoLabel[semaforo]}`}
    >
      {/* Track */}
      <path
        d={trackPath}
        fill="none"
        stroke="hsl(var(--surface-2))"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      {/* Progreso (se llena de izquierda a derecha) */}
      <motion.path
        d={trackPath}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={arcLen}
        initial={{ strokeDashoffset: arcLen }}
        animate={{ strokeDashoffset: arcLen * (1 - progress) }}
        transition={{ type: "spring", stiffness: 60, damping: 18 }}
        style={{ filter: `drop-shadow(0 2px 6px ${color}55)` }}
      />
      {/* Valor + etiqueta, anclados a la geometría (sin desalineación) */}
      <text
        x={cx}
        y={cy - size * 0.07}
        textAnchor="middle"
        fontSize={size * 0.26}
        fontWeight={600}
        fill={color}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {Math.round(displayValue)}
      </text>
      <text
        x={cx}
        y={cy - size * 0.005}
        textAnchor="middle"
        fontSize={size * 0.072}
        fill="hsl(var(--text-muted))"
      >
        IRP · Riesgo {semaforoLabel[semaforo]}
      </text>
    </svg>
  );
}
