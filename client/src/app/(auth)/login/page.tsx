import { siteConfig } from "@/config/site.config";
import { LoginForm } from "./components/login-form";
import { Background } from "@/components/background";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md mx-auto">
          <LoginForm />
        </div>
      </div>

      {/* Background Section - Hidden on mobile/tablet */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <Background />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <h2 className="text-2xl xl:text-3xl font-bold text-foreground/80">
              Welcome Back to {siteConfig.name}
            </h2>
            <p className="text-base xl:text-lg text-muted-foreground max-w-md">
              Sign in to access your dashboard and manage your shortened URLs
              with powerful analytics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
