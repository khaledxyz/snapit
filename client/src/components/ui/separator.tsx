"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

interface SeparatorProps
  extends React.ComponentProps<typeof SeparatorPrimitive.Root> {
  children?: React.ReactNode;
  textClassName?: string;
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  children,
  textClassName,
  ...props
}: SeparatorProps) {
  // If no children, render the original separator
  if (!children) {
    return (
      <SeparatorPrimitive.Root
        data-slot="separator-root"
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
          className,
        )}
        {...props}
      />
    );
  }

  // Render separator with text in center
  if (orientation === "vertical") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center h-full",
          className,
        )}
        {...props}
      >
        <div className="flex-1 w-px bg-border" />
        <div
          className={cn(
            "px-2 py-1 text-sm text-muted-foreground",
            textClassName,
          )}
        >
          {children}
        </div>
        <div className="flex-1 w-px bg-border" />
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-center justify-center w-full", className)}
      {...props}
    >
      <div className="flex-1 h-px bg-border" />
      <div
        className={cn(
          "px-4 py-1 text-sm text-muted-foreground whitespace-nowrap",
          textClassName,
        )}
      >
        {children}
      </div>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

export { Separator };
