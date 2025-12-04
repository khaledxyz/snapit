import { GithubIcon } from "lucide-react";

import { GithubButton } from "@/components/github-button";
import { Logo } from "@/components/logo";
import { UserDropdown } from "@/components/user-dropdown";
import { authClient } from "@/lib/auth-client";

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <nav className="border-b">
      <div className="container flex items-center justify-between border-x py-3">
        <Logo />
        <div className="flex items-center gap-1">
          {!!session?.user && !isPending ? (
            <UserDropdown
              avatar={session.user.image}
              email={session.user.email}
              name={session.user.name}
            />
          ) : (
            <GithubButton variant="outline">
              Login With
              <GithubIcon />
            </GithubButton>
          )}
        </div>
      </div>
    </nav>
  );
}
