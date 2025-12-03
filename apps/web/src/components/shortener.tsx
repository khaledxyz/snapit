import { BoltIcon } from "lucide-react";

import { Card, CardPanel } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Button } from "./ui/button";
import { Field, FieldLabel } from "./ui/field";

export function Shortener() {
  return (
    <Card>
      <CardPanel>
        <form class="flex items-end gap-1">
          <Field className="flex-1">
            <FieldLabel>Enter your long url</FieldLabel>
            <Input
              placeholder="https://example.com/pretty/long/url/that/needs/shortening"
              size="xl"
              type="email"
            />
          </Field>
          <Button size="xl" type="submit">
            Snapit
          </Button>
          <Button size="icon-xl" variant="outline">
            <BoltIcon />
          </Button>
        </form>
      </CardPanel>
    </Card>
  );
}
