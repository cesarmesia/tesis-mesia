"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, FolderOpen, Layers } from "lucide-react";
import { MessageBubble } from "@/components/chat/message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjectStore } from "@/store/use-project-store";
import { extraerCitas } from "@/lib/prompt";
import type { ChatMessage } from "@/types";

const SUGERENCIAS = [
  "¿Cuáles son las observaciones críticas?",
  "¿Por qué falla la RVM 084-2019 en áreas mínimas?",
  "¿Qué documento tiene más no conformidades?",
];

let idCounter = 0;
const nextId = () => `m-${++idCounter}`;

export function ChatWindow({ initialHallazgoId }: { initialHallazgoId?: string | null }) {
  const documentos = useProjectStore((s) => s.documentos);
  const hallazgos = useProjectStore((s) => s.hallazgos);

  const [mode, setMode] = React.useState<"proyecto" | "archivo">("proyecto");
  const [documentoId, setDocumentoId] = React.useState<string>(documentos[0]?.id ?? "");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Precarga pregunta si llega ?hallazgo=
  React.useEffect(() => {
    if (initialHallazgoId) {
      const h = hallazgos.find((x) => x.id === initialHallazgoId);
      if (h) {
        setInput(
          `Explícame el hallazgo ${h.id} sobre «${h.titulo}» (${h.norma}): ¿por qué se reporta y cómo subsanarlo?`,
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialHallazgoId]);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
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
    const history = [...messages, userMsg];
    setMessages([...history, assistantMsg]);

    try {
      const dataset = useProjectStore.getState().exportDataset();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode,
          documentoId: mode === "archivo" ? documentoId : undefined,
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
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: acc, pending: true } : m,
          ),
        );
      }

      const citations = extraerCitas(acc, dataset);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: acc, pending: false, citations }
            : m,
        ),
      );
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: `No se pudo obtener respuesta: ${err?.message ?? "error"}.`,
                pending: false,
              }
            : m,
        ),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-13rem)] flex-col overflow-hidden rounded-lg border border-border/50 bg-surface">
      {/* Header: modo + archivo */}
      <div className="flex flex-col gap-3 border-b border-border/50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={mode} onValueChange={(v) => setMode(v as "proyecto" | "archivo")}>
          <TabsList>
            <TabsTrigger value="proyecto" className="gap-1.5">
              <Layers className="size-3.5" /> Proyecto
            </TabsTrigger>
            <TabsTrigger value="archivo" className="gap-1.5">
              <FolderOpen className="size-3.5" /> Por archivo
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {mode === "archivo" && (
          <Select value={documentoId} onValueChange={setDocumentoId}>
            <SelectTrigger className="w-full sm:w-[280px]">
              <SelectValue placeholder="Selecciona un documento" />
            </SelectTrigger>
            <SelectContent>
              {documentos.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Mensajes */}
      <ScrollArea className="flex-1" viewportRef={scrollRef}>
        <div className="flex flex-col gap-5 p-4 sm:p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-accent/12 text-accent">
                <Sparkles className="size-6" />
              </span>
              <div>
                <p className="text-base font-semibold">Asistente de verificación</p>
                <p className="mt-1 max-w-sm text-sm text-text-muted">
                  Pregunta en lenguaje natural sobre el expediente. Respuestas con citas
                  verificables y rechazo controlado fuera de alcance.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGERENCIAS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border/60 bg-surface-2/50 px-3 py-1.5 text-xs transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => <MessageBubble key={m.id} message={m} />)
          )}
        </div>
      </ScrollArea>

      {/* Input */}
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
                ? "Pregunta sobre el documento seleccionado…"
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
          {mode === "archivo" ? "documento" : "proyecto"}. Enter envía · Shift+Enter salto de
          línea.
        </p>
      </div>
    </div>
  );
}
