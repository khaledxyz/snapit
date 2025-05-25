'use client'
import { ArrowLeft, Github, Menu, X } from "lucide-react";
import { Logo } from "./logo";
import Link from "next/link";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Fragment } from "react";
import { siteConfig } from "@/config/site.config";
import { usePathname } from "next/navigation";

export function Header() {
    const pathname = usePathname();
    const isHome = pathname === '/';

    return (
        <header className="sticky top-0 w-full z-10 border-b border-border/60 backdrop-blur-sm bg-background/80">
            <div className="container py-6 flex justify-between items-center">
                <Logo isLink />
                <MobileNav />
                {isHome ? <nav className="hidden md:flex items-center gap-6">
                    <Links />
                </nav> : (
                    <Link href="/" className="flex items-center gap-2 text-sm">
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                )}
            </div>
        </header>
    )
}

function Links() {
    return (
        <Fragment>
            <Link href="#features" className="">Features</Link>
            <Link href="#how-it-works" className="">How It Works</Link>
            {/* TODO: extract into a badge component */}
            <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 text-sm px-4 py-2 border border-border rounded-full hover:bg-card transition-colors"
            >
                <Github size={16} />
                <span>Star on GitHub</span>
            </Link>
        </Fragment>
    )
}

function MobileNav() {
    return (
        <Drawer direction="right">
            <DrawerTrigger asChild>
                <Button className="md:hidden" size='icon' variant="outline">
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
                <nav className="flex flex-col space-y-6">
                    <Links />
                </nav>
            </DrawerContent>
        </Drawer>
    )
}