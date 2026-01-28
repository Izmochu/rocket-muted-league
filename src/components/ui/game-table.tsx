import * as React from "react";
import { cn } from "@/lib/utils";

const GameTable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
GameTable.displayName = "GameTable";

const GameTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("border-b border-border/50", className)}
    {...props}
  />
));
GameTableHeader.displayName = "GameTableHeader";

const GameTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
GameTableBody.displayName = "GameTableBody";

const GameTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-border/30 transition-colors",
      "hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
GameTableRow.displayName = "GameTableRow";

const GameTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-display font-medium text-primary tracking-wide",
      "[&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
GameTableHead.displayName = "GameTableHead";

const GameTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle text-foreground/90",
      "[&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
GameTableCell.displayName = "GameTableCell";

export {
  GameTable,
  GameTableHeader,
  GameTableBody,
  GameTableRow,
  GameTableHead,
  GameTableCell,
};
