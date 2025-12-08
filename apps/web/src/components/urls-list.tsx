/** biome-ignore-all lint/suspicious/noArrayIndexKey: <not needed> */
import { useGetUserUrls } from "@snapit/sdk";

import { ScrollArea } from "@/components/ui/scroll-area";

import { ShortUrl, ShortUrlSkeleton } from "./short-url";

export function UrlsList() {
  const { data: urls = [], isLoading } = useGetUserUrls();

  return (
    <div className="relative h-96 w-full overflow-hidden rounded-2xl border border-dashed">
      {/* Scroll shadows */}
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-6 bg-linear-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-6 bg-linear-to-t from-background to-transparent" />

      <ScrollArea className="h-full w-full p-3">
        <div className="space-y-2">
          {isLoading
            ? Array.from({ length: 5 }, (_, i) => <ShortUrlSkeleton key={i} />)
            : urls.map((url) => <ShortUrl key={url.id} url={url} />)}
        </div>
      </ScrollArea>
    </div>
  );
}
