import type { VariantProps } from "class-variance-authority";
import type { buttonVariants } from "@/components/ui/button";

import { Loader2Icon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface Props extends VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
}

export function GithubButton({ variant, size, children }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    setIsLoading(true);

    const { error } = await authClient.signIn.social({
      provider: "github",
      callbackURL: import.meta.env.VITE_CLIENT_URL,
    });

    if (error) {
      setIsLoading(false);
    }
  }

  return (
    <Button
      disabled={isLoading}
      onClick={handleLogin}
      size={size}
      variant={variant}
    >
      {isLoading ? <Loader2Icon className="animate-spin" /> : null}
      {children}
    </Button>
  );
}
