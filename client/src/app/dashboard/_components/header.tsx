"use client";
import { Logo } from "@/components/logo";
import { UserDropdown } from "@/components/user-dropdown";

export function Header() {
  return (
    <header className="sticky top-0 w-full z-10 border-b border-border/60 backdrop-blur-sm bg-background/80">
      <div className="container py-6 flex items-center justify-between gap-10">
        <Logo isLink />
        <UserDropdown />
      </div>
    </header>
  );
}
