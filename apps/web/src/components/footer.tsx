import { GithubIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { Logo } from "./logo";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="mt-auto border-t">
      <div className="container flex items-center justify-between border-x py-3">
        <div className="flex items-center gap-2">
          <Logo className="text-muted-foreground" size="sm" />
          <Separator orientation="vertical" />
          <span className="text-muted-foreground text-sm">
            Created by khaledxyz
          </span>
          <Separator className="hidden sm:block" orientation="vertical" />
          <div className="hidden items-center gap-3 sm:flex">
            <a
              className="text-muted-foreground text-sm transition-colors hover:text-foreground"
              href="/terms"
            >
              Terms
            </a>
            <a
              className="text-muted-foreground text-sm transition-colors hover:text-foreground"
              href="/privacy"
            >
              Privacy
            </a>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button size="icon-sm" variant="outline">
            <GithubIcon />
          </Button>
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}
