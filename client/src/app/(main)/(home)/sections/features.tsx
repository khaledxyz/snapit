import { Badge } from "@/components/ui/badge";
import { BarChart, Link, Zap } from "lucide-react";

export function Features() {
    return (
        <section id="features" className="py-16 bg-muted/50 scroll-mt-22">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Why Choose SnapIt?</h2>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        Modern, minimal, and built for developers who need a reliable URL shortening solution
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
                        <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                            <Zap className="text-primary" size={24} />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
                        <p className="text-muted-foreground">Generate shortened URLs instantly with zero latency and minimal overhead.</p>
                        <div className="mt-4 pt-4 border-t border-border">
                            <div className="text-sm flex items-center gap-1">
                                <span className="text-muted-foreground">Optimized for performance</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
                        <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                            <Link className="text-primary" size={24} />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            Custom URLs
                            <Badge variant='outline'>Soon</Badge>
                        </h3>
                        <p className="text-muted-foreground">Create branded short links with custom slugs, perfect for sharing and marketing.</p>
                        <div className="mt-4 pt-4 border-t border-border">
                            <div className="text-sm">
                                <div className="text-muted-foreground">Example: <span className="font-mono">{process.env.NEXT_PUBLIC_REDIRECT_URL?.replace('https://', '')}/your-brand</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
                        <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                            <BarChart className="text-primary" size={24} />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            Analytics
                            <Badge variant='outline'>Soon</Badge>
                        </h3>
                        <p className="text-muted-foreground">Track clicks, referrers, and user locations with our simple yet powerful analytics.</p>
                        <div className="mt-4 pt-4 border-t border-border">
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                Privacy-focused - no personal data collection
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}