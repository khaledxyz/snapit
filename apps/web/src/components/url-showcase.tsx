import { CopyIcon, Trash2Icon } from "lucide-react";

import {
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

import { Button } from "./ui/button";
import { Item } from "./ui/item";

const fakeUrls = [
  {
    id: 1,
    original:
      "https://docs.example.com/api/v2/documentation/getting-started/authentication",
    short: "snapit.dev/d0c5",
    clicks: 1234,
  },
  {
    id: 2,
    original: "https://github.com/user/repository/pull/142/files/changes",
    short: "snapit.dev/gh42",
    clicks: 856,
  },
  {
    id: 3,
    original:
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=youtu.be&t=42s",
    short: "snapit.dev/yt9x",
    clicks: 2891,
  },
  {
    id: 4,
    original:
      "https://mail.google.com/mail/u/0/#inbox/FMfcgzGwHMZPxKjLmNqRtVwXbCdEfGhJ",
    short: "snapit.dev/ml7k",
    clicks: 423,
  },
];

export function UrlShowcase() {
  return (
    <section>
      <h2 className="mb-6 font-bold text-3xl tracking-tight">Your Links</h2>

      <div className="flex flex-col gap-1">
        {fakeUrls.map((url) => (
          <Item key={url.id} variant="outline">
            <ItemContent>
              <ItemTitle className="underline">{url.short}</ItemTitle>
              <ItemDescription>{url.original}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="icon" variant="outline">
                <CopyIcon />
              </Button>
              <Button size="icon" variant="destructive-outline">
                <Trash2Icon />
              </Button>
            </ItemActions>
          </Item>
        ))}
      </div>
    </section>
  );
}
