"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Evita hydration mismatch entre el HTML del servidor (datos semilla) y el
 * cliente (store rehidratado desde localStorage). Renderiza el fallback hasta
 * que el componente monta en el cliente.
 */
export function Hydrated({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <>{fallback ?? <Skeleton className="h-64 w-full rounded-lg" />}</>
    );
  }
  return <>{children}</>;
}
