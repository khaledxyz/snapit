import { Fragment } from "preact/jsx-runtime";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container flex items-center justify-between border-x py-3">
        <Logo />
        <div className="flex items-center gap-1">
          <Fragment>
            <Button variant="ghost">Login</Button>
            <Button>Get Started</Button>
          </Fragment>
        </div>
      </div>
    </nav>
  );
}
