import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import Link from "next/link";

interface Props {
    showDescription?: boolean
    isLink?: boolean
}

export function Logo({
    showDescription,
    isLink
}: Props) {
    const LogoContent = (
        <div className="flex items-center gap-3">
            <div className="relative">
                <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center rotate-6">
                    <Zap className="text-primary-foreground" size={16} />
                </div>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-accent rounded-full" />
            </div>
            <div>
                <div className={cn(
                    'font-bold text-primary-foreground',
                    showDescription ? 'text-sm' : 'text-xl',
                )}>SnapIt</div>
                {showDescription ? <div className="text-xs text-muted-foreground">{siteConfig.description}</div> : null}
            </div>
        </div>
    );

    return isLink ? (
        <Link href="/">
            {LogoContent}
        </Link>
    ) : LogoContent;
}