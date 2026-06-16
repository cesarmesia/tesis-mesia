import OpenAI from "openai";

export interface LLMMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CompletionParams {
  system: string;
  messages: LLMMessage[];
}

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

/**
 * Provider-agnostic. Devuelve un ReadableStream<Uint8Array> de texto plano
 * (UTF-8). Cambiar de proveedor = reescribir solo esta función.
 */
export function getCompletionStream(params: CompletionParams): ReadableStream<Uint8Array> {
  const apiKey = process.env.OPENAI_API_KEY;
  const encoder = new TextEncoder();

  // Sin API key → fallback determinista para que la demo funcione igual.
  if (!apiKey) {
    return new ReadableStream({
      start(controller) {
        const msg =
          "⚠️ No hay OPENAI_API_KEY configurada en el servidor, así que respondo en modo local (sin LLM).\n\n" +
          "Configura `.env.local` con tu clave para activar respuestas generativas con citas. Mientras tanto, revisa los hallazgos en /trazabilidad y /omisiones.";
        controller.enqueue(encoder.encode(msg));
        controller.close();
      },
    });
  }

  const client = new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
  });

  return new ReadableStream({
    async start(controller) {
      try {
        const stream = await client.chat.completions.create({
          model: MODEL,
          max_tokens: 1024,
          stream: true,
          // OpenAI recibe el system prompt como un mensaje con rol "system".
          messages: [
            { role: "system", content: params.system },
            ...params.messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          ],
        });

        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content;
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }

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
