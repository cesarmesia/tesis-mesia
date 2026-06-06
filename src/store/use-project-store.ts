"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Actividad,
  ChatSession,
  Dataset,
  Documento,
  EstadoKanban,
  Hallazgo,
  KPI,
  NormaResumen,
  Proyecto,
} from "@/types";
import { datasetSeed } from "@/data/seed";
import { EXPOSICION_FACTOR } from "@/lib/irp";

interface ProjectState {
  proyecto: Proyecto;
  kpis: KPI[];
  normas: NormaResumen[];
  hallazgos: Hallazgo[];
  documentos: Documento[];
  chatSessions: ChatSession[];
  actividades: Actividad[];
  exposicionFactor: number;
  hydrated: boolean;

  // acciones
  setHydrated: (v: boolean) => void;
  updateProyecto: (patch: Partial<Proyecto>) => void;
  setKpi: (id: string, patch: Partial<KPI>) => void;
  updateNorma: (codigo: string, patch: Partial<NormaResumen>) => void;
  updateHallazgo: (id: string, patch: Partial<Hallazgo>) => void;
  addHallazgo: (h: Hallazgo) => void;
  removeHallazgo: (id: string) => void;
  moveHallazgo: (id: string, estado: EstadoKanban) => void;
  setExposicionFactor: (f: number) => void;

  addChatSession: (s: ChatSession) => void;
  updateChatSession: (id: string, patch: Partial<ChatSession>) => void;
  clearChatSessions: () => void;

  addActividad: (a: Actividad) => void;
  updateActividad: (id: string, patch: Partial<Actividad>) => void;
  toggleActividad: (id: string) => void;
  removeActividad: (id: string) => void;

  importDataset: (d: Dataset) => void;
  exportDataset: () => Dataset;
  resetToPilot: () => void;
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      proyecto: clone(datasetSeed.proyecto),
      kpis: clone(datasetSeed.kpis),
      normas: clone(datasetSeed.normas),
      hallazgos: clone(datasetSeed.hallazgos),
      documentos: clone(datasetSeed.documentos),
      chatSessions: [],
      actividades: [],
      exposicionFactor: EXPOSICION_FACTOR,
      hydrated: false,

      setHydrated: (v) => set({ hydrated: v }),

      updateProyecto: (patch) =>
        set((s) => ({ proyecto: { ...s.proyecto, ...patch } })),

      setKpi: (id, patch) =>
        set((s) => ({
          kpis: s.kpis.map((k) => (k.id === id ? { ...k, ...patch } : k)),
        })),

      updateNorma: (codigo, patch) =>
        set((s) => ({
          normas: s.normas.map((n) => (n.codigo === codigo ? { ...n, ...patch } : n)),
        })),

      updateHallazgo: (id, patch) =>
        set((s) => ({
          hallazgos: s.hallazgos.map((h) => (h.id === id ? { ...h, ...patch } : h)),
        })),

      addHallazgo: (h) => set((s) => ({ hallazgos: [...s.hallazgos, h] })),

      removeHallazgo: (id) =>
        set((s) => ({ hallazgos: s.hallazgos.filter((h) => h.id !== id) })),

      moveHallazgo: (id, estado) =>
        set((s) => ({
          hallazgos: s.hallazgos.map((h) => (h.id === id ? { ...h, estado } : h)),
        })),

      setExposicionFactor: (f) => set({ exposicionFactor: f }),

      addChatSession: (sess) =>
        set((s) => ({ chatSessions: [...s.chatSessions, sess] })),

      updateChatSession: (id, patch) =>
        set((s) => ({
          chatSessions: s.chatSessions.map((c) =>
            c.id === id ? { ...c, ...patch } : c,
          ),
        })),

      clearChatSessions: () => set({ chatSessions: [] }),

      addActividad: (a) => set((s) => ({ actividades: [a, ...s.actividades] })),

      updateActividad: (id, patch) =>
        set((s) => ({
          actividades: s.actividades.map((a) =>
            a.id === id ? { ...a, ...patch } : a,
          ),
        })),

      toggleActividad: (id) =>
        set((s) => ({
          actividades: s.actividades.map((a) =>
            a.id === id ? { ...a, hecha: !a.hecha } : a,
          ),
        })),

      removeActividad: (id) =>
        set((s) => ({ actividades: s.actividades.filter((a) => a.id !== id) })),

      importDataset: (d) =>
        set({
          proyecto: clone(d.proyecto),
          kpis: clone(d.kpis),
          normas: clone(d.normas),
          hallazgos: clone(d.hallazgos),
          documentos: clone(d.documentos),
        }),

      exportDataset: () => {
        const s = get();
        return clone({
          proyecto: s.proyecto,
          kpis: s.kpis,
          normas: s.normas,
          hallazgos: s.hallazgos,
          documentos: s.documentos,
        });
      },

      resetToPilot: () =>
        set({
          proyecto: clone(datasetSeed.proyecto),
          kpis: clone(datasetSeed.kpis),
          normas: clone(datasetSeed.normas),
          hallazgos: clone(datasetSeed.hallazgos),
          documentos: clone(datasetSeed.documentos),
          exposicionFactor: EXPOSICION_FACTOR,
        }),
    }),
    {
      name: "tesis-mesia-v1",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: (s) => ({
        proyecto: s.proyecto,
        kpis: s.kpis,
        normas: s.normas,
        hallazgos: s.hallazgos,
        documentos: s.documentos,
        chatSessions: s.chatSessions,
        actividades: s.actividades,
        exposicionFactor: s.exposicionFactor,
      }),
    },
  ),
);

// Helper para obtener el dataset completo (para el chat / export).
export function getDataset(): Dataset {
  return useProjectStore.getState().exportDataset();
}
