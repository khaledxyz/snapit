/** biome-ignore-all lint/suspicious/noArrayIndexKey: <not needed> */
import { Activity } from "react";

import { GithubIcon, LinkIcon, LogInIcon } from "lucide-react";

import { ShortUrl, ShortUrlSkeleton } from "@/components/short-url";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserUrls } from "@/hooks/urls";
import { authClient } from "@/lib/auth-client";

import { GithubButton } from "./github-button";

const containerClasses =
  "relative h-96 w-full overflow-hidden rounded-xl border border-dashed";

export function UrlsList() {
  const { data: session, isPending } = authClient.useSession();
  const { data: urls = [], isLoading } = useUserUrls({
    enabled: !!session,
  });

  if (!session) {
    return <EmptyNotLoggedIn />;
  }

  if (!isPending && urls.length === 0) {
    return <EmptyNoUrls />;
  }

  return (
    <div className={containerClasses}>
      {/* Scroll shadows */}
      <Activity mode={urls.length < 4 ? "hidden" : "visible"}>
        <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-6 bg-linear-to-b from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-6 bg-linear-to-t from-background to-transparent" />
      </Activity>

      <ScrollArea className="h-full w-full p-3">
        <div className="space-y-2">
          <Activity mode={isLoading ? "hidden" : "visible"}>
            {isLoading
              ? Array.from({ length: 5 }, (_, i) => (
                  <ShortUrlSkeleton key={i} />
                ))
              : urls.map((url) => <ShortUrl key={url.id} url={url} />)}
          </Activity>
        </div>
      </ScrollArea>
    </div>
  );
}

function EmptyNotLoggedIn() {
  return (
    <Empty className={containerClasses}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LogInIcon />
        </EmptyMedia>
        <EmptyTitle>Login to view your short URLs</EmptyTitle>
        <EmptyDescription>
          Log in to create, manage, and track your shortened links.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <GithubButton>
          <span>Login With</span>
          <GithubIcon />
        </GithubButton>
      </EmptyContent>
    </Empty>
  );
}

function EmptyNoUrls() {
  return (
    <Empty className={containerClasses}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LinkIcon />
        </EmptyMedia>
        <EmptyTitle>No short URLs yet</EmptyTitle>
        <EmptyDescription>
          Create your first short URL to get started.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
