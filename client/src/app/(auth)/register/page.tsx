import { siteConfig } from "@/config/site.config";
import { RegisterForm } from "./components/register-form";
import { Background } from "@/components/background";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Form Section */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-md mx-auto">
                    <RegisterForm />
                </div>
            </div>

            {/* Background Section - Hidden on mobile/tablet */}
            <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
                <Background />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4 p-8">
                        <h2 className="text-2xl xl:text-3xl font-bold text-foreground/80">
                            Join {siteConfig.name} Today
                        </h2>
                        <p className="text-base xl:text-lg text-muted-foreground max-w-md">
                            {siteConfig.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
