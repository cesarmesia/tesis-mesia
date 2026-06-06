import { NextRequest } from "next/server";
import { z } from "zod";
import { construirContexto } from "@/lib/prompt";
import { getCompletionStream } from "@/lib/llm";
import { datasetSchema } from "@/lib/schema";

export const runtime = "nodejs";

const bodySchema = z.object({
  mode: z.enum(["proyecto", "archivo"]),
  documentoId: z.string().optional(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }),
  ),
  // El cliente envía el dataset (editable en /control) para mantener el chat dinámico.
  dataset: datasetSchema,
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("JSON inválido", { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
      status: 422,
      headers: { "content-type": "application/json" },
    });
  }

  const { mode, documentoId, messages, dataset } = parsed.data;

  const { systemPrompt } = construirContexto(dataset, mode, documentoId);

  const stream = getCompletionStream({
    system: systemPrompt,
    messages,
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-transform",
    },
  });
}
