import { useCallback } from "react";

import { MoonIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/providers/theme-provider";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  const toggleTheme = useCallback(() => {
    // If currently system, determine what it's displaying and toggle
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setTheme(systemTheme === "dark" ? "light" : "dark");
    } else {
      setTheme(theme === "dark" ? "light" : "dark");
    }
  }, [theme, setTheme]);

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button onClick={toggleTheme} size="icon-sm" variant="outline">
            <MoonIcon />
          </Button>
        }
      />
      <TooltipPopup side="right">Toggle Theme</TooltipPopup>
    </Tooltip>
  );
}
