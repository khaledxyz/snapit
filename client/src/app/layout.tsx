import "../styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { QueryProvider } from "@/providers/query-client-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
export { metadata } from "@/config/metadata.config";

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
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
      {/* <head>
        {umamiWebsiteId && umamiScriptUrl && (
          <Script
            async
            defer
            data-website-id={umamiWebsiteId}
            src={umamiScriptUrl}
            strategy="afterInteractive"
          />
        )}
      </head> */}
      <body className='relative antialiased bg-background flex flex-col min-h-screen'>
        <AppProviders>
          <Header />
          <main>
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
