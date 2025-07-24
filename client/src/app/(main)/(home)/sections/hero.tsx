import { siteConfig } from "@/config/site.config";
import { Shortener } from "../components/shortener";

export function Hero() {
    return (
        <section className="py-20">
            <div className="container max-w-3xl text-center">
                {/* TODO: extract to badge component */}
                <div className="inline-block mb-6 px-4 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium">
                    Beta version just released! 🎉
                </div>
                <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-500">{siteConfig.description}</h1>
                <p className="text-muted-foreground text-lg mb-12 max-w-xl mx-auto">
                    Transform cumbersome URLs into clean, shareable links in a snap. Simple, fast, and completely open source.
                </p>
                <Shortener />
            </div>
        </section>
    )
}