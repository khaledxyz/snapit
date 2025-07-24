import "../styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/providers/query-client-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { fonts } from "@/config/fonts.config";
export { metadata } from "@/config/metadata.config";

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </QueryProvider>
      <Toaster richColors position="bottom-center" />
    </ThemeProvider>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fonts} font-sans relative antialiased bg-background flex flex-col min-h-screen`}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
