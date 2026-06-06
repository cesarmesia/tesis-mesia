"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/";

  const [user, setUser] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "No se pudo iniciar sesión");
        setBusy(false);
        return;
      }
      router.replace(from);
      router.refresh();
    } catch {
      setError("Error de red. Inténtalo de nuevo.");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      {/* Fondo decorativo */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-[480px] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 size-[480px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 28 }}
        className="relative w-full max-w-sm"
      >
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-[14px] bg-accent text-accent-foreground shadow-glow">
            <ShieldCheck className="size-6" />
          </span>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">VerifexAI</h1>
            <p className="text-sm text-text-muted">
              Verificación de expedientes técnicos
            </p>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="flex flex-col gap-4 rounded-lg border border-border/60 bg-surface/80 p-6 shadow-lg backdrop-blur-xl"
        >
          <div>
            <Label htmlFor="user" className="text-xs text-text-muted">
              Usuario
            </Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
              <Input
                id="user"
                autoFocus
                autoComplete="username"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="pl-9"
                placeholder="revisor"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-xs text-text-muted">
              Contraseña
            </Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-md bg-fail/10 px-3 py-2 text-sm text-fail"
            >
              {error}
            </motion.p>
          )}

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Ingresando…
              </>
            ) : (
              "Ingresar"
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-text-muted">
          Tesis · C. Y. Mesía Gómez — UPC, Ingeniería Civil
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense>
      <LoginInner />
    </React.Suspense>
  );
}
