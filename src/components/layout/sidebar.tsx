"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { navItems, type NavItem } from "@/lib/nav";
import { cn } from "@/lib/utils";

const groups: NavItem["group"][] = ["Análisis", "Gestión", "Sistema"];

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6 px-3 py-4">
      {groups.map((group) => (
        <div key={group} className="flex flex-col gap-1">
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-text-muted/70">
            {group}
          </p>
          {navItems
            .filter((i) => i.group === group)
            .map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-[10px] px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-text"
                      : "text-text-muted hover:bg-surface-2 hover:text-text",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-[10px] bg-accent/12 ring-1 ring-accent/30"
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={cn(
                      "relative z-10 size-[18px] shrink-0",
                      active && "text-accent",
                    )}
                  />
                  <span className="relative z-10 truncate">{item.label}</span>
                </Link>
              );
            })}
        </div>
      ))}
    </nav>
  );
}

export function SidebarBrand() {
  return (
    <div className="flex items-center gap-2.5 px-5 py-5">
      <div className="flex size-9 items-center justify-center rounded-[10px] bg-accent text-accent-foreground shadow-glow">
        <ShieldCheck className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold leading-tight">VerifexAI</p>
        <p className="truncate text-[11px] text-text-muted">
          Expedientes técnicos
        </p>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-surface/40 backdrop-blur-xl lg:flex">
      <SidebarBrand />
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <NavLinks />
      </div>
      <div className="border-t border-border/60 px-5 py-3">
        <p className="text-[11px] leading-relaxed text-text-muted">
          Tesis · C. Y. Mesía Gómez
          <br />
          UPC — Ingeniería Civil
        </p>
      </div>
    </aside>
  );
}
