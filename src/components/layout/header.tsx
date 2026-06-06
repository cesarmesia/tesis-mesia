"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavLinks, SidebarBrand } from "@/components/layout/sidebar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ProjectSwitcher } from "@/components/layout/project-switcher";
import { IRPBadge } from "@/components/irp/irp-badge";

export function Header() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-bg/70 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Menú móvil */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarBrand />
          <div className="overflow-y-auto scrollbar-thin">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <ProjectSwitcher />

      <div className="ml-auto flex items-center gap-2">
        <IRPBadge />
        <ThemeToggle />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Cerrar sesión"
              onClick={logout}
            >
              <LogOut className="size-[18px]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Cerrar sesión</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
