"use client";

import * as React from "react";
import Link from "next/link";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Download,
  MessageSquareText,
  Search,
  SquareKanban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DictamenPill, SeveridadPill } from "@/components/shared/pills";
import { useProjectStore } from "@/store/use-project-store";
import { especialidadLabel } from "@/lib/format";
import { exportHallazgosCSV, exportHallazgosJSON } from "@/lib/export";
import type { Hallazgo } from "@/types";

function SortHeader({ column, children }: { column: any; children: React.ReactNode }) {
  return (
    <button
      className="flex items-center gap-1 hover:text-text"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {children}
      <ArrowUpDown className="size-3" />
    </button>
  );
}

export function TraceTable({ focusId }: { focusId?: string | null }) {
  const hallazgos = useProjectStore((s) => s.hallazgos);
  const normas = useProjectStore((s) => s.normas);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [expanded, setExpanded] = React.useState<string | null>(focusId ?? null);

  React.useEffect(() => {
    if (focusId) setExpanded(focusId);
  }, [focusId]);

  const columns = React.useMemo<ColumnDef<Hallazgo>[]>(
    () => [
      {
        id: "expander",
        header: "",
        cell: ({ row }) => (
          <button
            aria-label="Expandir"
            onClick={() => setExpanded((e) => (e === row.original.id ? null : row.original.id))}
            className="text-text-muted transition-transform"
          >
            {expanded === row.original.id ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </button>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "id",
        header: ({ column }) => <SortHeader column={column}>ID</SortHeader>,
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.original.id}</span>
        ),
      },
      {
        accessorKey: "norma",
        header: ({ column }) => <SortHeader column={column}>Norma</SortHeader>,
        filterFn: (row, id, value) => value === "todas" || row.getValue(id) === value,
        cell: ({ row }) => <span className="text-sm">{row.original.norma}</span>,
      },
      {
        accessorKey: "especialidad",
        header: "Especialidad",
        cell: ({ row }) => (
          <span className="text-xs text-text-muted">
            {especialidadLabel[row.original.especialidad]}
          </span>
        ),
      },
      {
        accessorKey: "dictamen",
        header: "Dictamen",
        filterFn: (row, id, value) => value === "todos" || row.getValue(id) === value,
        cell: ({ row }) => <DictamenPill dictamen={row.original.dictamen} />,
      },
      {
        accessorKey: "severidad",
        header: ({ column }) => <SortHeader column={column}>Severidad</SortHeader>,
        filterFn: (row, id, value) => value === "todas" || row.getValue(id) === value,
        cell: ({ row }) => <SeveridadPill severidad={row.original.severidad} />,
      },
      {
        id: "pagExp",
        header: "Pág. exp.",
        accessorFn: (h) => h.citaExpediente.pagina,
        cell: ({ row }) => (
          <span className="font-mono text-xs text-text-muted">
            p.{row.original.citaExpediente.pagina}
          </span>
        ),
      },
      {
        id: "pagNorma",
        header: "Pág. norma",
        accessorFn: (h) => h.citaNorma.pagina,
        cell: ({ row }) => (
          <span className="font-mono text-xs text-text-muted">
            p.{row.original.citaNorma.pagina}
          </span>
        ),
      },
    ],
    [expanded],
  );

  const table = useReactTable({
    data: hallazgos,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _id, value) => {
      const v = String(value).toLowerCase();
      const h = row.original;
      return (
        h.id.toLowerCase().includes(v) ||
        h.titulo.toLowerCase().includes(v) ||
        h.norma.toLowerCase().includes(v) ||
        h.justificacion.toLowerCase().includes(v) ||
        h.idRequisito.toLowerCase().includes(v)
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 12 } },
  });

  const setFilter = (col: string, val: string) =>
    table.getColumn(col)?.setFilterValue(val);

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Buscar hallazgo, norma, requisito…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select defaultValue="todas" onValueChange={(v) => setFilter("norma", v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Norma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las normas</SelectItem>
              {normas.map((n) => (
                <SelectItem key={n.codigo} value={n.codigo}>
                  {n.codigo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select defaultValue="todas" onValueChange={(v) => setFilter("severidad", v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Severidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Toda severidad</SelectItem>
              <SelectItem value="critica">Crítica</SelectItem>
              <SelectItem value="mayor">Mayor</SelectItem>
              <SelectItem value="menor">Menor</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="todos" onValueChange={(v) => setFilter("dictamen", v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Dictamen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todo dictamen</SelectItem>
              <SelectItem value="No Cumple">No cumple</SelectItem>
              <SelectItem value="Observado">Observado</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="size-4" /> Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => exportHallazgosCSV(table.getFilteredRowModel().rows.map((r) => r.original))}
              >
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => exportHallazgosJSON(table.getFilteredRowModel().rows.map((r) => r.original))}
              >
                JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-lg border border-border/50 bg-surface">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent">
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-text-muted">
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
            {table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow
                  data-state={expanded === row.original.id ? "selected" : undefined}
                  className="cursor-pointer"
                  onClick={() =>
                    setExpanded((e) => (e === row.original.id ? null : row.original.id))
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
                <AnimatePresence>
                  {expanded === row.original.id && (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={columns.length} className="p-0">
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <ExpandedRow h={row.original} />
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between text-sm text-text-muted">
        <span>
          {table.getFilteredRowModel().rows.length} hallazgos ·{" "}
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}

function ExpandedRow({ h }: { h: Hallazgo }) {
  return (
    <div className="grid grid-cols-1 gap-4 bg-surface-2/30 p-5 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <p className="text-base font-semibold">{h.titulo}</p>
        <p className="mt-1 text-sm text-text-muted">
          <span className="font-medium text-text">Justificación: </span>
          {h.justificacion}
        </p>
        <p className="mt-1 text-sm text-text-muted">
          <span className="font-medium text-text">Recomendación: </span>
          {h.recomendacion}
        </p>
      </div>

      <div className="rounded-lg border border-border/50 bg-surface p-3">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
          Cita normativa
        </p>
        <p className="font-mono text-xs">
          {h.citaNorma.id} · p.{h.citaNorma.pagina}
        </p>
        <p className="mt-1 font-mono text-xs text-text-muted">“{h.citaNorma.texto}”</p>
      </div>

      <div className="rounded-lg border border-border/50 bg-surface p-3">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
          Cita del expediente
        </p>
        <p className="font-mono text-xs">
          {h.citaExpediente.documento} · p.{h.citaExpediente.pagina}
        </p>
        <p className="mt-1 font-mono text-xs text-text-muted">“{h.citaExpediente.texto}”</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:col-span-2">
        <Button asChild size="sm" variant="outline">
          <Link href={`/chat?hallazgo=${h.id}`}>
            <MessageSquareText className="size-4" /> Preguntar al asistente sobre este hallazgo
          </Link>
        </Button>
        <Button asChild size="sm" variant="ghost">
          <Link href={`/omisiones?focus=${h.id}`}>
            <SquareKanban className="size-4" /> Abrir en Kanban
          </Link>
        </Button>
        {h.placeholder && (
          <span className="ml-auto text-[11px] text-text-muted">
            * Citas ilustrativas (placeholder) — reemplazar por las reales.
          </span>
        )}
      </div>
    </div>
  );
}
