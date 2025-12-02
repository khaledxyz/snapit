import { Shortener } from "./shortener";
import { UrlShowcase } from "./url-showcase";

export function Landing() {
  return (
    <main className="container space-y-20 py-12">
      <div className="space-y-6 text-center">
        <h1 className="font-black text-6xl leading-[1.1] tracking-tighter md:text-7xl lg:text-8xl">
          Long URLs?
          <br />
          Snap 'em short.
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
          Transform unwieldy URLs into clean, shareable links in seconds. No
          fuss, no tracking, just pure speed.
        </p>
      </div>

      <Shortener />

      <UrlShowcase />

      <footer className="border-t py-8 text-center text-muted-foreground text-sm">
        <p>© 2025 SnapIt. Built with speed in mind.</p>
      </footer>
    </main>
  );
}
