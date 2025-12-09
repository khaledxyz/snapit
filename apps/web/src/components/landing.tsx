import { Shortener } from "./shortener";
import { UrlsList } from "./urls-list";

export function Landing() {
  return (
    <main className="container relative border-x py-12">
      <div className="mb-20 space-y-6 text-center">
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
        <UrlsList />
      </div>
    </main>
  );
}
