import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site.config";
import Link from "next/link";

export function CallToActions() {
    return (
        <section className="py-16 bg-card">
            <div className="container max-w-4xl">
                <div className="rounded-2xl  border border-primary/20 p-12 text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to deploy your own SnapIt?</h2>
                    <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                        SnapIt is open source and easy to deploy. Get your own URL shortener up and running in minutes.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href={siteConfig.links.github}
                            className={buttonVariants({ variant: "outline", size: "lg" })}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub Repository
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}