import type { UrlDto } from "@snapit/sdk";

import { ExternalLink, Link2, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { Spinner } from "@/components/ui/spinner";
import { useDeleteUrl } from "@/hooks/urls";
import { usePrompt } from "@/hooks/use-prompt";
import { timeAgo, toggleHttps } from "@/lib/utils";

export function ShortUrl({ url }: { url: UrlDto }) {
  const deleteUrl = useDeleteUrl();
  const prompt = usePrompt();
  const shortUrl = `${import.meta.env.VITE_SHORT_URL}/${url.code}`;

  async function handleDeleteUrl() {
    const confirm = await prompt({
      title: "Delete URL?",
      description:
        "Are you sure you want to delete this short URL? This action cannot be undone and all associated data will be permanently removed.",
    });

    if (!confirm) {
      return;
    }

    await deleteUrl.mutateAsync(url.code);
  }
  return (
    <Item className="w-full" variant="outline">
      <ItemMedia variant="icon">
        <Link2 />
      </ItemMedia>

      <ItemContent>
        <ItemTitle>
          <a
            className="underline"
            href={shortUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {toggleHttps(shortUrl, "remove")}
          </a>
        </ItemTitle>
        <ItemDescription className="line-clamp-1 max-w-96 text-ellipsis">
          <a
            className="underline"
            href={url.originalUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {toggleHttps(url.originalUrl, "remove")}
          </a>
        </ItemDescription>
      </ItemContent>

      <ItemActions className="gap-1">
        <CopyButton content={shortUrl} helperText="Copy Short Url" />
        <Button
          render={
            <a href={shortUrl} rel="noopener noreferrer" target="_blank">
              <ExternalLink />
            </a>
          }
          size="icon"
          variant="outline"
        />

        <Button
          disabled={deleteUrl.isPending}
          onClick={handleDeleteUrl}
          size="icon"
          variant="destructive-outline"
        >
          {deleteUrl.isPending ? <Spinner /> : <Trash2 />}
        </Button>
      </ItemActions>

      <ItemFooter className="justify-start gap-1">
        <Badge variant="outline">Created {timeAgo(url.createdAt)}</Badge>
        <Badge variant="outline">
          {url.clickCount
            ? `${url.clickCount} ${url.clickCount > 1 ? "Clicks" : "Click"}`
            : "No clicks yet"}
        </Badge>
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
