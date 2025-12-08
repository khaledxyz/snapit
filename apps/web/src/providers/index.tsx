import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";
import { PromptProvider } from "@/hooks/use-prompt";

import { ThemeProvider } from "./theme-provider";

interface Props {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="snapit-theme">
        <PromptProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </PromptProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
