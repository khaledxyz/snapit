"use client";

import { useGetUserUrls, useDeleteUrl } from "@/api/urls";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import {
  Copy,
  ExternalLink,
  Trash2,
  BarChart3,
  Link as LinkIcon,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePrompt } from "@/hooks/use-prompt/use-prompt";
import { toast } from "sonner";
import { ShortenerDialog } from "./_components/shortener-dialog";
import { ShortUrl } from "@/api/urls/constants";

export default function DashboardPage() {
  const prompt = usePrompt();
  const { data: urls, isLoading: urlsLoading, error } = useGetUserUrls();
  const { mutateAsync: deleteUrl } = useDeleteUrl();
  const [, copy] = useCopyToClipboard();

  async function handleDeleteUrl(shortCode: string) {
    const confirmed = await prompt({
      title: "Delete URL",
      description:
        "Are you sure you want to delete this URL? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
    });

    if (!confirmed) return;
    await deleteUrl(shortCode);
    toast("URL deleted successfully");
  }
  const totalUrls = urls?.length || 0;
  const totalClicks = urls?.reduce((sum, url) => sum + url.clicks, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total URLs</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUrls}</div>
            <p className="text-xs text-muted-foreground">
              Links you&apos;ve shortened
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              Across all your links
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Clicks
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalUrls > 0 ? Math.round(totalClicks / totalUrls) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Per shortened URL</p>
          </CardContent>
        </Card>
      </div>

      {/* URLs List */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="size-4" />
              Your Shortened URLs
            </CardTitle>
            <CardDescription>
              Manage and track all your shortened links
            </CardDescription>
          </div>
          <ShortenerDialog />
        </CardHeader>
        <CardContent>
          {urlsLoading ? (
            <UrlsListSkeleton />
          ) : error ? (
            <Alert>
              <AlertDescription>
                Failed to load your URLs. Please try refreshing the page.
              </AlertDescription>
            </Alert>
          ) : !urls || urls.length === 0 ? (
            <div className="text-center py-10">
              <LinkIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No URLs yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by creating your first shortened URL
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {urls.map((url) => {
                const shortenedUrl = `${process.env.NEXT_PUBLIC_REDIRECT_URL}/${url.shortCode}`;
                return (
                  <UrlItem
                    key={url.id}
                    url={url}
                    shortenedUrl={shortenedUrl}
                    onCopy={() => copy(shortenedUrl)}
                    onDelete={() => handleDeleteUrl(url.shortCode)}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function UrlItem({
  url,
  shortenedUrl,
  onCopy,
  onDelete,
}: {
  url: ShortUrl;
  shortenedUrl: string;
  onCopy: () => void;
  onDelete: () => void;
}) {
  return (
    <Alert className="flex items-center justify-between">
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={shortenedUrl}
            target="_blank"
            className="font-medium text-sm hover:underline"
          >
            {shortenedUrl.replace("https://", "")}
          </Link>
          <Badge variant="secondary" className="text-xs">
            {url.clicks} clicks
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {url.originalUrl}
        </p>
        <p className="text-xs text-muted-foreground">
          Created {new Date(url.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={onCopy} size="sm" variant="outline">
              <Copy size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy to clipboard</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={shortenedUrl} target="_blank">
              <Button size="sm" variant="outline">
                <ExternalLink size={16} />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>Open link</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onDelete}
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete URL</TooltipContent>
        </Tooltip>
      </div>
    </Alert>
  );
}

function UrlsListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Alert key={i}>
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-64" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </Alert>
      ))}
    </div>
  );
}
