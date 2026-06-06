import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-accent text-accent-foreground",
        secondary: "border-transparent bg-surface-2 text-text",
        outline: "text-text border-border",
        ok: "border-transparent bg-ok/15 text-ok",
        observed: "border-transparent bg-observed/15 text-observed",
        fail: "border-transparent bg-fail/15 text-fail",
        critica: "border-transparent bg-sev-critica/15 text-sev-critica",
        mayor: "border-transparent bg-sev-mayor/15 text-sev-mayor",
        menor: "border-transparent bg-sev-menor/15 text-sev-menor",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
