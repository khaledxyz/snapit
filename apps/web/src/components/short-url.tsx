import type { ShortenedUrl } from "@/data/urls";

import { ExternalLink, Link2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { timeAgo } from "@/lib/utils";

import { Badge } from "./ui/badge";

interface Props {
  url: ShortenedUrl;
}
const PROTOCOL_REGEX = /https?:\/\//g;
const TRAILING_SLASH_REGEX = /\/$/;

export function ShortUrl({ url }: Props) {
  const shortUrl = `${import.meta.env.VITE_CLIENT_URL}/${url.shortCode}`;

  return (
    <Item className="w-full" variant="outline">
      <ItemMedia variant="icon">
        <Link2 />
      </ItemMedia>

      <ItemContent>
        <ItemTitle>
          <a className="underline" href={shortUrl}>
            {shortUrl.replace(/https?:\/\//g, " ")}
          </a>
        </ItemTitle>
        <ItemDescription className="line-clamp-1 max-w-52 text-ellipsis">
          <a className="underline" href={url.longUrl}>
            {url.longUrl
              .replace(PROTOCOL_REGEX, " ")
              .replace(TRAILING_SLASH_REGEX, "")}
          </a>
        </ItemDescription>
      </ItemContent>

      <ItemActions className="gap-1">
        <CopyButton content={shortUrl} helperText="Copy Short Url" />
        <Button size="icon" variant="outline">
          <ExternalLink />
        </Button>
        <Button size="icon" variant="destructive-outline">
          <Trash2 />
        </Button>
      </ItemActions>

      <ItemFooter className="justify-start gap-1">
        <Badge variant="outline">Created {timeAgo(url.createdAt)}</Badge>
        <Badge variant="outline">{url.clickCount} clicks</Badge>
      </ItemFooter>
    </Item>
  );
}

export function ShortUrlSkeleton() {
  return (
    <Item className="w-full" variant="outline">
      <ItemMedia variant="icon">
        <Skeleton className="h-full w-full" />
      </ItemMedia>

      <ItemContent>
        <ItemTitle>
          <Skeleton className="h-5 w-40" />
        </ItemTitle>

        <ItemDescription className="line-clamp-1 max-w-52">
          <Skeleton className="h-4 w-52" />
        </ItemDescription>
      </ItemContent>

      <ItemActions className="gap-1">
        <Skeleton className="size-9 rounded-md" />
        <Skeleton className="size-9 rounded-md" />
        <Skeleton className="size-9 rounded-md" />
      </ItemActions>

      <ItemFooter className="justify-start gap-1">
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="h-4 w-20 rounded-md" />
      </ItemFooter>
    </Item>
  );
}
