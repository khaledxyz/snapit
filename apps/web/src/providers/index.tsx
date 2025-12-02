import type { ReactNode } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";

import { ThemeProvider } from "./theme-provider";

interface Props {
  children: ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="snapit-theme">
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
