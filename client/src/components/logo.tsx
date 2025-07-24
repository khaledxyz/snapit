import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import Link from "next/link";

interface Props {
    showDescription?: boolean;
    isLink?: boolean;
    showName?: boolean;
}

export function Logo({
    showDescription,
    isLink,
    showName = true
}: Props) {
    const LogoContent = (
        <div className="flex items-center gap-3">
            <div className="relative">
                <div className="size-8 text-white bg-primary rounded-md flex items-center justify-center rotate-6">
                    <Zap size={16} />
                </div>
                <div className="absolute -bottom-1 -right-1 size-3 bg-pink-500 rounded-full" />
            </div>
            <div>
                {showName && (
                    <div className={cn(
                        'font-bold text-primary',
                        showDescription ? 'text-sm' : 'text-xl',
                    )}>SnapIt</div>
                )}
                {showDescription ? <div className="text-xs">{siteConfig.description}</div> : null}
            </div>
        </div>
    );

    return isLink ? (
        <Link href="/">
            {LogoContent}
        </Link>
    ) : LogoContent;
}