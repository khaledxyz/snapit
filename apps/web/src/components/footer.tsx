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
          <a
            className="text-muted-foreground text-sm"
            href="https://github.com/khaledxyz"
            rel="noopener noreferrer"
            target="_blank"
          >
            Created by <span className="underline">khaledxyz</span>
          </a>
        </div>

        <div className="flex items-center gap-1">
          <Button
            render={
              <a
                href="https://github.com/khaledxyz/snapit"
                rel="noopener noreferrer"
                target="_blank"
              >
                <GithubIcon />
              </a>
            }
            size="icon-sm"
            variant="outline"
          />
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}
