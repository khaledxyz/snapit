import { useMemo } from "react";

import { CircleSlashIcon } from "lucide-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import Background from "./background";
import { Shortener } from "./shortener";
import { Button } from "./ui/button";
import { UrlsList } from "./urls-list";

export function Landing() {
  // Check if the current URL matches the error pattern
  const error = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const message = params.get("message");

    if (window.location.pathname === "/error") {
      return {
        code,
        message,
      };
    }
    return null;
  }, []);

  return (
    <main className="container relative p-0">
      <div className="container relative border-x py-12">
        <div className="absolute inset-0 -z-10 opacity-30">
          <Background waveColor={[1, 1, 1]} />
        </div>
        <div className="mb-20 space-y-6 text-left">
          <h1 className="font-black text-5xl leading-[1.1] tracking-tighter md:text-6xl lg:text-7xl">
            Long URLs?
            <br />
            Snap 'em short.
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Transform unwieldy URLs into clean, shareable links in seconds. No
            fuss, no tracking, just pure speed.
          </p>
        </div>

        <div className="space-y-5">
          <Shortener />
          {error ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CircleSlashIcon />
                </EmptyMedia>
                <EmptyTitle>Error: {error.code}</EmptyTitle>
                <EmptyDescription>{error.message}</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.location.href = "/";
                    }
                  }}
                  variant="outline"
                >
                  Dismiss
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <UrlsList />
          )}
        </div>
      </div>
    </main>
  );
}
