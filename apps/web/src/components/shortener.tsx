import type { ControllerRenderProps } from "react-hook-form";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { BoltIcon } from "lucide-react";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardPanel } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useCreateUrl } from "@/hooks/urls";
import { authClient } from "@/lib/auth-client";
import { toggleHttps } from "@/lib/utils";

const shortenerSchema = z.object({
  originalUrl: z.url("Invalid URL").min(1, "URL is required"),
  customCode: z
    .string()
    .regex(/^[a-zA-Z0-9_-]*$/, "Only letters, numbers, hyphens and underscores")
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug must be at most 50 characters")
    .optional()
    .or(z.literal("")),
  title: z
    .string()
    .max(200, "Title must be at most 200 characters")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(100, "Password must be at most 100 characters")
    .optional()
    .or(z.literal("")),
  expiresIn: z.enum(["never", "10m", "1h", "1d", "1w", "2w", "1M", "6M", "1y"]),
});

type ShortenerFormData = z.infer<typeof shortenerSchema>;

interface FieldState {
  invalid: boolean;
  error?: { message?: string };
}

const expiryOptions = [
  { value: "never", label: "Never" },
  { value: "10m", label: "10 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "1d", label: "1 day" },
  { value: "1w", label: "1 week" },
  { value: "2w", label: "2 weeks" },
  { value: "1M", label: "1 month" },
  { value: "6M", label: "6 months" },
  { value: "1y", label: "1 year" },
] as const;

function calculateExpiryDate(expiresIn: string): string | undefined {
  if (expiresIn === "never") {
    return;
  }

  const now = new Date();
  const durations: Record<string, number> = {
    "10m": 10 * 60 * 1000,
    "1h": 60 * 60 * 1000,
    "1d": 24 * 60 * 60 * 1000,
    "1w": 7 * 24 * 60 * 60 * 1000,
    "2w": 14 * 24 * 60 * 60 * 1000,
    "1M": 30 * 24 * 60 * 60 * 1000,
    "6M": 180 * 24 * 60 * 60 * 1000,
    "1y": 365 * 24 * 60 * 60 * 1000,
  };

  const duration = durations[expiresIn];
  if (!duration) {
    return;
  }

  return new Date(now.getTime() + duration).toISOString();
}

export function Shortener() {
  const { data: session } = authClient.useSession();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const createUrl = useCreateUrl();

  const form = useForm<ShortenerFormData>({
    mode: "onSubmit",
    resolver: zodResolver(shortenerSchema),
    defaultValues: {
      originalUrl: "",
      customCode: "",
      title: "",
      password: "",
      expiresIn: "never",
    },
  });

  const handleSubmit = async (data: ShortenerFormData) => {
    setGeneratedCode(null);

    try {
      const result = await createUrl.mutateAsync({
        originalUrl: data.originalUrl,
        customCode: data.customCode || undefined,
        title: data.title || undefined,
        password: data.password || undefined,
        expiresAt: calculateExpiryDate(data.expiresIn),
      });

      setGeneratedCode(result.code || null);
      form.reset();
      setShowAdvanced(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  const formData = form.watch();
  const hasAdvancedOptions = Boolean(
    formData.customCode ||
      formData.title ||
      formData.password ||
      formData.expiresIn !== "never"
  );

  return (
    <Card>
      <CardPanel className="space-y-4">
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex items-start gap-1">
            <Controller
              control={form.control}
              name="originalUrl"
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<ShortenerFormData, "originalUrl">;
                fieldState: FieldState;
              }) => (
                <Field className="flex-1" invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Enter your long url
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="https://example.com/pretty/long/url/that/needs/shortening"
                    size="xl"
                    type="url"
                  />
                  <FieldError match={Boolean(fieldState.error)}>
                    {fieldState.error?.message}
                  </FieldError>
                </Field>
              )}
            />
            <div className="flex gap-1 pt-6">
              <Button disabled={createUrl.isPending} size="xl" type="submit">
                {createUrl.isPending ? <Spinner /> : null}
                Snapit
              </Button>
              <Button
                onClick={() => setShowAdvanced(!showAdvanced)}
                size="icon-xl"
                type="button"
                variant="outline"
              >
                <BoltIcon />
              </Button>
            </div>
          </div>

          {showAdvanced ? (
            <div className="space-y-4">
              <Controller
                control={form.control}
                name="customCode"
                render={({
                  field,
                  fieldState,
                }: {
                  field: ControllerRenderProps<ShortenerFormData, "customCode">;
                  fieldState: FieldState;
                }) => (
                  <Field invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Custom Slug</FieldLabel>
                    <Input
                      {...field}
                      autoComplete="off"
                      disabled={createUrl.isPending || !session}
                      id={field.name}
                      placeholder="my-custom-link"
                    />
                    <FieldError match={Boolean(fieldState.error)}>
                      {fieldState.error?.message}
                    </FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="title"
                render={({
                  field,
                  fieldState,
                }: {
                  field: ControllerRenderProps<ShortenerFormData, "title">;
                  fieldState: FieldState;
                }) => (
                  <Field invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                    <Input
                      {...field}
                      autoComplete="off"
                      disabled={createUrl.isPending}
                      id={field.name}
                      placeholder="My Awesome Link"
                    />
                    <FieldError match={Boolean(fieldState.error)}>
                      {fieldState.error?.message}
                    </FieldError>
                  </Field>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <Controller
                  control={form.control}
                  name="password"
                  render={({
                    field,
                    fieldState,
                  }: {
                    field: ControllerRenderProps<ShortenerFormData, "password">;
                    fieldState: FieldState;
                  }) => (
                    <Field invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        {...field}
                        autoComplete="new-password"
                        disabled={createUrl.isPending}
                        id={field.name}
                        placeholder="Optional password"
                        type="password"
                      />
                      <FieldError match={Boolean(fieldState.error)}>
                        {fieldState.error?.message}
                      </FieldError>
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="expiresIn"
                  render={({
                    field,
                    fieldState,
                  }: {
                    field: ControllerRenderProps<
                      ShortenerFormData,
                      "expiresIn"
                    >;
                    fieldState: FieldState;
                  }) => (
                    <Field invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Expires In</FieldLabel>
                      <Select
                        name={field.name}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger id={field.name}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {expiryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError match={Boolean(fieldState.error)}>
                        {fieldState.error?.message}
                      </FieldError>
                    </Field>
                  )}
                />
              </div>
            </div>
          ) : null}

          {hasAdvancedOptions ? <OptionsBadges data={formData} /> : null}
        </form>

        {createUrl.error ? (
          <Alert variant="error">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {createUrl.error instanceof Error
                ? createUrl.error.message
                : "Failed to create shortened URL"}
            </AlertDescription>
          </Alert>
        ) : null}

        {generatedCode ? (
          <Alert variant="success">
            <AlertTitle>Your shortened URL:</AlertTitle>
            <AlertDescription>
              <a
                className="font-mono underline"
                href={`${import.meta.env.VITE_SHORT_URL}/${generatedCode}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {toggleHttps(
                  `${import.meta.env.VITE_SHORT_URL}/${generatedCode}`,
                  "remove"
                )}
              </a>
            </AlertDescription>
          </Alert>
        ) : null}
      </CardPanel>
    </Card>
  );
}

function OptionsBadges({ data }: { data: ShortenerFormData }) {
  const badges = [
    data.customCode && (
      <Badge key="slug" variant="secondary">
        Slug: {data.customCode}
      </Badge>
    ),
    data.title && (
      <Badge key="title" variant="secondary">
        Title: {data.title}
      </Badge>
    ),
    data.password && (
      <Badge key="password" variant="secondary">
        Password protected
      </Badge>
    ),
    data.expiresIn !== "never" && (
      <Badge key="expires" variant="secondary">
        Expires: {expiryOptions.find((o) => o.value === data.expiresIn)?.label}
      </Badge>
    ),
  ].filter(Boolean);

  return badges.length > 0 ? (
    <div className="flex flex-wrap gap-2">{badges}</div>
  ) : null;
}
