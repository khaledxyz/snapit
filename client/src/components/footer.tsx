import { Github } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";
import { siteConfig } from "@/config/site.config";

export function Footer() {
    return (
        <footer className="relative z-10 bg-background border-t border-border py-12">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <Logo showDescription isLink />

                    <div className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} SnapIt. MIT Licensed.
                    </div>

                    <div className="flex gap-6 text-sm">
                        <Link href='/privacy'>Privacy</Link>
                        <Link
                            href={siteConfig.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                        >
                            <Github size={14} />
                            <span>GitHub</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}