"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Hydrated } from "@/components/shared/hydrated";
import { ChatWindow } from "@/components/chat/chat-window";

function ChatInner() {
  const params = useSearchParams();
  const hallazgo = params.get("hallazgo");
  return <ChatWindow initialHallazgoId={hallazgo} />;
}

export default function ChatPage() {
  return (
    <div>
      <PageHeader
        title="Asistente conversacional"
        description="Pregunta sobre el proyecto o sobre un documento específico. Respuestas con citas y rechazo controlado fuera de alcance."
      />
      <Hydrated fallback={<div className="h-96 animate-pulse rounded-lg bg-surface-2" />}>
        <React.Suspense>
          <ChatInner />
        </React.Suspense>
      </Hydrated>
    </div>
  );
}
