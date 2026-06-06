import Anthropic from "@anthropic-ai/sdk";

export interface LLMMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CompletionParams {
  system: string;
  messages: LLMMessage[];
}

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

/**
 * Provider-agnostic. Devuelve un ReadableStream<Uint8Array> de texto plano
 * (UTF-8). Cambiar de proveedor = reescribir solo esta función.
 */
export function getCompletionStream(params: CompletionParams): ReadableStream<Uint8Array> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const encoder = new TextEncoder();

  // Sin API key → fallback determinista para que la demo funcione igual.
  if (!apiKey) {
    return new ReadableStream({
      start(controller) {
        const msg =
          "⚠️ No hay ANTHROPIC_API_KEY configurada en el servidor, así que respondo en modo local (sin LLM).\n\n" +
          "Configura `.env.local` con tu clave para activar respuestas generativas con citas. Mientras tanto, revisa los hallazgos en /trazabilidad y /omisiones.";
        controller.enqueue(encoder.encode(msg));
        controller.close();
      },
    });
  }

  const client = new Anthropic({ apiKey });

  return new ReadableStream({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: MODEL,
          max_tokens: 1024,
          system: params.system,
          messages: params.messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        });

        stream.on("text", (text) => {
          controller.enqueue(encoder.encode(text));
        });

        await stream.finalMessage();
        controller.close();
      } catch (err: any) {
        const msg = `\n\n[Error del modelo: ${err?.message ?? "desconocido"}]`;
        controller.enqueue(encoder.encode(msg));
        controller.close();
      }
    },
  });
}

// TODO (producción): aquí, en lugar de inyectar todo el contexto, este módulo
// consultaría Qdrant (recuperación híbrida densa+dispersa) y Airtable para
// recuperar solo los fragmentos relevantes, tal como describe la tesis.
