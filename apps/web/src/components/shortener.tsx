import { urls } from "@snapit/sdk";
import { BoltIcon } from "lucide-react";

import { Card, CardPanel } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Button } from "./ui/button";
import { Field, FieldLabel } from "./ui/field";

export function Shortener() {
  const handleTestCreate = async () => {
    try {
      const result = await urls.create({
        originalUrl: "https://example.com/very/long/url/that/needs/shortening",
      });

      console.log("Created URL:", result.data);
      console.log("Status:", result.status);
      console.log("Headers:", result.headers);
    } catch (error) {
      console.error("Failed to create URL:", error);
    }
  };

  return (
    <Card>
      <CardPanel>
        <div className="flex items-end gap-1">
          <Field className="flex-1">
            <FieldLabel>Enter your long url</FieldLabel>
            <Input
              placeholder="https://example.com/pretty/long/url/that/needs/shortening"
              size="xl"
              type="email"
            />
          </Field>
          <Button onClick={handleTestCreate} size="xl" type="button">
            Snapit
          </Button>
          <Button size="icon-xl" variant="outline">
            <BoltIcon />
          </Button>
        </div>
      </CardPanel>
    </Card>
  );
}
