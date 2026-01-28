import * as React from "react";
import { cn } from "@/lib/utils";

interface GameCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glow" | "highlight";
}

const GameCard = React.forwardRef<HTMLDivElement, GameCardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-card border-border",
      glow: "bg-card border-primary/30 glow-primary-sm",
      highlight: "gradient-card border-primary/50 border-glow",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border p-6 transition-all duration-300",
          "hover:border-primary/40 hover:glow-primary-sm",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
GameCard.displayName = "GameCard";

const GameCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));
GameCardHeader.displayName = "GameCardHeader";

const GameCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-display text-xl font-semibold tracking-wide text-foreground",
      className
    )}
    {...props}
  />
));
GameCardTitle.displayName = "GameCardTitle";

const GameCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
GameCardDescription.displayName = "GameCardDescription";

const GameCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
GameCardContent.displayName = "GameCardContent";

export {
  GameCard,
  GameCardHeader,
  GameCardTitle,
  GameCardDescription,
  GameCardContent,
};
