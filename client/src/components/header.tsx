"use client";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Fragment } from "react";
import { useUser } from "@/api/auth";

export function Header() {
  return (
    <header className="sticky top-0 w-full z-10 border-b border-border/60 backdrop-blur-sm bg-background/80">
      <div className="container py-6 flex items-center justify-between">
        {/* Left: Logo and Nav */}
        <div className="flex items-center gap-8">
          <Logo isLink />
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features">Features</Link>
            <Link href="#how-it-works">How It Works</Link>
          </nav>
        </div>
        {/* Right: Action Buttons and Mobile Nav */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex">
            <HeaderActionButtons />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button className="md:hidden" size="icon" variant="outline">
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-6">
        <div className="flex items-center justify-between mb-8">
          <DrawerTitle className="text-lg font-medium">Menu</DrawerTitle>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <span className="sr-only">Close</span>
              <X size={18} />
            </Button>
          </DrawerTrigger>
        </div>
        <nav className="flex flex-col space-y-6"></nav>
      </DrawerContent>
    </Drawer>
  );
}

function HeaderActionButtons() {
  const { data: user } = useUser();
  return (
    <Fragment>
      {!user ? (
        <div className="flex items-center gap-2">
          <Link
            className={buttonVariants({ variant: "ghost", size: "sm" })}
            href="/login"
          >
            Login
          </Link>
          <Link
            className={buttonVariants({ variant: "outline", size: "sm" })}
            href="/register"
          >
            Get Started
          </Link>
        </div>
      ) : (
        <Link
          className={buttonVariants({ variant: "outline", size: "sm" })}
          href="/dashboard"
        >
          Go to Dashboard
        </Link>
      )}
    </Fragment>
  );
}
