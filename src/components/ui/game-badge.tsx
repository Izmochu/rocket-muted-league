import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gameBadgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium font-display tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",
        primary: "bg-primary/20 text-primary border border-primary/30",
        success: "bg-success/20 text-success border border-success/30",
        warning: "bg-warning/20 text-warning border border-warning/30",
        destructive: "bg-destructive/20 text-destructive border border-destructive/30",
        outline: "border border-border text-muted-foreground",
        glow: "bg-primary/10 text-primary border border-primary/40 glow-primary-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface GameBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gameBadgeVariants> {}

function GameBadge({ className, variant, ...props }: GameBadgeProps) {
  return (
    <div className={cn(gameBadgeVariants({ variant }), className)} {...props} />
  );
}

export { GameBadge, gameBadgeVariants };
