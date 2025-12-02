import { Card, CardPanel } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Button } from "./ui/button";

export function Shortener() {
  return (
    <Card>
      <CardPanel>
        <div class="flex items-center gap-1">
          <Input
            placeholder="https://example.com/pretty/long/url/that/needs/shortening"
            size="xl"
          />
          <Button size="xl" variant="outline">
            Snap it
          </Button>
        </div>
      </CardPanel>
    </Card>
  );
}
