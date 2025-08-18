export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 scroll-mt-22">
      <div className="container max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Simple by Design</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Three steps to transform any URL into a clean, shareable link
          </p>
        </div>

        <div className="flex flex-col gap-12">
          <div className="flex gap-6 items-start">
            <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 border-4 border-primary/10">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                Paste your URL
              </h3>
              <p className="text-muted-foreground">
                Enter any long URL into the input field above - product pages,
                articles, files, or any web address.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 border-4 border-primary/10">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                Click &quot;Snap It&quot;
              </h3>
              <p className="text-muted-foreground">
                Our algorithm instantly generates a unique, short link that
                redirects to your original URL.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 border-4 border-primary/10">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                Share anywhere
              </h3>
              <p className="text-muted-foreground">
                Copy your new SnapIt link with a single click and share it
                across social media, emails, messages, or anywhere you need.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
