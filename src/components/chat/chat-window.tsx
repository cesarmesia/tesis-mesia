"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Send,
  Sparkles,
  FolderOpen,
  Layers,
  FileText,
  ScanLine,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { MessageBubble } from "@/components/chat/message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useProjectStore } from "@/store/use-project-store";
import { extraerCitas } from "@/lib/prompt";
import { especialidadLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ChatMessage, Documento } from "@/types";

const SUGERENCIAS_PROYECTO = [
  "¿Cuáles son las observaciones críticas?",
  "¿Por qué falla la RVM 084-2019 en áreas mínimas?",
  "¿Qué documento tiene más no conformidades?",
];

const SUGERENCIAS_ARCHIVO = (nombre: string) => [
  `Resume las no conformidades de «${nombre}».`,
  "¿Cuál es el hallazgo más crítico de este documento?",
  "¿Qué debo corregir primero en este archivo?",
];

type Mode = "proyecto" | "archivo";

let idCounter = 0;
const nextId = () => `m-${++idCounter}`;

// Clave de hilo: cada contexto (proyecto o archivo concreto) es un chat aparte.
const ctxKey = (mode: Mode, docId: string) =>
  mode === "archivo" ? `archivo:${docId}` : "proyecto";

export function ChatWindow({ initialHallazgoId }: { initialHallazgoId?: string | null }) {
  const documentos = useProjectStore((s) => s.documentos);
  const hallazgos = useProjectStore((s) => s.hallazgos);

  const [mode, setMode] = React.useState<Mode>("proyecto");
  const [documentoId, setDocumentoId] = React.useState<string>("");
  // Hilos de conversación independientes por contexto.
  const [threads, setThreads] = React.useState<Record<string, ChatMessage[]>>({});
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const autoSentRef = React.useRef(false);

  const documentoSel = documentos.find((d) => d.id === documentoId);
  const currentKey = ctxKey(mode, documentoId);
  const messages = threads[currentKey] ?? [];

  // En modo archivo, mostramos el selector visual mientras no haya documento elegido.
  const enSelectorArchivo = mode === "archivo" && !documentoSel;

  const hallazgosDeDoc = React.useCallback(
    (nombre: string) =>
      hallazgos.filter((h) => h.citaExpediente.documento === nombre).length,
    [hallazgos],
  );

  async function send(text: string, ctx?: { mode: Mode; documentoId: string }) {
    const content = text.trim();
    if (!content || busy) return;
    const useMode = ctx?.mode ?? mode;
    const useDocId = ctx?.documentoId ?? documentoId;
    const key = ctxKey(useMode, useDocId);

    setInput("");
    setBusy(true);

    const userMsg: ChatMessage = { id: nextId(), role: "user", content };
    const assistantId = nextId();
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      pending: true,
    };
    const history = [...(threads[key] ?? []), userMsg];
    setThreads((prev) => ({ ...prev, [key]: [...history, assistantMsg] }));

    const patchAssistant = (patch: Partial<ChatMessage>) =>
      setThreads((prev) => ({
        ...prev,
        [key]: (prev[key] ?? []).map((m) =>
          m.id === assistantId ? { ...m, ...patch } : m,
        ),
      }));

    try {
      const dataset = useProjectStore.getState().exportDataset();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: useMode,
          documentoId: useMode === "archivo" ? useDocId : undefined,
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          dataset,
        }),
      });

      if (!res.body) throw new Error("Sin respuesta del servidor");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        patchAssistant({ content: acc, pending: true });
      }

      patchAssistant({
        content: acc,
        pending: false,
        citations: extraerCitas(acc, dataset),
      });
    } catch (err: any) {
      patchAssistant({
        content: `No se pudo obtener respuesta: ${err?.message ?? "error"}.`,
        pending: false,
      });
    } finally {
      setBusy(false);
    }
  }

  // Botón «Preguntar al asistente»: llega ?hallazgo=, contexto de proyecto y envío automático.
  React.useEffect(() => {
    if (!initialHallazgoId || autoSentRef.current) return;
    const h = hallazgos.find((x) => x.id === initialHallazgoId);
    if (!h) return;
    autoSentRef.current = true;
    setMode("proyecto");
    setDocumentoId("");
    send(
      `Explícame el hallazgo ${h.id} sobre «${h.titulo}» (${h.norma}): ¿por qué se reporta y cómo subsanarlo?`,
      { mode: "proyecto", documentoId: "" },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialHallazgoId]);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [threads, currentKey, enSelectorArchivo]);

  function elegirDocumento(d: Documento) {
    setDocumentoId(d.id);
  }

  return (
    <div className="flex h-[calc(100vh-13rem)] flex-col overflow-hidden rounded-lg border border-border/50 bg-surface">
      {/* Header: modo + archivo seleccionado */}
      <div className="flex flex-col gap-3 border-b border-border/50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={mode}
          onValueChange={(v) => {
            setMode(v as Mode);
            setInput("");
          }}
        >
          <TabsList>
            <TabsTrigger value="proyecto" className="gap-1.5">
              <Layers className="size-3.5" /> Proyecto
            </TabsTrigger>
            <TabsTrigger value="archivo" className="gap-1.5">
              <FolderOpen className="size-3.5" /> Por archivo
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* En modo archivo con documento elegido: chip + cambiar */}
        {mode === "archivo" && documentoSel && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 py-1">
              <FileText className="size-3.5 text-accent" />
              <span className="max-w-[180px] truncate">{documentoSel.nombre}</span>
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => setDocumentoId("")}
            >
              <ArrowLeft className="size-3.5" /> Cambiar
            </Button>
          </div>
        )}
      </div>

      {/* Cuerpo */}
      {enSelectorArchivo ? (
        <FilePicker
          documentos={documentos}
          hallazgosDeDoc={hallazgosDeDoc}
          onSelect={elegirDocumento}
        />
      ) : (
        <ScrollArea className="flex-1" viewportRef={scrollRef}>
          <div className="flex flex-col gap-5 p-4 sm:p-6">
            {messages.length === 0 ? (
              <EmptyState
                mode={mode}
                documentoNombre={documentoSel?.nombre}
                onSuggest={(s) => send(s)}
              />
            ) : (
              messages.map((m) => <MessageBubble key={m.id} message={m} />)
            )}
          </div>
        </ScrollArea>
      )}

      {/* Input (oculto mientras se elige archivo) */}
      {!enSelectorArchivo && (
        <div className="border-t border-border/50 p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder={
                mode === "archivo"
                  ? `Pregunta sobre «${documentoSel?.nombre ?? "el documento"}»…`
                  : "Pregunta sobre el proyecto…"
              }
              className="max-h-32 min-h-[44px] flex-1 resize-none"
              rows={1}
            />
            <Button type="submit" size="icon" disabled={busy || !input.trim()}>
              <Send className="size-4" />
            </Button>
          </form>
          <p className="mt-1.5 px-1 text-[11px] text-text-muted">
            Las respuestas se basan solo en el contexto del{" "}
            {mode === "archivo" ? "documento seleccionado" : "proyecto"}. Enter envía ·
            Shift+Enter salto de línea.
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Selector visual de documentos (modo «Por archivo») ───────────────── */
function FilePicker({
  documentos,
  hallazgosDeDoc,
  onSelect,
}: {
  documentos: Documento[];
  hallazgosDeDoc: (nombre: string) => number;
  onSelect: (d: Documento) => void;
}) {
  return (
    <ScrollArea className="flex-1">
      <div className="p-4 sm:p-6">
        <div className="mb-4">
          <p className="text-base font-semibold">Elige un documento</p>
          <p className="mt-1 text-sm text-text-muted">
            Abre un chat enfocado exclusivamente en ese archivo del expediente.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {documentos.map((d, i) => {
            const nNc = hallazgosDeDoc(d.nombre);
            return (
              <motion.button
                key={d.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => onSelect(d)}
                className="group flex flex-col gap-3 rounded-lg border border-border/60 bg-surface-2/30 p-4 text-left transition-colors hover:border-accent/40 hover:bg-accent/5"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/12 text-accent">
                    <FileText className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium leading-snug">
                      {d.nombre}
                    </p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {especialidadLabel[d.tipo] ?? d.tipo} · {d.paginas} págs
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "gap-1 text-[11px]",
                      nNc > 0 ? "text-fail" : "text-text-muted",
                    )}
                  >
                    <AlertTriangle className="size-3" />
                    {nNc} {nNc === 1 ? "hallazgo" : "hallazgos"}
                  </Badge>
                  {d.requiereOCR && (
                    <Badge variant="outline" className="gap-1 text-[11px] text-text-muted">
                      <ScanLine className="size-3" /> OCR
                    </Badge>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}

/* ── Estado vacío del hilo ────────────────────────────────────────────── */
function EmptyState({
  mode,
  documentoNombre,
  onSuggest,
}: {
  mode: Mode;
  documentoNombre?: string;
  onSuggest: (s: string) => void;
}) {
  const sugerencias =
    mode === "archivo" && documentoNombre
      ? SUGERENCIAS_ARCHIVO(documentoNombre)
      : SUGERENCIAS_PROYECTO;

  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-accent/12 text-accent">
        <Sparkles className="size-6" />
      </span>
      <div>
        <p className="text-base font-semibold">
          {mode === "archivo" && documentoNombre
            ? `Chat sobre «${documentoNombre}»`
            : "Asistente de verificación"}
        </p>
        <p className="mt-1 max-w-sm text-sm text-text-muted">
          {mode === "archivo"
            ? "Respuestas limitadas a este documento, con citas verificables y rechazo controlado fuera de alcance."
            : "Pregunta en lenguaje natural sobre el expediente. Respuestas con citas verificables y rechazo controlado fuera de alcance."}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {sugerencias.map((s) => (
          <button
            key={s}
            onClick={() => onSuggest(s)}
            className="rounded-full border border-border/60 bg-surface-2/50 px-3 py-1.5 text-xs transition-colors hover:border-accent/40 hover:text-accent"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
