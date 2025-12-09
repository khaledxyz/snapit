import type { ReactNode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { AnchoredToastProvider, ToastProvider } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PromptProvider } from "@/hooks/use-prompt";
import { queryClient } from "@/lib/query-client";

import { ThemeProvider } from "./theme-provider";

interface Props {
  children: ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="snapit-theme">
        <PromptProvider>
          <ToastProvider position="bottom-center">
            <AnchoredToastProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </AnchoredToastProvider>
          </ToastProvider>
        </PromptProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
